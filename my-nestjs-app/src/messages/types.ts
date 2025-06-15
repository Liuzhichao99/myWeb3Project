export interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
} 