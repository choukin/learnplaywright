const { chromium, webkit, firefox } = require('playwright');

// const browsetType = chromium
(async () => {
  const browser = await webkit.launch({
    headless: false,
    // slowMo:1000 // 延时
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();
  // Log and continue all network requests
  page.route('**', route => {
    console.log(route.request().url());
    route.continue();
  });
  await page.goto('http://47.93.218.60:9080/auth_web/new_login')
  
  await page.screenshot({ path: `../screenshot/setp1.png` });
  await page.fill('#os_job_number','000034')
  await page.fill('#os_job_number_password','123456')
  await page.click('button#btnJobNumberLogin');
  await page.waitForSelector('#sys-less-item-0')
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `../screenshot/setp2.png` });
  await page.click('#sys-less-item-0');
  await page.click('text=门诊医生')
})();