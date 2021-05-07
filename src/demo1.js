const playwright = require('playwright');
 
(async () => {
  for (const browserType of ['chromium', 'webkit' , 'firefox']) { // 
    const browser = await playwright[browserType].launch(
        {    headless: true,
            slowMo:1000 // 延时
        }
    );
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.baidu.com');
    await page.screenshot({ path: `screenshot/example-${browserType}.png` });
    await browser.close();
  }
})();