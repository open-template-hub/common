import { NextFunction, Request, Response } from 'express';
import { context } from './context';
import { MountArgs } from './interface/mount-args.interface';
import { MessageQueueProvider } from './provider/message-queue.provider';
import { MongoDbProvider } from './provider/mongo.provider';
import { PostgreSqlProvider } from './provider/postgre.provider';
import { RedisProvider } from './provider/redis.provider';
import { EncryptionUtil } from './util/encryption.util';
import { ErrorHandlerUtil } from './util/error-handler.util';

export function mount(args: MountArgs) {
  let mongodb_provider: MongoDbProvider | undefined;
  let redis_provider: RedisProvider | undefined;
  let message_queue_provider: MessageQueueProvider;
  let postgresql_provider: PostgreSqlProvider | undefined;
  let errorHandlerUtil: ErrorHandlerUtil;

  errorHandlerUtil = new ErrorHandlerUtil(args.ctxArgs.envArgs);

  try {
    if (args.ctxArgs.providerAvailability.mongo_enabled) {
      mongodb_provider = new MongoDbProvider(args.ctxArgs.envArgs);
      mongodb_provider.preload();
      args.ctxArgs.mongodb_provider = mongodb_provider;
      console.log('MongoDB Preloaded Successfully.');
    }
  } catch (e) {
    console.warn('Error while building MongoDB Provider: ', e);
  }

  try {
    if (args.ctxArgs.providerAvailability.postgre_enabled) {
      postgresql_provider = new PostgreSqlProvider(
        args.ctxArgs.envArgs,
        args.assets.applicationName
      );
      postgresql_provider.preload();
      args.ctxArgs.postgresql_provider = postgresql_provider;
      console.log('PostgreSQL Loaded Successfully.');
    }
  } catch (e) {
    console.warn('Error while building PostgreSQL Provider: ', e);
  }

  try {
    if (args.ctxArgs.providerAvailability.redis_enabled) {
      redis_provider = new RedisProvider(
        args.ctxArgs.envArgs,
        args.assets.applicationName
      );
      redis_provider.preload();
      args.ctxArgs.redis_provider = redis_provider;
      console.log('Redis Preloaded Successfully.');
    }
  } catch (e) {
    console.warn('Error while building Redis Provider: ', e);
  }

  try {
    if (args.ctxArgs.providerAvailability.mq_enabled) {
      message_queue_provider = new MessageQueueProvider(args.ctxArgs.envArgs);
      message_queue_provider
        ?.getChannel(args.assets.mqChannelTag)
        .then((channel: any) => {
          const queueConsumer = args.assets.queueConsumer.init(
            channel,
            args.ctxArgs
          );
          message_queue_provider.consume(
            args.assets.mqChannelTag,
            queueConsumer.onMessage,
            1
          );
        })
        .catch((e) => {
          console.warn('Error while starting MQ Channel: ', e);
        });

      args.ctxArgs.message_queue_provider = message_queue_provider;
      console.log('MQ Loaded Successfully.');
    }
  } catch (e) {
    console.warn('Error while building MQ: ', e);
  }

  /**
   * Cleanup operations on close
   */
  function onCloseCleanUp() {
    args.ctxArgs.message_queue_provider?.disconnect();
    console.log('Queue connection cleaned up..');

    args.ctxArgs.redis_provider?.releaseConnection();
    console.log('Redis connection cleaned up..');
  }

  // On Application Close
  process.on('SIGTERM', onCloseCleanUp);

  const responseInterceptor = (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const originalSend = res.send;
    const encryptionUtil = new EncryptionUtil(args.ctxArgs.envArgs);
    res.send = function () {
      console.log('Starting Encryption: ', new Date());
      let encrypted_arguments = encryptionUtil.encrypt(arguments);
      console.log('Encryption Completed: ', new Date());

      originalSend.apply(res, encrypted_arguments as any);
    } as any;

    next();
  };

  // Use this interceptor before routes
  args.app.use(responseInterceptor);

  // INFO: Keep this method at top at all times
  args.app.all(
    '/*',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // create context
        args.ctxArgs.req = req;
        res.locals.ctx = await context(args.ctxArgs);

        next();
      } catch (err) {
        let error = errorHandlerUtil.handle(err);
        res.status(error.code).json({ message: error.message });
      }
    }
  );

  // INFO: Add your routes here
  for (const route of args.routeArgs.routes) {
    args.app.use(route.name, route.router);
  }

  // Use for error handling
  args.app.use(function (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let error = errorHandlerUtil.handle(err);
    res.status(error.code).send({ message: error.message });
  });
}
