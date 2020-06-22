import { MongoClient } from 'mongodb';
import config from "../../../../../app/config/config";

export class MongoClientFactory {
    private static clients: { [key: string]: MongoClient } = {};

    static async createClient(contextName: string): Promise<MongoClient> {
        let client = MongoClientFactory.getClient(contextName);
        if (!client) {
            client = await MongoClientFactory.createAndConnectClient();
            MongoClientFactory.registerClient(client, contextName);
        }
        return client;
    }


    private static getClient(contextName: string): MongoClient | null {
        return MongoClientFactory.clients[contextName];
    }

    private static async createAndConnectClient(): Promise<MongoClient> {
        const client = new MongoClient(config.get('mongo.url'), { useUnifiedTopology: true, ignoreUndefined: true });
        await client.connect();
        return client;
    }

    private static registerClient(client: MongoClient, contextName: string): void {
        MongoClientFactory.clients[contextName] = client;
    }
}
