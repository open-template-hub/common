import { MessageQueueChannelType } from '../enum/message-queue-channel-type.enum';
import { ContextArgs } from './context.interface';

export interface QueueMessage {
  sender: MessageQueueChannelType;
  receiver: MessageQueueChannelType;
  message: any;
}

export interface QueueConsumer {
  init( channel: string, ctxArgs: ContextArgs ): QueueConsumer;

  onMessage( msg: any ): Promise<void>;
}
