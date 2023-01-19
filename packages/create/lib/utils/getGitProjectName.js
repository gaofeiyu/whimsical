"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitProjectName = void 0;
const GIT_PROJECT_NAME_REGEXP = new RegExp(/\S*\/([\w-]*)\.git/);
function getGitProjectName(gitPath) {
    const match = gitPath.match(GIT_PROJECT_NAME_REGEXP) || [];
    return match.length >= 2 ? match[1] : '';
}
exports.getGitProjectName = getGitProjectName;
