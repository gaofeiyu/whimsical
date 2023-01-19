/**
 * 缓存目录在node_modules/.whim
 * 1. 检查当前项目是否有缓存目录
 * 2. 如果没有新建一个缓存目录
 */
export declare function createCacheDir(git: any, cachePath: any): Promise<void>;
