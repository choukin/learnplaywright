const { chromium, webkit, firefox } = require('playwright');

// const browsetType = chromium
(async () => {
  const browser = await webkit.launch({
    headless: false,
    slowMo:1000 // 延时
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();
  // Log and continue all network requests
  page.route('**', route => {
    console.log(route.request().url());
    route.continue();
  });
  await page.goto('http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/index.html')
  
  const handle = await page.$('css=.newslist_style');
//   const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));    // 声明变量
// await link.click();                             // 点击跳转
// const newPage = await newPagePromise; 
  for (let index = 0; index < handle.length; index++) {
      hdandle[index].click()
  }
  // const [newPage] = await Promise.all([
    // context.waitForEvent('page'),
    page.click('.icon-wrapper > .icon-list > .icon > aa[target="_blank"]') // Opens a new tab
  // ])
  await newPage.waitForLoadState();
  console.log(await newPage.title());
  console.log(await (await newPage.waitForSelector('#zoom > p')).textContent())
})()