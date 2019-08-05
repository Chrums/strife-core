"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
class Unique {
    constructor(id) {
        this.m_id = v4_1.default();
        if (typeof id !== 'undefined')
            this.m_id = id;
    }
    get id() {
        return this.m_id;
    }
}
exports.default = Unique;
