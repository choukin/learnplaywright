// const playwright, { chromium, webkit, firefox } = require('playwright');

const { chromium, webkit, firefox } = require('playwright');

const blessed = require('blessed')
const contrib = require('blessed-contrib');
// const browsetType = chromium
(async () => {
  const browser = await chromium.launch({
    // executablePath: playwright.executablePath(),
    headless: false,
    slowMo: 1000 // 延时
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();
  // Log and continue all network requests
  //   page.route('**', route => {
  //     console.log(route.request().url());
  //     route.continue();
  //   });
  await page.goto('http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/index.html')

  // const handle = await page.$('css=.newslist_style>a');
  await page.waitForLoadState();

  const result = await page.evaluate(() => {   //这个result数组包含所有的图片src地址
    let arr = []; //这个箭头函数内部写处理的逻辑  
    const hrefs = document.querySelectorAll('.newslist_style>a');
    hrefs.forEach(function (item) {

      console.log(item);
      arr.push({
        href: item.href,
        title: item.text
      })
    })
    return arr
  });

  let mhrefs = result.slice(0, result.length - 2)
  console.log(mhrefs.length);
  const lprs = []
  // TODO:解决顺序执行的问题
  // https://segmentfault.com/q/1010000007771823
  mhrefs.forEach(async (item, index) => {
    console.log(index);
    const page1 = await context.newPage();
    await page1.goto(item.href)
    // await page1.waitForLoadState();
    const p = await page1.$('#zoom > p')
    try {
      // const text = await p.textContent()
      const text = await page1.textContent('#zoom > p')
      // console.log(text);
      let data = text.match(/\d{4}年[01]?\d月[0123]?\d日/g)[0]
      data = data.replace('年', '/').replace('月', '/').replace('日', '')
      const time = new Date(Date.parse(data.replace('年', '-').replace('月', '-').replace('日', '')))
      let valu5year = text.match(/5年期以上LPR为[\s]?(\d{1}.\d{2})/g)[0];
      let valu1year = text.match(/1年期LPR为[\s]?(\d{1}.\d{2})/g)[0];
      valu5year = valu5year.replace('5年期以上LPR为', '').trim()
      valu1year = valu1year.replace('1年期LPR为', '').trim()
      lprs.push({ data, valu1year, valu5year, time })

      page1.close()
    } catch (e) {
      console.log(index);
      console.log(item);
      console.error(e);
    }
    if (lprs.length == mhrefs.length) {
      console.log(lprs.sort((pre, curr) => {
        return pre.time - curr.time
      }));
      console.log('lprs.length',lprs.length)
      // printLine(lprs)
    }

  })




})()

async function loadDetailPageInfo(item) {
  const page1 = await context.newPage();
  await page1.goto(item.href)
  const text = await page1.textContent('#zoom > p')
  return text
}

 function mergePromise(ajaxArray) {
  let arr = [];
  async function run() {
      for(let p of ajaxArray) {
          let val = await p();
          arr.push(val);
      }
      return arr;
  }
  return run();
}

function printLine(lprs) {
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
    , line = contrib.line(
      {
        style:
        {
          line: "yellow"
          , text: "green"
          , baseline: "black"
        }
        , xLabelPadding: 3
        , xPadding: 5
        , showLegend: true
        , wholeNumbersOnly: false //true=do not show fraction in y axis
        , label: 'LPR'
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
  line.setData(data)

  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

  screen.render()
}

