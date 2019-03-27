import Delegate from '@core/Delegate';
import Entity from '@core/Entity';
import Event, { Constructor as EventConstructor } from '@core/Event';

export type Callback<EntityType extends Entity<EntityType>, EventType extends Event<EntityType>> = (event: EventType) => void;

export default class Dispatcher<EntityType extends Entity<EntityType>> {
    
    private m_callbacks: Map<EventConstructor<EntityType, any>, Delegate<any>> = new Map();
    private m_events: Map<number, Event<EntityType>[]> = new Map();
    
    public on<EventType extends Event<EntityType>>(eventConstructor: EventConstructor<EntityType, EventType>): (callback: Callback<EntityType, EventType>) => void {
        return this.onByEventTypeAndCallback.bind(this, eventConstructor) as (callback: Callback<EntityType, EventType>) => void;
    }
    
    private onByEventTypeAndCallback<EventType extends Event<EntityType>>(eventConstructor: EventConstructor<EntityType, EventType>, callback: Callback<EntityType, EventType>): void {
        if (!this.m_callbacks.has(eventConstructor)) this.m_callbacks.set(eventConstructor, new Delegate<EventType>());
        const delegate = this.m_callbacks.get(eventConstructor) as Delegate<EventType>;
        delegate.on(callback);
    }
    
    public emit<EventType extends Event<EntityType>>(event: EventType): void {
        const eventConstructor = event.constructor as EventConstructor<EntityType, EventType>;
        const eventPriority = eventConstructor.Priority;
        if (typeof eventPriority === 'undefined') this.dispatchByEvent(event);
        else {
            if (!this.m_events.has(eventPriority)) this.m_events.set(eventPriority, []);
            const events = this.m_events.get(eventPriority) as Event<EntityType>[];
            events.push(event);
        }
    }
    
    public dispatch(): void {
        this.m_events.forEach(this.dispatchByEvents.bind(this));
        this.m_events.clear();
    }
    
    private dispatchByEvents<EventType extends Event<EntityType>>(events: EventType[]): void {
        events.forEach(this.dispatchByEvent.bind(this));
    }
    
    private dispatchByEvent<EventType extends Event<EntityType>>(event: EventType): void {
        const eventConstructor = event.constructor as EventConstructor<EntityType, EventType>;
        const delegate = this.m_callbacks.get(eventConstructor);
        if (typeof delegate !== 'undefined') delegate.emit(event);
    }
    
}