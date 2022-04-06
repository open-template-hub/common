export type BusinessLogicActionType = {
  notification: {
    params: NotificationParams;
  };
};

export interface NotificationParams {
  timestamp: number;
  username: string;
  message: string;
}
