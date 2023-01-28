import ora from 'ora';

/**
 * 命令行loading
 * @param text loading中的文字
 * @param func 需要加loading的流程
 * @param ignore 是否忽略loading过程
 * @returns 返回func所返回的结果
 */
export async function loading(text: string, func: () => Promise<unknown>, ignore = false) {
  const spinner = ora({
    text,
    spinner: 'toggle6',
  });

  if (!ignore) {
    spinner.start();
  }
  spinner.color = 'yellow';
  spinner.text = text;
  try {
    const res = await func();
    spinner.succeed();
    return res;
  } catch (error) {
    spinner.stop();
    throw error;
  }
}
