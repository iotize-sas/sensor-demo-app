export type NotificationItem = NotificationError | NotificationMessage;

export interface NotificationMessage {
  type: "error" | "warning" | "info";
  message: string;
  createdAt: Date;
}

export interface NotificationError extends NotificationMessage {
  error: Error;
}
