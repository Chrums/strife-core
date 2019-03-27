import Component, { Constructor as ComponentConstructor } from './Component';
import Dispatcher from './Dispatcher';
import Entity, { Constructor as EntityConstructor } from './Entity';
import Storage, { Constructor as StorageConstructor, IStorage } from './Storage';

export default class Scene<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>> {
    
    public get entities(): Entities<EntityType, StorageType> {
        return this.m_entities;
    }
    private m_entities: Entities<EntityType, StorageType>;
    
    public get components(): Components<EntityType, StorageType> {
        return this.m_components;
    }
    private m_components: Components<EntityType, StorageType>;
    
    public get dispatcher(): Dispatcher<EntityType> {
        return this.m_dispatcher;
    }
    private m_dispatcher: Dispatcher<EntityType> = new Dispatcher();
    
    public constructor(entityConstructor: EntityConstructor<EntityType>, storageConstructor: StorageConstructor<EntityType, any, StorageType>) {
        this.m_entities = new Entities(this, entityConstructor);
        this.m_components = new Components(this, storageConstructor);
        Component.Initialize(this);
    }
    
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
    
}

class Components<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>> {
    
    private m_scene: Scene<EntityType, StorageType>;
    private m_storageConstructor: StorageConstructor<EntityType, any, StorageType>;
    private m_storages: Map<ComponentConstructor<EntityType, any>, StorageType> = new Map();
    
    public constructor(scene: Scene<EntityType, StorageType>, storageConstructor: StorageConstructor<EntityType, any, StorageType>) {
        this.m_scene = scene;
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
    
}