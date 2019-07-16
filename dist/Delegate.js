"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Delegate {
    constructor() {
        this.callbacks = [];
    }
    On(callback) {
        this.callbacks.push(callback);
    }
    Emit(trigger) {
        this.callbacks.forEach((callback) => callback(trigger));
    }
}
exports.default = Delegate;
