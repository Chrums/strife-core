"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = __importDefault(require("./Unique"));
class Entity extends Unique_1.default {
    constructor(scene) {
        super();
        this.m_components = new Components(this);
        this.m_scene = scene;
    }
    get scene() {
        return this.m_scene;
    }
    get components() {
        return this.m_components;
    }
}
exports.default = Entity;
class Components {
    constructor(entity) {
        this.m_entity = entity;
    }
    add(componentConstructor) {
        return this.m_entity.scene.components.add(componentConstructor)(this.m_entity);
    }
    remove(componentConstructor) {
        return this.m_entity.scene.components.remove(componentConstructor)(this.m_entity);
    }
    get(componentConstructor) {
        return this.m_entity.scene.components.get(componentConstructor)(this.m_entity);
    }
}
