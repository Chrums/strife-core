import * as uuidv4 from 'uuid/v4';
export default class Unique {
    constructor(id) {
        this.m_id = uuidv4();
        if (typeof id !== 'undefined')
            this.m_id = id;
    }
    get id() {
        return this.m_id;
    }
}
