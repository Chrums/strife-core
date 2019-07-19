import "reflect-metadata";
import Entity from './Entity';
import { Optional } from './Optional';
import Scene from './Scene';
import { Id } from './Unique';

type Constructor = new (...args: any[]) => void;

export default class Serialization {
    
    private static m_constructors: Map<string, Constructor> = new Map();
    
    private static m_properties: Map<Constructor, Map<string, string>> = new Map();
    
    private static m_hierarchy: Map<Constructor, Set<string>> = new Map();
    
    private static m_base: Set<string> = new Set([ 'Boolean', 'Null', 'Undefined', 'Number', 'BigInt', 'String', 'Symbol' ]);
    
    public static Initialize(): void {
        Serialization.m_constructors.forEach(
            (constructor: Constructor, constructorName: string): void => {
                const hierarchy = new Set<string>();
                Serialization.m_constructors.forEach(
                    (otherConstructor: Constructor, otherConstructorName: string): void => {
                        if (constructor.prototype instanceof otherConstructor) {
                            hierarchy.add(otherConstructorName);
                        }
                    }
                );
                Serialization.m_hierarchy.set(constructor, hierarchy);
            }
        );
    }
    
    public static Class(constructor: Constructor): void {
        const properties = new Map();
        const instance = new constructor();
        Object.getOwnPropertyNames(instance)
            .forEach(
                (propertyName: string): void => {
                    const property = (instance as any)[propertyName];
                    const propertyConstructorName = property.constructor === undefined
                        ? undefined
                        : property.constructor.name;
                    properties.set(propertyName, propertyConstructorName);
                }
            );
        Serialization.m_constructors.set(constructor.name, constructor);
        Serialization.m_properties.set(constructor, properties);
    }
    
    public static Property(target: Object, propertyName: string): void {
        const constructor = target.constructor as Constructor;
        const instance = new constructor();
        const properties = Serialization.m_properties.has(constructor)
            ? Serialization.m_properties.get(constructor) as Map<string, string>
            : Serialization.m_properties.set(constructor, new Map()).get(constructor) as Map<string, string>;
        const property = (instance as any)[propertyName];
        const propertyConstructorName = property.constructor === undefined
            ? undefined
            : property.constructor.name;
        properties.set(propertyName, propertyConstructorName);
        Serialization.m_constructors.set(constructor.name, constructor);
        Serialization.m_properties.set(constructor, properties);
    }
    
    public static Prototypes(constructor: Constructor, out?: Set<Constructor>): Set<Constructor> {
        if (out === undefined) {
            out = new Set();
        }
        
        out.add(constructor);
        
        const prototypeConstructor = constructor.prototype.__proto__.constructor;
        if (prototypeConstructor === Object) {
            return out;
        }
        
        return Serialization.Prototypes(prototypeConstructor, out);
    }
    
    public static Serialize(target: any): Optional<Data> {
        const constructor = target.constructor as Constructor;
        if (!(target instanceof Object)) {
            return new Data(constructor.name, [], target);
        }
        
        const prototypes = Serialization.Prototypes(constructor);
        const properties = new Set<string>();
        prototypes
            .forEach(
                (prototype: Constructor): void => {
                    const prototypeProperties = Serialization.m_properties.get(prototype);
                    if (prototypeProperties === undefined) {
                        return;
                    }
                    
                    prototypeProperties.forEach(
                        (prototypePropertyConstructorName: string, prototypePropertyName: string): void => {
                            properties.add(prototypePropertyName);
                        }
                    );
                }
            );
        
        
        
        const constructorNames = Array.from(prototypes)
            .map((constructor: Constructor): string => constructor.name);
        
        return new Data(
            constructor.name,
            constructorNames,
            Array.from(properties)
                .reduce(
                    (state: any, propertyName: string): any => {
                        const property = (target as any)[propertyName];
                        const value = Serialization.Serialize(property);
                        state[propertyName] = property.serialize === undefined
                            ? value
                            : property.serialize(value);
                        return state;
                    },
                    {}
                )
        );
    }
    
    public static Deserialize(data: Optional<Data>, target?: any): any {
        if (data === undefined) {
            return undefined;
        }
        
        if (Serialization.m_base.has(data.constructorName)) {
            return data.value;
        }
        
        const constructor = Serialization.m_constructors.get(data.constructorName);
        if (constructor === undefined) {
            return undefined;
        }
        
        const properties = Serialization.m_properties.get(constructor);
        if (properties === undefined) {
            return undefined;
        }
        
        const instance = target === undefined
            ? new constructor()
            : target;
        if ((instance as any).deserialize !== undefined) {
            (instance as any).deserialize(data);
        }
        
        properties.forEach(
            (propertyConstructorName: string, propertyName: string): void => {
                (instance as any)[propertyName] = Serialization.Deserialize(data.get(propertyName), instance);
            }
        );
        
        return instance;
    }
    
}

export class Data {
    
    private m_constructorName: string;
    public get constructorName(): string {
        return this.m_constructorName;
    }
    
    private m_constructorNames: string[];
    public get constructorNames(): string[] {
        return this.m_constructorNames;
    }
    
    private m_value: any;
    public get value(): any {
        return this.m_value;
    }
    
    private m_context: { [index: string]: any };
    public get context(): { [index: string]: any } {
        return this.m_context;
    }
    
    public constructor(constructorName: string, constructorNames: string[], data: any, context?: any) {
        this.m_constructorName = constructorName;
        this.m_constructorNames = constructorNames;
        this.m_value = data;
        this.m_context = context === undefined
            ? {}
            : context;
    }
    
    public get(index: string): Data {
        const data = this.m_value[index] as Data;
        return new Data(data.m_constructorName, data.m_constructorNames, data.m_value, this.m_context);
    }
    
}

export class Context {
    
}

// export class Context<EntityType extends Entity<EntityType>, DataType> {
    
//     private m_scene: Scene<EntityType, any>;
    
//     public get scene(): Scene<EntityType, any> {
//         return this.m_scene;
//     }
    
//     private m_data: DataType;
    
//     public get data(): DataType {
//         return this.m_data;
//     }
    
//     private m_references: any;
    
//     public constructor(scene: Scene<EntityType, any>, data: any, references: any = {}) {
//         this.m_scene = scene;
//         this.m_data = data;
//         this.m_references = references;
//     }
    
//     public get<IndexDataType>(index: string): Context<EntityType, IndexDataType> {
//         return new Context(this.m_scene, (this.data as { [index: string]: any })[index], this.m_references);
//     }
    
//     public resolve(id: Id): EntityType {
//         let referenceId = this.m_references[id];
//         if (referenceId === undefined) {
//             referenceId = this.m_scene.entities.add().id;
//             this.m_references[id] = referenceId;
//         }
//         return this.m_scene.entities.get(referenceId);
//     }
    
// }