const Config = {
  url: 'http://aqicn.org/city/zhejiang/hangzhoushi/wolongqiao/cn/m',
  port: process.env.PORT || 3000,
  env: process.env.NODE_DEV || 'dev',
  oss: {
    accessKeyId: 'LTAIfs2v8Ypo8pd3',
    accessKeySecret: '9iox2mHv4BZ2IlVSVGGNwn2RO1dHme',
    region: 'oss-cn-hangzhou',
    bucket: 'air-data'
  },
  fs: {
    directory: './data'
  }
}

module.exports = Config;
