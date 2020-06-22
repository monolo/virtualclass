import {DomainEventSubscriber} from "../domain/DomainEventSubscriber";
import {WebSocketDomainEvent} from "../domain/WebSocketDomainEvent";
import {DomainEventClass} from "../domain/DomainEvent";

export class OnWebsocketEmit implements DomainEventSubscriber<WebSocketDomainEvent>{

    constructor(private webSocketAction: Function) {}

    subscribedTo(): DomainEventClass[] {
        return [WebSocketDomainEvent]
    }

    async on(domainEvent: WebSocketDomainEvent){
        this.webSocketAction(domainEvent);
    }
}