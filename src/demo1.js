const playwright = require('playwright');
 
(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch(
        {    headless: false,
            slowMo:1000 // 延时
        }
    );
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://47.95.249.67:8080/his/login.htm');
    await page.screenshot({ path: `screenshot/example-${browserType}.png` });
    await browser.close();
  }
})();