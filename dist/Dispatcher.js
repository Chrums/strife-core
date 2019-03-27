import Delegate from './Delegate';
export default class Dispatcher {
    constructor() {
        this.m_callbacks = new Map();
        this.m_events = new Map();
    }
    on(eventConstructor) {
        return this.onByEventTypeAndCallback.bind(this, eventConstructor);
    }
    onByEventTypeAndCallback(eventConstructor, callback) {
        if (!this.m_callbacks.has(eventConstructor))
            this.m_callbacks.set(eventConstructor, new Delegate());
        const delegate = this.m_callbacks.get(eventConstructor);
        delegate.on(callback);
    }
    emit(event) {
        const eventConstructor = event.constructor;
        const eventPriority = eventConstructor.Priority;
        if (typeof eventPriority === 'undefined')
            this.dispatchByEvent(event);
        else {
            if (!this.m_events.has(eventPriority))
                this.m_events.set(eventPriority, []);
            const events = this.m_events.get(eventPriority);
            events.push(event);
        }
    }
    dispatch() {
        this.m_events.forEach(this.dispatchByEvents.bind(this));
        this.m_events.clear();
    }
    dispatchByEvents(events) {
        events.forEach(this.dispatchByEvent.bind(this));
    }
    dispatchByEvent(event) {
        const eventConstructor = event.constructor;
        const delegate = this.m_callbacks.get(eventConstructor);
        if (typeof delegate !== 'undefined')
            delegate.emit(event);
    }
}
