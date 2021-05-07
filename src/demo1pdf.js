const {chromium} = require('playwright');
 
(async () => {
    const browser = await chromium.launch(
        {    headless: true,
            slowMo:1000 // 延时
        }
    );
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.baidu.com');
    // 
    await page.emulateMedia({media: 'screen'});
    await page.pdf({ path: `screenshot/example-chromium.pdf` });
    await browser.close();
})();