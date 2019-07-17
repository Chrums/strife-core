"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = require("./Unique");
class Component extends Unique_1.default {
    constructor(entity) {
        super();
        this.m_entity = entity;
    }
    static Initialize(scene) {
        Component.Constructors.forEach((componentConstructor) => {
            scene.components.register(componentConstructor);
        });
        Component.Callbacks.forEach((callbacks, componentConstructor) => {
            callbacks.forEach((callback, eventConstructor) => {
                scene.dispatcher.on(eventConstructor)((event) => {
                    if (event.entity == undefined) {
                        scene.components.all(componentConstructor).forEach((component) => {
                            callback.call(component, event);
                        });
                    }
                    else {
                        const component = scene.components.get(componentConstructor)(event.entity);
                        if (component != undefined) {
                            callback.call(component, event);
                        }
                    }
                });
            });
        });
    }
    static Register(componentConstructor) {
        Component.m_componentConstructors.push(componentConstructor);
    }
    static get Constructors() {
        return Component.m_componentConstructors;
    }
    static On(eventConstructor) {
        return (target, _identifier, descriptor) => {
            const componentConstructor = target.constructor;
            const callbacks = Component.Callbacks.has(componentConstructor)
                ? Component.Callbacks.get(componentConstructor)
                : Component.Callbacks.set(componentConstructor, new Map()).get(componentConstructor);
            callbacks.set(eventConstructor, descriptor.value);
        };
    }
    static get Callbacks() {
        return Component.m_callbacks;
    }
    get entity() {
        return this.m_entity;
    }
}
Component.m_componentConstructors = [];
Component.m_callbacks = new Map();
exports.default = Component;
