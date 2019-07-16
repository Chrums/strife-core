"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Delegate_1 = require("./Delegate");
class Dispatcher {
    constructor() {
        this.callbacks = new Map();
        this.events = new Map();
    }
    On(eventConstructor) {
        return this.OnByEventTypeAndCallback.bind(this, eventConstructor);
    }
    OnByEventTypeAndCallback(eventConstructor, callback) {
        if (!this.callbacks.has(eventConstructor))
            this.callbacks.set(eventConstructor, new Delegate_1.default());
        const delegate = this.callbacks.get(eventConstructor);
        delegate.On(callback);
    }
    Emit(event) {
        const eventConstructor = event.constructor;
        const eventPriority = eventConstructor.Priority;
        if (eventPriority === undefined)
            this.DispatchByEvent(event);
        else {
            if (!this.events.has(eventPriority))
                this.events.set(eventPriority, []);
            const events = this.events.get(eventPriority);
            events.push(event);
        }
    }
    Dispatch() {
        this.events.forEach(this.DispatchByEvents.bind(this));
        this.events.clear();
    }
    DispatchByEvents(events) {
        events.forEach(this.DispatchByEvent.bind(this));
    }
    DispatchByEvent(event) {
        const eventConstructor = event.constructor;
        const delegate = this.callbacks.get(eventConstructor);
        if (delegate !== undefined)
            delegate.Emit(event);
    }
}
exports.default = Dispatcher;
