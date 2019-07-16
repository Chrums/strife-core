"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unique_1 = require("./Unique");
class Component extends Unique_1.default {
    constructor(entity, id) {
        super(id);
        this.entity = entity;
    }
    static get Constructors() {
        return Component.componentConstructors;
    }
    static get Callbacks() {
        return Component.callbacks;
    }
    static Initialize(scene) {
        Component.Constructors.forEach((componentConstructor) => {
            scene.Components.Register(componentConstructor);
        });
        Component.Callbacks.forEach((callbacks, componentConstructor) => {
            callbacks.forEach((callback, eventConstructor) => {
                scene.Dispatcher.On(eventConstructor)((event) => {
                    if (event.Entity === undefined) {
                        scene.Components.All(componentConstructor).Each((component) => {
                            callback.call(component, event);
                        });
                    }
                    else {
                        const component = scene.Components.Get(componentConstructor)(event.Entity);
                        if (component !== undefined) {
                            callback.call(component, event);
                        }
                    }
                });
            });
        });
    }
    static Register(componentConstructor) {
        Component.componentConstructors.push(componentConstructor);
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
    get Entity() {
        return this.entity;
    }
}
Component.componentConstructors = [];
Component.callbacks = new Map();
exports.default = Component;
