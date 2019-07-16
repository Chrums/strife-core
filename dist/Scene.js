"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./Component");
const Dispatcher_1 = require("./Dispatcher");
const Storage_1 = require("./Storage");
class Scene {
    constructor(entityConstructor) {
        this.components = new Components();
        this.dispatcher = new Dispatcher_1.default();
        this.entities = new Entities(this, entityConstructor);
        Component_1.default.Initialize(this);
    }
    get Entities() {
        return this.entities;
    }
    get Components() {
        return this.components;
    }
    get Dispatcher() {
        return this.dispatcher;
    }
}
exports.default = Scene;
class Entities {
    constructor(scene, entityConstructor) {
        this.scene = scene;
        this.entityConstructor = entityConstructor;
    }
    Add() {
        return new this.entityConstructor(this.scene);
    }
    Remove() {
        // TODO: Implement this...
        return false;
    }
    Get(id) {
        return new this.entityConstructor(this.scene, id);
    }
}
class Components {
    constructor() {
        this.storages = new Map();
    }
    Register(componentConstructor) {
        const storage = new Storage_1.default(componentConstructor);
        this.storages.set(componentConstructor, storage);
    }
    Add(componentConstructor) {
        return this.AddByComponentTypeAndEntity.bind(this, componentConstructor);
    }
    AddByComponentTypeAndEntity(componentConstructor, entity) {
        const storage = this.storages.get(componentConstructor);
        return storage.Add(entity);
    }
    Remove(componentConstructor) {
        return this.RemoveByComponentTypeAndEntity.bind(this, componentConstructor);
    }
    RemoveByComponentTypeAndEntity(componentConstructor, entity) {
        const storage = this.storages.get(componentConstructor);
        return storage.Remove(entity);
    }
    Get(componentConstructor) {
        return this.GetByComponentTypeAndEntity.bind(this, componentConstructor);
    }
    GetByComponentTypeAndEntity(componentConstructor, entity) {
        const storage = this.storages.get(componentConstructor);
        return storage.Get(entity);
    }
    All(componentConstructor) {
        return this.storages.get(componentConstructor);
    }
}
