import uuidv4 from 'uuid/v4';

export type Id = string;
export type Constructor<U extends Unique> = new (id?: Id) => U;

export default class Unique {

    public get id(): Id {
        return this.m_id;
    }
    private m_id: Id = uuidv4();

    public constructor (id?: Id) {
        if (typeof id !== 'undefined') this.m_id = id;
    }

}
