"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUId = require("uuid/v4");
class Unique {
    get Id() {
        return this.id;
    }
    constructor(id) {
        this.id = id === undefined
            ? UUId()
            : id;
    }
}
exports.default = Unique;
