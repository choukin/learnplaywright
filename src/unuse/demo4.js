const { chromium, webkit, firefox } = require('playwright');

// const browsetType = chromium
(async () => {
  const browser = await chromium.launch({
    // headless: false,
    // slowMo:1000 // 延时
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
  
  const handle = await page.$('css=.newslist_style>a');

  const result = await page.evaluate(() => {   //这个result数组包含所有的图片src地址
    let arr = []; //这个箭头函数内部写处理的逻辑  
    const hrefs = document.querySelectorAll('.newslist_style>a');
    hrefs.forEach(function (item) {
      console.log(item);
        arr.push({
          href:item.href,
          title:item.text
        })
    })
    return arr 
  });

 let mhrefs = result.slice(0, result.length-2)
 console.log(mhrefs.length);
const tests = []
mhrefs.forEach(async(item)=>{
  const page1 = await context.newPage();
  await page1.goto(item.href)
  const p = await page1.$('#zoom > p')
  const text = await p.textContent()
  const data = text.match(/\d{4}年[01]?\d月[0123]?\d日/g)[0]
  const time = new Date(Date.parse(data.replace('年','-').replace('月','-').replace('日','')))
  let valu5year = text.match(/5年期以上LPR为[\s]?(\d{1}.\d{2})/g)[0];
  let valu1year = text.match(/1年期LPR为[\s]?(\d{1}.\d{2})/g)[0];
  valu5year = valu5year.replace('5年期以上LPR为','').trim()
  valu1year = valu1year.replace('1年期LPR为','').trim()
  tests.push({data,valu1year,valu5year,time})
 
  page1.close()
  if(tests.length == mhrefs.length) {
    console.log(tests.sort((pre,curr)=>{
      return pre.time - curr.time
    }));
  }
})

// console.log(tests);



})()

