"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = require("./Unique");
class Entity extends Unique_1.default {
    constructor(scene, id) {
        super(id);
        this.components = new Components(this);
        this.scene = scene;
    }
    get Scene() {
        return this.scene;
    }
    get Components() {
        return this.components;
    }
}
exports.default = Entity;
class Components {
    constructor(entity) {
        this.entity = entity;
    }
    add(componentConstructor) {
        return this.entity.Scene.Components.Add(componentConstructor)(this.entity);
    }
    remove(componentConstructor) {
        return this.entity.Scene.Components.Remove(componentConstructor)(this.entity);
    }
    get(componentConstructor) {
        return this.entity.Scene.Components.Get(componentConstructor)(this.entity);
    }
}
