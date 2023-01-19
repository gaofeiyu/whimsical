"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheDir = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const shelljs_1 = __importDefault(require("shelljs"));
const single_line_log_1 = require("single-line-log");
const getGitProjectName_js_1 = require("./getGitProjectName.js");
/**
 * 缓存目录在node_modules/.whim
 * 1. 检查当前项目是否有缓存目录
 * 2. 如果没有新建一个缓存目录
 */
async function createCacheDir(git, cachePath) {
    const projectName = (0, getGitProjectName_js_1.getGitProjectName)(git);
    const cacheProjectName = node_path_1.default.join(cachePath, projectName);
    if (!node_fs_1.default.existsSync(cachePath)) {
        node_fs_1.default.mkdirSync(cachePath);
    }
    if (node_fs_1.default.existsSync(cacheProjectName)) {
        shelljs_1.default.cd(cacheProjectName);
        if (git === shelljs_1.default.exec('git config remote.origin.url').toString().replace('\n', '')) {
            (0, single_line_log_1.stdout)('正在同步仓库最新代码...');
            shelljs_1.default.exec('git pull >/dev/null');
            // Todo 错误处理
            (0, single_line_log_1.stdout)('正在同步仓库最新代码 成功');
            console.log('');
        }
    }
    else {
        shelljs_1.default.cd(cachePath);
        (0, single_line_log_1.stdout)('正在克隆代码...');
        shelljs_1.default.exec(`git clone ${git} >/dev/null`);
        // Todo 错误处理
        (0, single_line_log_1.stdout)('正在克隆代码 成功');
        console.log('');
    }
}
exports.createCacheDir = createCacheDir;
