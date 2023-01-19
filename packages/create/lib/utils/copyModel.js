"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyModel = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const shelljs_1 = __importDefault(require("shelljs"));
/**
 * 1. 判断要复制的内容是否存在，如果不存在退出
 * 2. 判断目的地是否存在，如果存在退出
 * 3. 进行复制
 */
function copyModel(modelDir, targetDir) {
    if (!node_fs_1.default.existsSync(modelDir)) {
        console.log('缺少需要复制的文件夹');
        return;
    }
    if (node_fs_1.default.existsSync(targetDir)) {
        console.log('当前项目已有需要拷贝的文件夹，请更换文件夹或删除原有文件夹');
        return;
    }
    shelljs_1.default.cp('-R', modelDir, node_path_1.default.join(targetDir, '..'));
}
exports.copyModel = copyModel;
