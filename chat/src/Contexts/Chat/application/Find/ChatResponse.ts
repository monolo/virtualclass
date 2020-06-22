export type ChatResponse = {
    id: string;
    users: Array<string>;
    lastMessage?: {
        type: string,
        value: Object | string,
        createdAt: Date
    };
    unreadMessages: Number
}