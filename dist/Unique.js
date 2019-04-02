"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
class Unique {
    constructor(id) {
        this.m_id = uuidv4();
        if (typeof id !== 'undefined')
            this.m_id = id;
    }
    get id() {
        return this.m_id;
    }
}
exports.default = Unique;
