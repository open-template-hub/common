export type OrchestrationActionType = {
  notificationType: {
    default: {
      params: DefaultNotificationParams;
    }
  };
  language?: string;
};

export interface DefaultNotificationParams {
  id: string;
  username: string;
  message: string;
}
