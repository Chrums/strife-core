import Component, { Constructor as ComponentConstructor } from './Component';
import Entity from './Entity';
import { Optional } from './Optional';
import { Id } from './Unique';

export type Constructor<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>, StorageType extends IStorage<EntityType, ComponentType>> = new (componentConstructor: ComponentConstructor<any, ComponentType>) => StorageType;

export type Callback<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> = (component: ComponentType) => void;

export interface IStorage<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> {
    add: (entity: EntityType) => ComponentType;
    remove: (entity: EntityType) => boolean;
    get: (entity: EntityType) => Optional<ComponentType>;
    forEach: (callback: Callback<EntityType, ComponentType>) => void;
}

export default class Storage<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> implements IStorage<EntityType, ComponentType> {

    private m_componentConstructor: ComponentConstructor<EntityType, ComponentType>;
    private m_components: Map<Id, ComponentType> = new Map();

    public constructor(componentConstructor: ComponentConstructor<EntityType, ComponentType>) {
        this.m_componentConstructor = componentConstructor;
    }

    public add(entity: EntityType): ComponentType {
        const component = new this.m_componentConstructor(entity);
        this.m_components.set(entity.id, component);
        return component;
    }
    
    public remove(entity: EntityType): boolean {
        return this.m_components.delete(entity.id);
    }

    public get(entity: EntityType): Optional<ComponentType> {
        return this.m_components.get(entity.id);
    }
    
    public forEach(callback: Callback<EntityType, ComponentType>): void {
        this.m_components.forEach(callback);
    }

}