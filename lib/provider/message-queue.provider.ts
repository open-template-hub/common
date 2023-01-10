/**
 * @description holds message queue provider
 */

import * as Queue from 'amqplib';
import { EnvArgs } from '../interface/environment-args.interface';
import { QueueMessage } from '../interface/message.interface';

export class MessageQueueProvider {
  private _connection: any;
  private _channel: any;

  constructor( private envArgs: EnvArgs ) {
  }

  getConnection = async () => {
    if ( !this._connection ) {
      this._connection = Queue.connect(
          this.envArgs.mqArgs?.messageQueueConnectionUrl as string
      );
    }

    return this._connection;
  };

  publish = async ( message: QueueMessage, channelTag: string ) => {
    const channel = await this.getChannel( channelTag );
    channel.sendToQueue( channelTag, Buffer.from( JSON.stringify( message ) ), {
      // to do not lose message on restart
      persistent: true,
    } );
  };

  consume = async (
      channelTag: string,
      onMessage: any,
      messageCount: number
  ) => {
    const channel = await this.getChannel( channelTag );
    channel.prefetch( messageCount );
    channel.consume( channelTag, onMessage, {
      // manual acknowledgment mode
      noAck: false,
    } );
  };

  getChannel = async ( channelTag: string ) => {
    if ( !this._channel ) {
      const connection = await this.getConnection();
      const channel = await connection.createChannel();
      await channel.assertQueue( channelTag, {
        // to do not lose channel on restart
        durable: true,
      } );
      this._channel = channel;
    }

    return this._channel;
  };

  disconnect = async () => {
    await this._channel.close();
    await this._connection.close();
    this._channel = null;
    this._connection = null;
  };
}
