export interface Chat {
    id: string;
    users: Array<string>;
    lastMessage: Object;
    unreadMessages: Number
    title?: string
}

export interface ChatPagination {
    chats: Array<Chat>,
    total: number
}

export interface Message {
    id: string,
    chatId: string,
    type: string,
    value: string | Object,
    createdAt: Date,
    sender: string,
    readBy?: Object
}

export interface ChatRepository {
    getBy(offset: number, limit: number): Promise<ChatPagination>
    chat(id: string): Promise<Chat>
    chatMessagesRead(id: string): Promise<void>
    createChat(id: string, user: string): Promise<void>
    sendMessage(id: string, chatId: string, type: string, value: string|Object): Promise<void>
    getMessagesBy(chatId: string): Promise<{messages: Array<Message>}>
}