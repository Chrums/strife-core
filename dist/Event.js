"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(entity) {
        this.m_entity = entity;
    }
    get entity() {
        return this.m_entity;
    }
}
exports.default = Event;
