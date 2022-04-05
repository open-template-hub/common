export type OrchestrationActionType = {
  notificationType: {
    default: {
      params: DefaultNotificationParams;
    }
  };
};

export interface DefaultNotificationParams {
  id: string;
  username: string;
  message: string;
}
