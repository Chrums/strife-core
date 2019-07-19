import Component, { Constructor as ComponentConstructor } from './Component';
import Dispatcher from './Dispatcher';
import Entity, { Constructor as EntityConstructor } from './Entity';
import { Optional } from './Optional';
import { Context } from './Serialization';
import { Constructor as StorageConstructor, SerializationType as StorageSerializationType, IStorage } from './Storage';
import { Id } from './Unique';

export interface SerializationType {
    components: ComponentsSerializationType;
}

export default class Scene<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>> {
    
    private m_entities: Entities<EntityType, StorageType>;
    public get entities(): Entities<EntityType, StorageType> {
        return this.m_entities;
    }
    
    private m_components: Components<EntityType, StorageType>;
    public get components(): Components<EntityType, StorageType> {
        return this.m_components;
    }
    
    private m_dispatcher: Dispatcher<EntityType> = new Dispatcher();
    public get dispatcher(): Dispatcher<EntityType> {
        return this.m_dispatcher;
    }
    
    public constructor(entityConstructor: EntityConstructor<EntityType>, storageConstructor: StorageConstructor<EntityType, any, StorageType>) {
        this.m_entities = new Entities(this, entityConstructor);
        this.m_components = new Components(storageConstructor);
        Component.Initialize(this);
    }
    
    // public serialize(): SerializationType {
    //     return {
    //         components: this.components.serialize()
    //     };
    // }
    
    // public deserialize(context: Context<EntityType, SerializationType>): void {
    //     this.components.deserialize(context.get('components'));
    // }
    
}

class Entities<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>> {
    
    private m_scene: Scene<EntityType, StorageType>;
    
    private m_entityConstructor: EntityConstructor<EntityType>;
    
    public constructor(scene: Scene<EntityType, StorageType>, entityConstructor: EntityConstructor<EntityType>) {
        this.m_scene = scene;
        this.m_entityConstructor = entityConstructor;
    }
    
    public add(): EntityType {
        return new this.m_entityConstructor(this.m_scene);
    }
    
    public remove(): boolean {
        // TODO: Implement this...
        return false;
    }
    
    public get(id: Id): EntityType {
        return new this.m_entityConstructor(this.m_scene, id);
    }
    
}

type ComponentsSerializationType = { [ componentConstructorName: string]: StorageSerializationType };

class Components<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>> {
    
    private m_storageConstructor: StorageConstructor<EntityType, any, StorageType>;
    
    private m_storages: Map<ComponentConstructor<EntityType, any>, StorageType> = new Map();
    
    public constructor(storageConstructor: StorageConstructor<EntityType, any, StorageType>) {
        this.m_storageConstructor = storageConstructor;
    }
    
    public register<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): void {
        const storage = new this.m_storageConstructor(componentConstructor);
        this.m_storages.set(componentConstructor, storage);
    }
    
    public add<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): (entity: EntityType) => ComponentType {
        return this.addByComponentTypeAndEntity.bind(this, componentConstructor) as (entity: EntityType) => ComponentType;
    }
    
    private addByComponentTypeAndEntity<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>, entity: EntityType): ComponentType {
        const storage = this.m_storages.get(componentConstructor) as IStorage<EntityType, ComponentType>;
        return storage.add(entity);
    }
    
    public remove<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): (entity: EntityType) => boolean {
        return this.removeByComponentTypeAndEntity.bind(this, componentConstructor) as (entity: EntityType) => boolean;
    }
    
    private removeByComponentTypeAndEntity<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>, entity: EntityType): boolean {
        const storage = this.m_storages.get(componentConstructor) as IStorage<EntityType, ComponentType>;
        return storage.remove(entity);
    }
    
    public get<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): (entity: EntityType) => Optional<ComponentType> {
        return this.getByComponentTypeAndEntity.bind(this, componentConstructor) as (entity: EntityType) => Optional<ComponentType>;
    }
    
    private getByComponentTypeAndEntity<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>, entity: EntityType): Optional<ComponentType> {
        const storage = this.m_storages.get(componentConstructor) as StorageType;
        return storage.get(entity);
    }
    
    public all<ComponentType extends Component<EntityType>>(componentConstructor: ComponentConstructor<EntityType, ComponentType>): StorageType {
        return this.m_storages.get(componentConstructor) as StorageType;
    }
    
    // public serialize(): ComponentsSerializationType {
    //     return Array.from(this.m_storages.entries())
    //         .reduce(
    //             (state: ComponentsSerializationType, [ componentConstructor, storage ]): ComponentsSerializationType => {
    //                 state[componentConstructor.name] = storage.serialize();
    //                 return state;
    //             },
    //             {}
    //         );
    // }
    
    // public deserialize(context: Context<EntityType, ComponentsSerializationType>): this {
    //     Array.from(this.m_storages.entries())
    //         .forEach(
    //             ([ componentConstructor, storage ]): void => {
    //                 storage.deserialize(context.get(componentConstructor.name));
    //             }
    //         );
    //     return this;
    // }
    
}