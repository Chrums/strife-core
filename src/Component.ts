import Entity from './Entity';
import Event, { Constructor as EventConstructor } from './Event';
import Scene from './Scene';
import Unique, { Id } from './Unique';

export type Constructor<EntityType extends Entity<EntityType>, ComponentType extends Component<EntityType>> = new (entity: EntityType) => ComponentType;

type Callback<EntityType extends Entity<EntityType>, EventType extends Event<EntityType>> = (event: EventType) => void;

export default class Component<EntityType extends Entity<EntityType>> extends Unique {
    
    private static componentConstructors: Constructor<any, any>[] = [];
    
    public static get Constructors(): Constructor<any, any>[] {
        return Component.componentConstructors;
    }
    
    private static callbacks: Map<Constructor<any, any>, Map<EventConstructor<any, any>, Callback<any, any>>> = new Map();
    
    public static get Callbacks(): Map<Constructor<any, any>, Map<EventConstructor<any, any>, Callback<any, any>>> {
        return Component.callbacks;
    }
    
    public static Initialize<EntityType extends Entity<EntityType>>(scene: Scene<EntityType>) {
        
        Component.Constructors.forEach(
            (componentConstructor: Constructor<EntityType, any>): void => {
                scene.Components.Register(componentConstructor)
            }
        );
        
        Component.Callbacks.forEach(
            (callbacks: Map<EventConstructor<any, any>, Callback<any, any>>, componentConstructor: Constructor<EntityType, any>): void => {
                callbacks.forEach(
                    (callback: Callback<any, any>, eventConstructor: EventConstructor<any, any>): void => {
                        scene.Dispatcher.On(eventConstructor)(
                            (event: Event<EntityType>): void => {
                                if (event.Entity === undefined) {
                                    scene.Components.All(componentConstructor).Each(
                                        (component: Component<EntityType>): void => {
                                            callback.call(component, event);
                                        }
                                    );
                                } else {
                                    const component = scene.Components.Get(componentConstructor)(event.Entity);
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
        Component.componentConstructors.push(componentConstructor);
    }
    
    public static On(eventConstructor: EventConstructor<any, any>): (target: any, identifier: string, descriptor: PropertyDescriptor) => void {
        return (target: any, _identifier: string, descriptor: PropertyDescriptor): void => {
            const componentConstructor = target.constructor as Constructor<any, any>;
            const callbacks = Component.Callbacks.has(componentConstructor)
                ? Component.Callbacks.get(componentConstructor) as Map<EventConstructor<any, any>, Callback<any, any>>
                : Component.Callbacks.set(componentConstructor, new Map()).get(componentConstructor) as Map<EventConstructor<any, any>, Callback<any, any>>;
            callbacks.set(eventConstructor, descriptor.value);
        };
    }
    
    private entity: EntityType;

    public get Entity(): EntityType {
        return this.entity;
    }
    
    public constructor(entity: EntityType, id?: Id) {
        super(id);
        this.entity = entity;
    }
    
}