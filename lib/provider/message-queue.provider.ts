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
    await this.connect();
    var channel = await this.getChannel(channelTag);
    channel.sendToQueue(channelTag, Buffer.from(JSON.stringify(message)));
  };

  consume = async (channelTag: string, onMessage: any) => {
    await this.connect();

    var channel = await this.getChannel(channelTag);
    await channel.prefetch(1);
    channel.consume(channelTag, onMessage, { noAck: false });
  };

  getChannel = async (channelTag: string) => {
    var channel = await this.queueConnection.createChannel();
    await channel.assertQueue(channelTag, {
      durable: true,
    });
    return channel;
  };

  acknowledge = async (channelTag: string, msg: any) => {
    await this.connect();
    var channel = await this.getChannel(channelTag);
    channel.ack(msg);
  };
}
