export function copy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 延时
 * @param {Number} timeout
 */
export const delay = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
