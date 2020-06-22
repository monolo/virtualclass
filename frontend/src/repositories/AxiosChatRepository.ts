import Client, {httpGet, httpPost} from "@/repositories/AxiosRepository";
import {Chat, ChatPagination, ChatRepository, Message} from "@/interfaces/Chat";

const resource = '/chat';

export default new class AxiosChatRepository implements ChatRepository {
    async getBy(offset = 0, limit = 8): Promise<ChatPagination> {
        return new Promise((resolve, reject) => {
            Client()
                .get(`${resource}/chats`, {
                    params: {
                        offset,
                        limit
                    }
                })
                .then((data) => {
                    resolve(data.data);
                })
                .catch((e) => {
                    if (e.response && e.response.data && e.response.data.error) {
                        reject(e.response.data.error);
                    }
                    else reject(e);
                });
        });
    }

    chat(id: string): Promise<Chat> {
        return httpGet(`${resource}/${id}`);
    }
    chatMessagesRead(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }
    createChat(id: string, user: string): Promise<void> {
        return httpPost(`${resource}`, {
            id, user
        })
    }
    getMessagesBy(chatId: string): Promise<{messages: Array<Message>}> {
        return httpGet(`${resource}/messages`, {
            chatId: chatId
        });
    }
    sendMessage(id: string, chatId: string, type: string, value: any): Promise<void> {
        return httpPost(`${resource}/message`, {
           id, chatId, type, value
        });
    }
}