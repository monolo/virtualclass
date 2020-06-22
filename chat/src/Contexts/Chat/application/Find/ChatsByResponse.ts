import {ChatResponse} from "./ChatResponse";

export type ChatsByResponse = {
    chats: Array<ChatResponse>;
    total: number;
}