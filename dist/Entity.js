import Unique from './Unique';
export default class Entity extends Unique {
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
