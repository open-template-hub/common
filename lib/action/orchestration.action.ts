import { NotificationParams } from './business-logic.action';

export type OrchestrationActionType = {
  pushNotification: {
    params: NotificationParams;
  };
};
