import Component, { Constructor as ComponentConstructor } from './Component';
import Scene from './Scene';
import Unique from './Unique';

export type Constructor<EntityType extends Entity<EntityType>> = new (scene: Scene<EntityType, any>) => EntityType;

export default class Entity<EntityType extends Entity<EntityType>> extends Unique {
    
    public get scene(): Scene<EntityType, any> {
        return this.m_scene;
    }
    private m_scene: Scene<EntityType, any>;
    
    public get components(): Components<EntityType> {
        return this.m_components;
    }
    private m_components: Components<EntityType> = new Components(this as any);
    
    public constructor(scene: Scene<EntityType, any>) {
        super();
        this.m_scene = scene;
    }
    
}

class Components<EntityType extends Entity<EntityType>> {
    
    private m_entity: EntityType;
    
    public constructor(entity: EntityType) {
        this.m_entity = entity;
    }
    
    public add<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): ComponentType {
        return this.m_entity.scene.components.add(componentConstructor)(this.m_entity);
    }
    
    public remove<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): boolean {
        return this.m_entity.scene.components.remove(componentConstructor)(this.m_entity);
    }
    
    public get<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): Optional<ComponentType> {
        return this.m_entity.scene.components.get(componentConstructor)(this.m_entity);
    }
    
}