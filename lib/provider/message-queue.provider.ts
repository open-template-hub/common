/**
 * @description holds message queue provider
 */

import { EnvArgs } from '../interface/environment-args.interface';
import { QueueMessage } from '../interface/message.interface';
import * as Queue from 'amqplib';

export class MessageQueueProvider {
  constructor(private envArgs: EnvArgs) {}

  getConnection = async () => {
    return await Queue.connect(
      this.envArgs.mqArgs?.messageQueueConnectionUrl as string
    );
  };

  publish = async (message: QueueMessage, channelTag: string) => {
    var channel = await this.getChannel(channelTag);
    channel.sendToQueue(channelTag, Buffer.from(JSON.stringify(message)), {
      // to do not lose message on restart
      persistent: true,
    });
  };

  consume = async (
    channel: any,
    channelTag: string,
    onMessage: any,
    messageCount: number
  ) => {
    channel.prefetch(messageCount);
    channel.consume(channelTag, onMessage, {
      // manual acknowledgment mode
      noAck: false,
    });
  };

  getChannel = async (channelTag: string) => {
    var connection = await this.getConnection();
    var channel = await connection.createChannel();
    await channel.assertQueue(channelTag, {
      // to do not lose channel on restart
      durable: true,
    });
    return channel;
  };
}
