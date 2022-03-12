import { MessageQueueProvider } from './provider/message-queue.provider';
import { PostgreSqlProvider } from './provider/postgre.provider';
import { DebugLogUtil } from './util/debug-log.util';
import { ErrorHandlerUtil } from './util/error-handler.util';
import { PreloadUtil } from './util/preload.util';
import { NextFunction, Request, Response } from 'express';
import { EncryptionUtil } from './util/encryption.util';
import { context } from './context';
import { MongoDbProvider } from './provider/mongo.provider';
import { MountArgs } from './interface/mount-args.inteface';

export function mount(args: MountArgs) {
  var mongodb_provider: MongoDbProvider;
  var message_queue_provider: MessageQueueProvider;
  var postgresql_provider: PostgreSqlProvider;
  let errorHandlerUtil: ErrorHandlerUtil;
  const debugLogUtil = new DebugLogUtil();

  errorHandlerUtil = new ErrorHandlerUtil(debugLogUtil, args.ctxArgs.envArgs);

  message_queue_provider = new MessageQueueProvider(args.ctxArgs.envArgs);

  message_queue_provider
    ?.getChannel(args.assets.mqChannelTag)
    .then((channel: any) => {
      message_queue_provider.consume(
        channel,
        args.assets.mqChannelTag,
        args.assets.queueConsumer.onMessage,
        1
      );
    });

  const preloadUtil = new PreloadUtil();

  mongodb_provider = new MongoDbProvider(args.ctxArgs.envArgs);

  postgresql_provider = new PostgreSqlProvider(
    args.ctxArgs.envArgs,
    args.assets.applicationName
  );

  preloadUtil
    .preload(mongodb_provider, postgresql_provider)
    .then(() => console.log('DB preloads are completed.'));

  args.ctxArgs.message_queue_provider = message_queue_provider;
  args.ctxArgs.mongodb_provider = mongodb_provider;
  args.ctxArgs.postgresql_provider = postgresql_provider;

  const responseInterceptor = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    var originalSend = res.send;
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
    res.status(error.code).json({ message: error.message });
  });
}
