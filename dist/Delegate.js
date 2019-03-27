export default class Delegate {
    constructor() {
        this.m_callbacks = [];
    }
    on(callback) {
        this.m_callbacks.push(callback);
    }
    emit(trigger) {
        this.m_callbacks.forEach((callback) => callback(trigger));
    }
}
