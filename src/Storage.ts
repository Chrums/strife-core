import Component, { Constructor as ComponentConstructor } from './Component';
import Entity from './Entity';
import { Optional } from './Optional';
import { Context } from './Serialization';
import { Id } from './Unique';

export type Constructor<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>, StorageType extends IStorage<EntityType, ComponentType>> = new (componentConstructor: ComponentConstructor<any, ComponentType>) => StorageType;

export type Callback<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> = (component: ComponentType) => void;

export type SerializationType = { [ entityId: string ]: any };

export interface IStorage<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> {
    add: (entity: EntityType) => ComponentType;
    remove: (entity: EntityType) => boolean;
    get: (entity: EntityType) => Optional<ComponentType>;
    forEach: (callback: Callback<EntityType, ComponentType>) => void;
    // serialize: () => SerializationType;
    // deserialize: (context: Context<EntityType, SerializationType>) => void;
}

export default class Storage<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> implements IStorage<EntityType, ComponentType> {

    private m_componentConstructor: ComponentConstructor<EntityType, ComponentType>;
    
    private m_components: Map<Id, ComponentType> = new Map();
    
    private m_indices: Map<Id, Id> = new Map();

    public constructor(componentConstructor: ComponentConstructor<EntityType, ComponentType>) {
        this.m_componentConstructor = componentConstructor;
    }

    public add(entity: EntityType): ComponentType {
        const component = new this.m_componentConstructor(entity);
        this.m_indices.set(entity.id, component.id);
        this.m_components.set(component.id, component);
        return component;
    }
    
    public remove(entity: EntityType): boolean {
        const componentId = this.m_indices.get(entity.id);
        return componentId === undefined
            ? false
            : this.m_components.delete(entity.id);
    }

    public get(entity: EntityType): Optional<ComponentType> {
        const componentId = this.m_indices.get(entity.id);
        return componentId === undefined
            ? undefined
            : this.m_components.get(entity.id);
    }
    
    public forEach(callback: Callback<EntityType, ComponentType>): void {
        this.m_components.forEach(callback);
    }
    
    // public serialize(): SerializationType {
    //     return Array.from(this.m_indices.entries())
    //         .reduce(
    //             (state: SerializationType, [ entityId, componentId ]): SerializationType => {
    //                 const component = this.m_components.get(componentId);
    //                 state[entityId] = component === undefined
    //                     ? undefined
    //                     : component.serialize();
    //                 return state;
    //             },
    //             {}
    //         );
    // }
    
    // public deserialize(context: Context<EntityType, SerializationType>): this {
    //     Object.keys(context.data)
    //         .forEach(
    //             (entityId: Id): void => {
    //                 const entity = context.resolve(entityId);
    //                 const component = this.add(entity);
    //                 component.deserialize(context.get(entityId));
    //             }
    //         );
    //     return this;
    // }

}