import * as UUId from 'uuid/v4';

export type Id = string;

export type Constructor<UniqueType extends Unique> = new (id?: Id) => UniqueType;

export default class Unique {
    
    private id: Id;
    
    public get Id(): Id {
        return this.id;
    }
    
    public constructor (id?: Id) {
        this.id = id === undefined
            ? UUId()
            : id;
    }
    
}