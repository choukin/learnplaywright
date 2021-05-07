// const playwright, { chromium, webkit, firefox } = require('playwright');

const { chromium, webkit, firefox } = require('playwright');
const ora = require('ora')
const chalk = require('chalk')
const _ = require('lodash')
const blessed = require('blessed')
const contrib = require('blessed-contrib');
const spinner = ora(chalk.green('🚚 数据爬取中...'))
spinner.color = 'green'
spinner.start();
let pageIndex = '1';
const pageUrl = renderPageUrl();
(async () => {
  const browser = await chromium.launch({
    // executablePath: playwright.executablePath(),
    devtools: true,
    headless: false,
    slowMo: 1000 // 延时
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();
  await page.goto(pageUrl)
  spinner.text = chalk.green('开页面中...');
  // const handle = await page.$('css=.newslist_style>a');
  await page.waitForLoadState();
  spinner.succeed()

  spinner.text = chalk.green('获取总页数...');
  const pageCount = await page.$$eval('a.pagingNormal', el => {
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
  mergePromise(handleHrefFn).then(res => {
    console.log('===========');
    console.log(res);
    result = _.flattenDeep(res);
    const fns = []
    result.forEach((item) => {
      fns.push(loadDetailPageInfo(item, context))
    })
    mergePromise(fns).then(res => {
      console.log('-----------');
      console.log(res);
      const lprs = processCleanData(res)
      lprs.sort((pre, curr) => {
        return pre.time - curr.time
      });
      spinner.stop()
      printLine(lprs)
    }).catch(error => {
      console.error(error);
    })
  })



  // let mhrefs = result.slice(0, result.length - 2)
  // console.log(mhrefs.length);

  // TODO:解决顺序执行的问题
  // https://segmentfault.com/q/1010000007771823





})()

function processCleanData(data) {
  let lprArray = []
  data.forEach(text => {
    let data = text.match(/\d{4}年[01]?\d月[0123]?\d日/g)[0]
    data = data.replace('年', '/').replace('月', '/').replace('日', '')
    const time = new Date(Date.parse(data.replace('年', '-').replace('月', '-').replace('日', '')))
    let valu5year = text.match(/5年期以上LPR为[\s]?(\d{1}.\d{2})/g)[0];
    let valu1year = text.match(/1年期LPR为[\s]?(\d{1}.\d{2})/g)[0];
    valu5year = valu5year.replace('5年期以上LPR为', '').trim()
    valu1year = valu1year.replace('1年期LPR为', '').trim()
    lprArray.push({ data, valu1year, valu5year, time })
  })
  return lprArray
}

function loadDetailPageInfo(item, context) {
  return function () {
    return new Promise(async (resolve, reject) => {
      const page1 = await context.newPage();
      await page1.goto(item.href)
      const text = await page1.textContent('#zoom > p')
      page1.close()
      resolve(text)
    })
  }
}

function loadPageInfo(url, index, page) {
  return function () {
    return new Promise(async (resolve, reject) => {
      console.log('----------');
      console.log(index);
      if (index > 0) {
        await page.goto(url)
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




function printLine(lprs) {
  console.log(lprs);
  let lineData = []
  let oneYearData = []
  let xData = []
  lprs.forEach(item => {
    lineData.push(parseFloat(item.valu5year))
    oneYearData.push(parseFloat(item.valu1year))
    xData.push(item.data)
  })
  console.log(lineData);

  var screen = blessed.screen()
  var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
    line = contrib.line(
      {
        style:
        {
          line: "yellow"
          , text: "green"
          , baseline: "black"
        }
        , xLabelPadding: 3
        , xPadding: 6
        , showLegend: true
        , wholeNumbersOnly: false //true=do not show fraction in y axis
        , label: 'LPR'
        , showLegend: true
        , legend: { width: 10 }
      })
    , data = [{
      title: '5years',
      x: xData,
      y: lineData,
      style:
      {
        line: "blue"
        , text: "green"
        , baseline: "black"
      }
    }, {
      title: '1year',
      x: xData,
      y: oneYearData,
      style:
      {
        line: "yellow"
        , text: "green"
        , baseline: "black"
      }
    }]

  screen.append(line) //must append before setting data

  screen.append(printTable())
  line.setData(data)

  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

  screen.render()
}



function printTable() {
  var table = contrib.table(
    {
      keys: true
      , fg: 'white'
      , selectedFg: 'white'
      , selectedBg: 'blue'
      , interactive: true
      , label: 'Active Processes'
      , width: '30%'
      , height: '30%'
      , border: { type: "line", fg: "cyan" }
      , columnSpacing: 10 //in chars
      , columnWidth: [16, 12, 12] /*in chars*/
    })

  //allow control the table with the keyboard
  table.focus()

  table.setData(
    {
      headers: ['col1', 'col2', 'col3']
      , data:
        [[1, 2, 3]
          , [4, 5, 6]]
    })

    return table
}

function renderPageUrl() {
  return `http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/de24575c/index${pageIndex}.html`;
}

