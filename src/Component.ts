import Entity from './Entity';
import Event, { Constructor as EventConstructor } from './Event';
import Scene from './Scene';
import { IStorage } from './Storage';
import Unique from './Unique';

export type Constructor<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> = new (entity: EntityType) => ComponentType;

type Callback<EntityType extends Entity<EntityType>, EventType extends Event<EntityType>> = (event: EventType) => void;

export default class Component<EntityType extends Entity<EntityType>> extends Unique {
    
    public static Initialize<EntityType extends Entity<EntityType>, StorageType extends IStorage<EntityType, any>>(scene: Scene<EntityType, StorageType>) {
        Component.Constructors.forEach(
            (componentConstructor: Constructor<EntityType, any>): void => {
                scene.components.register(componentConstructor)
            }
        );
        Component.Callbacks.forEach(
            (callbacks: Map<EventConstructor<any, any>, Callback<any, any>>, componentConstructor: Constructor<EntityType, any>): void => {
                callbacks.forEach(
                    (callback: Callback<any, any>, eventConstructor: EventConstructor<any, any>): void => {
                        scene.dispatcher.on(eventConstructor)(
                            (event: Event<EntityType>): void => {
                                if (event.entity == undefined) {
                                    scene.components.all(componentConstructor).forEach(
                                        (component: Component<EntityType>): void => {
                                            callback.call(component, event);
                                        }
                                    );
                                } else {
                                    const component = scene.components.get(componentConstructor)(event.entity);
                                    if (component != undefined) {
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
        Component.m_componentConstructors.push(componentConstructor);
    }
    
    public static get Constructors(): Constructor<any, any>[] {
        return Component.m_componentConstructors;
    }
    private static m_componentConstructors: Constructor<any, any>[] = [];
    
    public static On(eventConstructor: EventConstructor<any, any>): (target: any, identifier: string, descriptor: PropertyDescriptor) => void {
        return (target: any, identifier: string, descriptor: PropertyDescriptor): void => {
            const componentConstructor = target.constructor as Constructor<any, any>;
            const callbacks = Component.Callbacks.has(componentConstructor)
                ? Component.Callbacks.get(componentConstructor) as Map<EventConstructor<any, any>, Callback<any, any>>
                : Component.Callbacks.set(componentConstructor, new Map()).get(componentConstructor) as Map<EventConstructor<any, any>, Callback<any, any>>;
            callbacks.set(eventConstructor, descriptor.value);
        };
    }
    
    public static get Callbacks(): Map<Constructor<any, any>, Map<EventConstructor<any, any>, Callback<any, any>>> {
        return Component.m_callbacks;
    }
    private static m_callbacks: Map<Constructor<any, any>, Map<EventConstructor<any, any>, Callback<any, any>>> = new Map();

    public get entity(): EntityType {
        return this.m_entity;
    }
    private m_entity: EntityType;
    
    public constructor(entity: EntityType) {
        super();
        this.m_entity = entity;
    }
    
}