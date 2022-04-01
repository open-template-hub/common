export type OrchestrationActionType = {
  notificationType: {
    default: {
      params: DefaultNotificationParams;
    }
  };
  language?: string;
};

export interface DefaultNotificationParams {
  username: string;
  message: string;
}
