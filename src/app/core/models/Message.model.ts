import { User } from "./User.model";

export interface Message {
  id: number,
  sender: User,
  content: string,
  timestamp: string
}
