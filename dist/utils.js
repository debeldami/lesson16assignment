"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res) => Promise.resolve(fn(req, res));
exports.asyncHandler = asyncHandler;
