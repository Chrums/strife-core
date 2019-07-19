import * as uuidv4 from 'uuid/v4';
import Serialization from './Serialization';

export type Id = string;
export type Constructor<UniqueType extends Unique> = new (id?: Id) => UniqueType;

@Serialization.Class
export default class Unique {
    
    protected m_id: Id;
    public get id(): Id {
        return this.m_id;
    }
    
    public constructor (id?: Id) {
        this.m_id = id === undefined
            ? uuidv4()
            : id;
    }
    
}