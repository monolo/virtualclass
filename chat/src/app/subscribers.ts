import container from './config/dependency-injection';
import { Definition } from 'node-dependency-injection';
import {RabbitMqEventBus} from "../Contexts/Shared/infrastructure/EventBus/rabbitmq/RabbitMqEventBus";
import {DomainEventSubscriber} from "../Contexts/Shared/domain/DomainEventSubscriber";
import {DomainEvent} from "../Contexts/Shared/domain/DomainEvent";

export function registerSubscribers() {
    const eventBus = container.get('Shared.EventBus') as RabbitMqEventBus;
    const subscriberDefinitions = container.findTaggedServiceIds('domainEventSubscriber') as Map<String, Definition>;
    const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];

    subscriberDefinitions.forEach((value: any, key: any) => subscribers.push(container.get(key)));
    eventBus.addSubscribers(subscribers);
}
