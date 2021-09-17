/**
 * @description holds message queue provider
 */

import { EnvArgs } from '../interface/environment-args.interface';
import { QueueMessage } from '../interface/message.interface';
import * as Queue from 'amqplib';

export class MessageQueueProvider {
  private queueConnection: any | null;

  constructor(private envArgs: EnvArgs) {
    this.queueConnection = null;
  }

  connect = async () => {
    this.queueConnection = await Queue.connect(
      this.envArgs.mqArgs?.messageQueueConnectionUrl as string
    );
  };

  publish = async (message: QueueMessage, channelTag: string) => {
    await this.checkAndConnectOnNeed();

    var channel = await this.getChannel(channelTag);

    channel.sendToQueue(channelTag, Buffer.from(JSON.stringify(message)));
  };

  consume = async (channelTag: string, onMessage: any) => {
    await this.checkAndConnectOnNeed();

    var channel = await this.getChannel(channelTag);
    await channel.prefetch(1);
    await channel.consume(channelTag, onMessage, { noAck: false });
  };

  checkAndConnectOnNeed = async () => {
    if (!(this.queueConnection && this.queueConnection.connection)) {
      await this.connect();
    }
  };

  getChannel = async (channelTag: string) => {
    if (this.queueConnection) {
      var channel = await this.queueConnection.createChannel();
      await channel.assertQueue(channelTag, {
        durable: true,
      });
      return channel;
    } else {
      throw new Error('Queue connection not established');
    }
  };

  acknowledge = async (channelTag: string, msg: any) => {
    await this.checkAndConnectOnNeed();
    var channel = await this.getChannel(channelTag);
    channel.ack(msg);
  };
}
