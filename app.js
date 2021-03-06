const path = require('path');
const fs = require('fs');
const app = require('express')();
const request = require('superagent');
const cheerio = require('cheerio');
const co = require('co');
const OSS = require('ali-oss');
const config = require('./config');
const pkg = require('./package.json');

const client = new OSS({region: config.oss.region, accessKeyId: config.oss.accessKeyId, accessKeySecret: config.oss.accessKeySecret, bucket: config.oss.bucket});

const timer = 30 * 60 * 1000;

// initFile();
getAirData();
setInterval(getAirData, timer);

// 初始化数据
// function initFile() {
//   appendData('air.txt', `date,pm25,date,pm10,date,o3,date,no2,date,so2,date,co,date,t,date,p,date,h`);
// }

// 爬虫抓取数据
function getAirData() {
  request.get(config.url).end(function(err, json) {
    // 截取数据
    const start = json.text.indexOf('model=');
    const end = json.text.indexOf(';return model');
    let tday = json.text.slice(start, end).replace('\"', '"');
    const start1 = tday.indexOf('{');
    const t = JSON.parse(tday.slice(start1));
    // console.log('tday', t)

    // 格式化需要的数据
    const airData = {
      data: []
    };
    airData.city = t.city.name;
    t.iaqi.forEach((item) => {
      let obj = {};
      obj.p = item.p;
      obj.v = item.v[0];
      obj.h = item.h[0];
      airData.data.push(obj);
    })
    // console.log('airData', airData)
    const csvData = airData.data.map((item) => {
      return `${item.h},${item.v}`;
    });
    // console.log('csvData', csvData.join(','))
    // const qfile = path.join(config.fs.directory, 'new_air.txt');
    // const q = fs.readFileSync(qfile).toString();
    // const r = [];
    //
    // const ufile = path.join(config.fs.directory, 'air.txt');
    // JSON.parse(q).air.forEach((items) => {
    //   let o = items.data.map((item) => {
    //     return `${item.h},${item.v}`;
    //   })
    //   fs.appendFileSync(ufile, o.join(',') + '\n')
    // })

    // fs.appendFileSync(ufile, r)
    // const u = JSON.parse(`${q}`)
    // console.log('u', r.json(','))

    // 数据写入文件
    appendData('air.txt', csvData.join(','));

    // 文件上传到oss
    updateOSS('air', 'data/air.txt');
  })
}

// 数据写入文件
function appendData(key, data) {
  const file = path.join(config.fs.directory, key);
  fs.appendFileSync(file, data + '\n');
}

// 文件上传到oss
function updateOSS(key, file) {
  co(function * () {
    let result = yield client.put(key, file);
    // console.log(result);
  }).catch(function(err) {
    console.log(err);
  });
}

process.on('uncaughtException', function(err) {
  console.error('[%s][%s] Caught exception: [%s]', new Date(), process.pid, err);
  process.exit(1);
});

app.listen(config.port, function() {
  console.log(`${pkg.name} listening on port ${config.port} [${config.env}]`)
})
