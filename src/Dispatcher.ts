import Delegate from './Delegate';
import Entity from './Entity';
import Event, { Constructor as EventConstructor } from './Event';

export type Callback<EntityType extends Entity<EntityType>, EventType extends Event<EntityType>> = (event: EventType) => void;

export default class Dispatcher<EntityType extends Entity<EntityType>> {
    
    private callbacks: Map<EventConstructor<EntityType, any>, Delegate<any>> = new Map();
    
    private events: Map<number, Event<EntityType>[]> = new Map();
    
    public On<EventType extends Event<EntityType>>(eventConstructor: EventConstructor<EntityType, EventType>): (callback: Callback<EntityType, EventType>) => void {
        return this.OnByEventTypeAndCallback.bind(this, eventConstructor) as (callback: Callback<EntityType, EventType>) => void;
    }
    
    private OnByEventTypeAndCallback<EventType extends Event<EntityType>>(eventConstructor: EventConstructor<EntityType, EventType>, callback: Callback<EntityType, EventType>): void {
        if (!this.callbacks.has(eventConstructor)) this.callbacks.set(eventConstructor, new Delegate<EventType>());
        const delegate = this.callbacks.get(eventConstructor) as Delegate<EventType>;
        delegate.On(callback);
    }
    
    public Emit<EventType extends Event<EntityType>>(event: EventType): void {
        const eventConstructor = event.constructor as EventConstructor<EntityType, EventType>;
        const eventPriority = eventConstructor.Priority;
        if (eventPriority === undefined) this.DispatchByEvent(event);
        else {
            if (!this.events.has(eventPriority)) this.events.set(eventPriority, []);
            const events = this.events.get(eventPriority) as Event<EntityType>[];
            events.push(event);
        }
    }
    
    public Dispatch(): void {
        this.events.forEach(this.DispatchByEvents.bind(this));
        this.events.clear();
    }
    
    private DispatchByEvents<EventType extends Event<EntityType>>(events: EventType[]): void {
        events.forEach(this.DispatchByEvent.bind(this));
    }
    
    private DispatchByEvent<EventType extends Event<EntityType>>(event: EventType): void {
        const eventConstructor = event.constructor as EventConstructor<EntityType, EventType>;
        const delegate = this.callbacks.get(eventConstructor);
        if (delegate !== undefined) delegate.Emit(event);
    }
    
}