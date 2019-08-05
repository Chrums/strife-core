"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Delegate_1 = __importDefault(require("./Delegate"));
class Dispatcher {
    constructor() {
        this.m_callbacks = new Map();
        this.m_events = new Map();
    }
    on(eventConstructor) {
        return this.onByEventTypeAndCallback.bind(this, eventConstructor);
    }
    onByEventTypeAndCallback(eventConstructor, callback) {
        if (!this.m_callbacks.has(eventConstructor))
            this.m_callbacks.set(eventConstructor, new Delegate_1.default());
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
exports.default = Dispatcher;
