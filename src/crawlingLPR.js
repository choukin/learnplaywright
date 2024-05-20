// const playwright, { chromium, webkit, firefox } = require('playwright');

const { chromium, webkit, firefox } = require('playwright');
const ora = require('ora')
const chalk = require('chalk')
const _ = require('lodash')
const program = require('commander')
var prompt = require('prompt');
const renderLine = require('./renderline.js')
const fs = require('fs');
const path = require('path')

const spinner = ora(chalk.green('🚚 数据爬取中...'))
spinner.color = 'green'
spinner.start();


let pageIndex = '1';
const pageUrl = renderPageUrl();
(async () => {
  const browser = await chromium.launch({
    // executablePath: playwright.executablePath(),
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // devtools: false,
    headless: true,
    slowMo: 1000 // 延时
  });
  const context = await browser.newContext();
  // debugger
  // Open new page
  const page = await context.newPage();
  await page.goto(pageUrl)
  spinner.text = chalk.green('页面加载中...');
  // const handle = await page.$('css=.newslist_style>a');
  await page.waitForLoadState();
  spinner.text = chalk.green('已打开第一页');
  spinner.succeed()

  spinner.text = chalk.green('获取总页数...');
  spinner.start()
  await page.$eval('a.pagingNormal', el => {
    console.log('> ===============', el)
  })

  const pageCount = await page.$$eval('a.pagingNormal', el => {
    console.log('>$$ ===============', el)
    let pageCount = 1
    if (el.length > 0) {
      const tageName = el[el.length - 1].getAttribute('tagname')
      const paths = tageName.split('/')
      let pageName = paths[paths.length - 1]
      pageCount = pageName.split('.')[0].replace('index', '')
    }
    return +pageCount
  });


  spinner.text = chalk.green(`总页数${pageCount}`);
  spinner.succeed()

  let handleHrefFn = []
  for (let index = 0; index < pageCount; index++) {
    pageIndex = index + 1
    const url = renderPageUrl()
    handleHrefFn.push(loadPageInfo(url, index, page))
  }
  spinner.text = chalk.green(`爬取链接...`);
  spinner.start()
  mergePromise(handleHrefFn).then(res => {
    result = _.flattenDeep(res);
    spinner.text = chalk.green(`共爬取 ${result.length} 条公告`);
    spinner.succeed()
    const fns = []
    result.forEach((item) => {
      fns.push(loadDetailPageInfo(item, context))
    })
    spinner.text = chalk.green(`LPR信息爬取中...`);
    spinner.start()
    mergePromise(fns).then(res => {
      console.log(`🚀 ~ mergePromise ~ res:`, res)
      const lprs = processCleanData(res)
      spinner.text = chalk.green(`LPR信息共 ${lprs.length} 条`);
      spinner.succeed()
      lprs.sort((pre, curr) => {
        return pre.time - curr.time
      });
      fs.writeFile(resolve('lprs.json'), JSON.stringify(lprs, null, "\t"), function (err) {
        if (err) { res.status(500).send('Server is error...') }
      })
      spinner.stop()
      page.close();

      promptPrint(lprs)
    }).catch(error => {
      console.error(error);
    })
  })
})()

function promptPrint(lprs) {
  prompt.start();

  var property = {
    name: 'yesno',
    message: '是否输出图表(y/n)?',
    validator: /y[es]*|n[o]?/,
    warning: '请输入 yes or no',
    default: 'no'
  };
  prompt.get(property, function (err, result) {
    if (['y', 'yes'].includes(result.yesno)) {
      renderLine(lprs)
    } else {
      process.exit(0)
    }
  });
}

function processCleanData(data) {
  // console.log(`🚀 ~ processCleanData ~ data:`, data)
  let lprArray = []
  data.forEach((text, index) => {
    try {
      let data = text.match(/\d{4}年[01]?\d月[0123]?\d日/g)[0]
      data = data.replace('年', '/').replace('月', '/').replace('日', '')
      const time = new Date(Date.parse(data.replace('年', '-').replace('月', '-').replace('日', '')))
      let valu5year = text.match(/5年期以上LPR为[\s]?(\d{1}.\d)/g)[0];
      let valu1year = text.match(/1年期LPR为[\s]?(\d{1}.\d)/g)[0];
      valu5year = valu5year.replace('5年期以上LPR为', '').trim()
      valu1year = valu1year.replace('1年期LPR为', '').trim()
      lprArray.push({ data, valu1year, valu5year, time })
    } catch (e) {
      console.error('不满足条件')
    }
  })
  return lprArray
}

function loadDetailPageInfo(item, context) {
  return function () {
    return new Promise(async (resolve, reject) => {
      const page1 = await context.newPage();
      await page1.goto(item.href)
      const text = await page1.textContent('#zoom > p')
      console.log(`🚀 ~ returnnewPromise ~ text:`, text)
      page1.close()
      resolve(text)
    })
  }
}

function loadPageInfo(url, index, page) {
  return function () {
    return new Promise(async (resolve, reject) => {
      if (index > 0) {
        spinner.text = chalk.green(`打开第${index + 1}页`);
        await page.goto(url)
        spinner.succeed()
      }
      let result = await page.evaluate(() => {
        let arr = []; //这个箭头函数内部写处理的逻辑  
        const hrefArray = document.querySelectorAll('.newslist_style>a');
        hrefArray.forEach(function (item) {
          console.log(item);
          if (item.text.endsWith('公告')) {
            arr.push({
              href: item.href,
              title: item.text
            })
          }
        })
        return arr
      });
      resolve(result)
    })
  }
}

function resolve(dir) {
  return path.join(__dirname, dir);
}

function mergePromise(ajaxArray) {
  let arr = [];
  async function run() {
    for (let p of ajaxArray) {
      let val = await p();
      arr.push(val);
    }
    return arr;
  }
  return run();
}



function renderPageUrl() {
  return `http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/de24575c/index${pageIndex}.html`;
}



