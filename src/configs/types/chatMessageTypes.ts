interface Sender {
  _id: string;
  name: string;
  avatar: string;
}

interface Receiver {
  _id: string;
  name: string;
  avatar: string;
}

export interface ChatMessageFormType {
  sender: Sender;
  receiver: Receiver;
  message: string;
  seen: boolean;
}

export interface ChatMessage {
  _id: string;
  sender: Sender;
  receiver: Receiver;
  message: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}
