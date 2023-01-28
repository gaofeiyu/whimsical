const GIT_PROJECT_NAME_REGEXP = new RegExp(/\S*\/([\w-]*)\.git/);

export function getGitProjectName(gitPath: string): string {
  const match = gitPath.match(GIT_PROJECT_NAME_REGEXP) || [];
  return match.length >= 2 ? match[1] : '';
}
