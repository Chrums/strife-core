"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    constructor(componentConstructor) {
        this.m_components = new Map();
        this.m_componentConstructor = componentConstructor;
    }
    add(entity) {
        const component = new this.m_componentConstructor(entity);
        this.m_components.set(entity.id, component);
        return component;
    }
    remove(entity) {
        return this.m_components.delete(entity.id);
    }
    get(entity) {
        return this.m_components.get(entity.id);
    }
    forEach(callback) {
        this.m_components.forEach(callback);
    }
}
exports.default = Storage;
