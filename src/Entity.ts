import Component, { Constructor as ComponentConstructor } from './Component';
import { Optional } from './Optional';
import Scene from './Scene';
import Unique, { Id } from './Unique';

export type Constructor<EntityType extends Entity<EntityType>> = new (scene: Scene<EntityType>, id?: Id) => EntityType;

export default class Entity<EntityType extends Entity<EntityType>> extends Unique {
    
    private scene: Scene<EntityType>;
    
    public get Scene(): Scene<EntityType> {
        return this.scene;
    }
    
    private components: Components<EntityType> = new Components(this as any);
    
    public get Components(): Components<EntityType> {
        return this.components;
    }
    
    public constructor(scene: Scene<EntityType>, id?: Id) {
        super(id);
        this.scene = scene;
    }
    
}

class Components<EntityType extends Entity<EntityType>> {
    
    private entity: EntityType;
    
    public constructor(entity: EntityType) {
        this.entity = entity;
    }
    
    public add<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): ComponentType {
        return this.entity.Scene.Components.Add(componentConstructor)(this.entity);
    }
    
    public remove<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): boolean {
        return this.entity.Scene.Components.Remove(componentConstructor)(this.entity);
    }
    
    public get<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): Optional<ComponentType> {
        return this.entity.Scene.Components.Get(componentConstructor)(this.entity);
    }
    
}