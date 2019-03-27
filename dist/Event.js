export default class Event {
    constructor(entity) {
        this.m_entity = entity;
    }
    get entity() {
        return this.m_entity;
    }
}
