const playwright = require('playwright');
 
(async () => {
  for (const browserType of ['chromium', 'webkit' , 'firefox']) { // 
    // 通过 launch() 创建一个浏览器实例 Browser 对象
    const browser = await playwright[browserType].launch(
        {    headless: false,
            slowMo:1000 // 延时
        }
    );
    // 通过 Browser 对象创建浏览器上下文 context 对象
    const context = await browser.newContext();
    // 通过 BrowserContext 对象创建页面 page  对象
    const page = await context.newPage();
    // 跳转到指定的页面
    await page.goto('https://www.qschou.com/sem/index.html');
    // 截屏
    await page.screenshot({ path: `screenshot/example-${browserType}.png` });
    //  Chromium headless only
    if(browserType === 'chromium') {
    // // 设置媒体类型 
    // await page.emulateMedia({media: 'screen'});
    // // 截屏
    // await page.pdf({ path: `screenshot/example-${browserType}.pdf` });
    }
    await browser.close();
    if(browserType === 'firefox') {
      process.exit(0)
    }
  }
})();