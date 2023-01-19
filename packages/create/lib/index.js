#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const minimist_1 = __importDefault(require("minimist"));
const cache_1 = require("./utils/cache");
const copyModel_1 = require("./utils/copyModel");
const getGitProjectName_1 = require("./utils/getGitProjectName");
const CACHE_PATH = './node_modules/.whim';
const cachePath = node_path_1.default.resolve(process.cwd(), CACHE_PATH);
async function init() {
    const { app: modelRoomAppName, _: localAppName, git: gitUrl, } = (0, minimist_1.default)(process.argv.slice(2), {
        string: ['_'],
    });
    if (!gitUrl) {
        console.log('缺少目标仓库');
        return;
    }
    if (!modelRoomAppName) {
        console.log('缺少目标模板参数');
        return;
    }
    if (!localAppName || localAppName.length === 0) {
        console.log('缺少本地要存入的位置');
        return;
    }
    const projectName = (0, getGitProjectName_1.getGitProjectName)(gitUrl);
    const modelDir = node_path_1.default.join(cachePath, projectName, 'example', modelRoomAppName);
    const targetDir = node_path_1.default.join(process.cwd(), `./src/${localAppName}`);
    await (0, cache_1.createCacheDir)(gitUrl, cachePath);
    await (0, copyModel_1.copyModel)(modelDir, targetDir);
}
init().catch((e) => {
    console.error(e);
});
