export type BusinessLogicActionType = {
  notification: {
    params: NotificationParams;
  };
};

export interface NotificationParams {
  timestamp: number;
  username: string;
  message: string;
  sender: string;
  category: string;
  image?: string;
}
