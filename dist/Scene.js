"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./Component");
const Dispatcher_1 = require("./Dispatcher");
class Scene {
    constructor(entityConstructor, storageConstructor) {
        this.m_dispatcher = new Dispatcher_1.default();
        this.m_entities = new Entities(this, entityConstructor);
        this.m_components = new Components(this, storageConstructor);
        Component_1.default.Initialize(this);
    }
    get entities() {
        return this.m_entities;
    }
    get components() {
        return this.m_components;
    }
    get dispatcher() {
        return this.m_dispatcher;
    }
}
exports.default = Scene;
class Entities {
    constructor(scene, entityConstructor) {
        this.m_scene = scene;
        this.m_entityConstructor = entityConstructor;
    }
    add() {
        return new this.m_entityConstructor(this.m_scene);
    }
    remove() {
        // TODO: Implement this...
        return false;
    }
}
class Components {
    constructor(scene, storageConstructor) {
        this.m_storages = new Map();
        this.m_scene = scene;
        this.m_storageConstructor = storageConstructor;
    }
    register(componentConstructor) {
        const storage = new this.m_storageConstructor(componentConstructor);
        this.m_storages.set(componentConstructor, storage);
    }
    add(componentConstructor) {
        return this.addByComponentTypeAndEntity.bind(this, componentConstructor);
    }
    addByComponentTypeAndEntity(componentConstructor, entity) {
        const storage = this.m_storages.get(componentConstructor);
        return storage.add(entity);
    }
    remove(componentConstructor) {
        return this.removeByComponentTypeAndEntity.bind(this, componentConstructor);
    }
    removeByComponentTypeAndEntity(componentConstructor, entity) {
        const storage = this.m_storages.get(componentConstructor);
        return storage.remove(entity);
    }
    get(componentConstructor) {
        return this.getByComponentTypeAndEntity.bind(this, componentConstructor);
    }
    getByComponentTypeAndEntity(componentConstructor, entity) {
        const storage = this.m_storages.get(componentConstructor);
        return storage.get(entity);
    }
    all(componentConstructor) {
        return this.m_storages.get(componentConstructor);
    }
}
