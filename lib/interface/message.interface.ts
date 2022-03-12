import { MessageQueueChannelType } from '../enum/message-queue-channel-type.enum';

export interface QueueMessage {
  sender: MessageQueueChannelType;
  receiver: MessageQueueChannelType;
  message: any;
}

export interface QueueConsumer {
  onMessage(msg: any): Promise<void>;
}
