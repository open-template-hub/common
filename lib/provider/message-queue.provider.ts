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

  getConnection = () => {
    return this.queueConnection;
  };

  publish = async (message: QueueMessage, channelTag: string) => {
    await this.connect();
    var channel = await this.getChannel(channelTag);
    channel.sendToQueue(channelTag, Buffer.from(JSON.stringify(message)));
  };

  consume = async (channelTag: string, onMessage: any) => {
    await this.connect();

    var channel = await this.getChannel(channelTag);
    channel.consume(channelTag, onMessage);
  };

  getChannel = async (channelTag: string) => {
    var channel = await this.queueConnection.createChannel();
    await channel.assertQueue(channelTag);
    return channel;
  };

  acknowledge = async (channelTag: string, msg: any) => {
    await this.connect();
    var channel = await this.getChannel(channelTag);
    channel.ack(msg);
  };

  reject = async (channelTag: string, msg: any, requeue: boolean) => {
    await this.connect();
    var channel = await this.getChannel(channelTag);
    channel.reject(msg, requeue);
  };
}
