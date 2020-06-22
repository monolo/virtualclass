import amqp, {Connection} from "amqplib";
import config from "../../../app/config/config";

export class RabbitMqClientFactory {
    private static clients: { [key: string]: Connection } = {};

    static async createClient(contextName: string): Promise<Connection> {
        let client = RabbitMqClientFactory.getClient(contextName);
        if (!client) {
            client = await RabbitMqClientFactory.createAndConnectClient();
            RabbitMqClientFactory.registerClient(client, contextName);
        }
        return client;
    }


    private static getClient(contextName: string): Connection | null {
        return RabbitMqClientFactory.clients[contextName];
    }

    private static async createAndConnectClient(): Promise<Connection> {
        return await amqp.connect(config.get('rabbitmq.url'));
    }

    private static registerClient(client: Connection, contextName: string): void {
        RabbitMqClientFactory.clients[contextName] = client;
    }
}
