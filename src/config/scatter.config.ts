export const options = {
  sign: true,
  // push_transaction 因cup问题失败后重试
  retry: {
    // 重试次数
    count: 6,
    // 每次间的延时
    delay: 1000,
  },
};
