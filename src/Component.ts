import Entity from './Entity';
import Event, { Constructor as EventConstructor } from './Event';
import Scene from './Scene';
import Serialization from './Serialization';
import { IStorage } from './Storage';
import Unique, { Id } from './Unique';

export type Constructor<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> = new (entity: EntityType, id?: Id) => ComponentType;

type Callback<EntityType extends Entity<EntityType>, EventType extends Event<EntityType>> = (event: EventType) => void;

export type SerializationType = { [propertyName: string]: any };

export default class Component<EntityType extends Entity<EntityType>> extends Unique {
    
    private static m_constructors: Map<string, Constructor<any, any>> = new Map();
    public static get Constructors(): Map<string, Constructor<any, any>> {
        return Component.m_constructors;
    }
    
    private static m_serialization: Map<Constructor<any, any>, Set<string>> = new Map();
    public static get Serialization(): Map<Constructor<any, any>, Set<string>> {
        return Component.m_serialization;
    }
    
    private static m_callbacks: Map<Constructor<any, any>, Map<EventConstructor<any, any>, Callback<any, any>>> = new Map();
    public static get Callbacks(): Map<Constructor<any, any>, Map<EventConstructor<any, any>, Callback<any, any>>> {
        return Component.m_callbacks;
    }
    
    public static Initialize<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>>(scene: Scene<EntityType, StorageType>) {
        
        Component.m_constructors.forEach(
            (componentConstructor: Constructor<EntityType, any>): void => {
                scene.components.register(componentConstructor)
            }
        );
        
        Component.m_callbacks.forEach(
            (callbacks: Map<EventConstructor<any, any>, Callback<any, any>>, componentConstructor: Constructor<EntityType, any>): void => {
                callbacks.forEach(
                    (callback: Callback<any, any>, eventConstructor: EventConstructor<any, any>): void => {
                        scene.dispatcher.on(eventConstructor)(
                            (event: Event<EntityType>): void => {
                                if (event.entity === undefined) {
                                    scene.components.all(componentConstructor).forEach(
                                        (component: Component<EntityType>): void => {
                                            callback.call(component, event);
                                        }
                                    );
                                } else {
                                    const component = scene.components.get(componentConstructor)(event.entity);
                                    if (component !== undefined) {
                                        callback.call(component, event);
                                    }
                                }
                            }
                        );
                    }
                );
            }
        );
        
    }
    
    public static Register<ComponentType extends Component<any>>(componentConstructor: Constructor<any, ComponentType>): void {
        Component.m_constructors.set(componentConstructor.name, componentConstructor);
    }
    
    public static On(eventConstructor: EventConstructor<any, any>): (target: any, identifier: string, descriptor: PropertyDescriptor) => void {
        return (target: any, _identifier: string, descriptor: PropertyDescriptor): void => {
            const componentConstructor = target.constructor as Constructor<any, any>;
            const callbacks = Component.m_callbacks.has(componentConstructor)
                ? Component.m_callbacks.get(componentConstructor) as Map<EventConstructor<any, any>, Callback<any, any>>
                : Component.m_callbacks.set(componentConstructor, new Map()).get(componentConstructor) as Map<EventConstructor<any, any>, Callback<any, any>>;
            callbacks.set(eventConstructor, descriptor.value);
        };
    }
    
    @Serialization.Property
    private m_entity: EntityType;

    public get entity(): EntityType {
        return this.m_entity;
    }
    
    public constructor(entity: EntityType, id?: Id) {
        super(id);
        this.m_entity = entity;
    }
    
    // public serialize(): SerializationType {
    //     const propertyNames = Component.m_serialization.get(this.constructor as Constructor<EntityType, any>);
    //     if (propertyNames !== undefined) {
    //         return Array.from(propertyNames)
    //             .reduce(
    //                 (state: SerializationType, propertyName: string): SerializationType => {
    //                     const property = (this as any)[propertyName];
    //                     state[propertyName] = property.serialize === undefined
    //                         ? property
    //                         : property.serialize();
    //                     return state;
    //                 },
    //                 {}
    //             );
    //     }
    //     else return {};
    // }
    
    // public deserialize(context: Context<EntityType, any>): this {
    //     const propertyNames = Component.m_serialization.get(this.constructor as Constructor<EntityType, any>);
    //     if (propertyNames !== undefined) {
    //         Array.from(propertyNames)
    //             .forEach(
    //                 (propertyName: string): void => {
    //                     const property = (this as any)[propertyName];
    //                     (this as any)[propertyName] = property.deserialize === undefined
    //                         ? context.data[propertyName]
    //                         : property.deserialize(context.get(propertyName));
    //                 }
    //             );
    //     }
    //     return this;
    // }
    
}