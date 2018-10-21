/**
 * @file 通信用的基地址，配置了测试环境和正式环境URL。
 */
const TEST_URL = process.env.TEST_GUESSING_HOST_URL;

const OFFICIAL_URL = process.env.ONLINE_GUESSING_HOST_URL;

export {TEST_URL,OFFICIAL_URL};
