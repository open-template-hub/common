import * as Queue from 'amqplib';
import { EnvArgs } from '../interface/environment-args.interface';
import { QueueMessage } from '../interface/message.interface';

export class MessageQueueProvider {
  private queueConnection: Queue.Connection | null;

  constructor(private envArgs: EnvArgs) {
    this.queueConnection = null;
  }

  connect = async () => {
    this.queueConnection = await Queue.connect(
      this.envArgs.messageQueueConnectionUrl as string
    );
  };

  publish = async (message: QueueMessage, queue: string) => {
    await this.checkAndConnectOnNeed();

    var channel = await this.getChannel(queue);

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  };

  consume = async (queue: string, onMessage: any) => {
    await this.checkAndConnectOnNeed();

    var channel = await this.getChannel(queue);
    await channel.prefetch(1);
    await channel.consume(queue, onMessage);
  };

  checkAndConnectOnNeed = async () => {
    if (!(this.queueConnection && this.queueConnection.connection)) {
      await this.connect();
    }
  };

  getChannel = async (queue: string) => {
    if (this.queueConnection) {
      var channel = await this.queueConnection.createChannel();
      await channel.assertQueue(queue, {
        durable: true,
      });
      return channel;
    } else {
      throw new Error('Queue connection not established');
    }
  };

  acknowledge = async (queue: string, msg: Queue.Message) => {
    await this.checkAndConnectOnNeed();
    var channel = await this.getChannel(queue);
    channel.ack(msg);
  };
}
