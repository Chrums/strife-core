"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    constructor(componentConstructor) {
        this.components = new Map();
        this.componentConstructor = componentConstructor;
    }
    Add(entity) {
        const component = new this.componentConstructor(entity);
        this.components.set(entity.Id, component);
        return component;
    }
    Remove(entity) {
        return this.components.delete(entity.Id);
    }
    Get(entity) {
        return this.components.get(entity.Id);
    }
    Each(callback) {
        this.components.forEach(callback);
    }
}
exports.default = Storage;
