import { MessageQueueChannelType } from '../enum/message-queue-channel-type.enum';
import { ContextArgs } from './context.interface';

export interface QueueMessage {
  sender: MessageQueueChannelType;
  receiver: MessageQueueChannelType;
  message: any;
}

export interface QueueConsumer {
  init(channel: string, ctxArgs: ContextArgs): QueueConsumer;

  onMessage(msg: any): Promise<void>;
}

export class AbstractQueueConsumer {
  protected channel: any;
  protected ctxArgs: ContextArgs = {} as ContextArgs;
  protected ownerChannelType: MessageQueueChannelType =
    MessageQueueChannelType.NOT_SET;

  protected init = (channel: string, ctxArgs: ContextArgs) => {
    this.channel = channel;
    this.ctxArgs = ctxArgs;
    return this;
  };

  protected operate = async (
    msg: any,
    msgObj: any,
    requeue: boolean,
    hook: Function
  ) => {
    try {
      console.log(
        'Message Received with deliveryTag: ' + msg.fields.deliveryTag,
        msgObj
      );
      await hook();
      await this.channel.ack(msg);
      console.log(
        'Message Processed with deliveryTag: ' + msg.fields.deliveryTag,
        msgObj
      );
    } catch (e) {
      console.log(
        'Error with processing deliveryTag: ' + msg.fields.deliveryTag,
        msgObj,
        e
      );

      await this.moveToDLQ(msg, requeue);
    }
  };

  protected moveToDLQ = async (msg: any, requeue: boolean) => {
    try {
      const orchestrationChannelTag =
        this.ctxArgs.envArgs.mqArgs?.orchestrationServerMessageQueueChannel;

      const message = {
        sender: this.ownerChannelType,
        receiver: MessageQueueChannelType.DLQ,
        message: {
          owner: this.ownerChannelType,
          msg,
        },
      } as QueueMessage;

      await this.ctxArgs.message_queue_provider?.publish(
        message,
        orchestrationChannelTag as string
      );

      console.log('Message moved to DLQ: ', msg);

      this.channel.reject(msg, false);
    } catch (e) {
      console.log('Error while moving message to DLQ: ', msg);
      this.channel.nack(msg, false, requeue);
    }
  };
}
