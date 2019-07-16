import Component, { Constructor as ComponentConstructor } from './Component';
import Entity from './Entity';
import { Optional } from './Optional';
import { Id } from './Unique';

export type Constructor<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>, StorageType> = new (componentConstructor: ComponentConstructor<EntityType, ComponentType>) => StorageType;

export type Callback<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> = (component: ComponentType) => void;

export default class Storage<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> {

    private componentConstructor: ComponentConstructor<EntityType, ComponentType>;
    private components: Map<Id, ComponentType> = new Map();

    public constructor(componentConstructor: ComponentConstructor<EntityType, ComponentType>) {
        this.componentConstructor = componentConstructor;
    }

    public Add(entity: EntityType): ComponentType {
        const component = new this.componentConstructor(entity);
        this.components.set(entity.Id, component);
        return component;
    }
    
    public Remove(entity: EntityType): boolean {
        return this.components.delete(entity.Id);
    }

    public Get(entity: EntityType): Optional<ComponentType> {
        return this.components.get(entity.Id);
    }
    
    public Each(callback: Callback<EntityType, ComponentType>): void {
        this.components.forEach(callback);
    }

}