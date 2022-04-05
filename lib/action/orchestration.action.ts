export type OrchestrationActionType = {
  notificationType: {
    default: {
      params: DefaultNotificationParams;
    }
  };
};

export interface DefaultNotificationParams {
  id: string;
  date: string;
  username: string;
  message: string;
}
