const { webkit, devices } = require('playwright');
const iPhone11 = devices['iPhone 11 Pro'];
 
(async () => {
  const browser = await webkit.launch(
    {    headless: false,
          slowMo:1000 // 延时
      }
  );
  const context = await browser.newContext({
    ...iPhone11,
    locale: 'zh-CN',
    geolocation: { longitude: 114.127613, latitude: 30.696397  },
    permissions: ['geolocation']
  });
  const page = await context.newPage();
  await page.goto('http://i.meituan.com/');
  await page.waitForLoadState();
  await page.screenshot({ path: 'screenshot/colosseum-iphone0.png' });
  await page.waitForLoadState();
  await page.waitForTimeout(800);

  await page.screenshot({ path: 'screenshot/colosseum-iphone1.png' });
  await page.click('text="美食"');

  await page.waitForLoadState();
  await page.screenshot({ path: 'screenshot/colosseum-iphone2.png' });

  await browser.close();
})();