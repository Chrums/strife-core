import Entity from './Entity';
import { Optional } from './Optional';

export interface Constructor<EntityType extends Entity<EntityType>, EventType extends Event<EntityType>> {
    new (...args: any[]): EventType;
    Priority?: number;
}

export default class Event<EntityType extends Entity<EntityType>> {
    
    private entity?: EntityType;
    
    public get Entity(): Optional<EntityType> {
        return this.entity;
    }
    
    public constructor(entity?: EntityType) {
        this.entity = entity;
    }
    
}