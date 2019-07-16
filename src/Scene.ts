import Component, { Constructor as ComponentConstructor } from './Component';
import Dispatcher from './Dispatcher';
import Entity, { Constructor as EntityConstructor } from './Entity';
import { Optional } from './Optional';
import Storage from './Storage';
import { Id } from './Unique';

export default class Scene<EntityType extends Entity<EntityType>> {
    
    private entities: Entities<EntityType>;
    
    public get Entities(): Entities<EntityType> {
        return this.entities;
    }
    
    private components: Components<EntityType> = new Components();
    
    public get Components(): Components<EntityType> {
        return this.components;
    }
    
    private dispatcher: Dispatcher<EntityType> = new Dispatcher();
    
    public get Dispatcher(): Dispatcher<EntityType> {
        return this.dispatcher;
    }
    
    public constructor(entityConstructor: EntityConstructor<EntityType>) {
        this.entities = new Entities(this, entityConstructor);
        Component.Initialize(this);
    }
    
}

class Entities<EntityType extends Entity<EntityType>> {
    
    private scene: Scene<EntityType>;
    
    private entityConstructor: EntityConstructor<EntityType>;
    
    public constructor(scene: Scene<EntityType>, entityConstructor: EntityConstructor<EntityType>) {
        this.scene = scene;
        this.entityConstructor = entityConstructor;
    }
    
    public Add(): EntityType {
        return new this.entityConstructor(this.scene);
    }
    
    public Remove(): boolean {
        // TODO: Implement this...
        return false;
    }
    
    public Get(id: Id): EntityType {
        return new this.entityConstructor(this.scene, id);
    }
    
}

class Components<EntityType extends Entity<EntityType>> {
    
    private storages: Map<ComponentConstructor<EntityType, any>, Storage<EntityType, any>> = new Map();
    
    public Register<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): void {
        const storage = new Storage(componentConstructor);
        this.storages.set(componentConstructor, storage);
    }
    
    public Add<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): (entity: EntityType) => ComponentType {
        return this.AddByComponentTypeAndEntity.bind(this, componentConstructor) as (entity: EntityType) => ComponentType;
    }
    
    private AddByComponentTypeAndEntity<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>, entity: EntityType): ComponentType {
        const storage = this.storages.get(componentConstructor) as Storage<EntityType, ComponentType>;
        return storage.Add(entity);
    }
    
    public Remove<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): (entity: EntityType) => boolean {
        return this.RemoveByComponentTypeAndEntity.bind(this, componentConstructor) as (entity: EntityType) => boolean;
    }
    
    private RemoveByComponentTypeAndEntity<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>, entity: EntityType): boolean {
        const storage = this.storages.get(componentConstructor) as Storage<EntityType, ComponentType>;
        return storage.Remove(entity);
    }
    
    public Get<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): (entity: EntityType) => Optional<ComponentType> {
        return this.GetByComponentTypeAndEntity.bind(this, componentConstructor) as (entity: EntityType) => Optional<ComponentType>;
    }
    
    private GetByComponentTypeAndEntity<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>, entity: EntityType): Optional<ComponentType> {
        const storage = this.storages.get(componentConstructor) as Storage<EntityType, ComponentType>;
        return storage.Get(entity);
    }
    
    public All<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): Storage<EntityType, ComponentType> {
        return this.storages.get(componentConstructor) as Storage<EntityType, ComponentType>;
    }
    
}