const { chromium, devices, webkit, firefox } = require('playwright');
const prompt = require('prompt');
const fs = require('fs');
const path = require('path')
const pageUrl = 'https://vip.qschou.com'; // const storage = await context.storageState();
// process.env.STORAGE = JSON.stringify(storage);
const iPhone = devices['iPhone 11 Pro'];
const phoneNum = '15810505381'

function resolve(dir) {
  return path.join(__dirname, dir);
}

async function autoSignIn() {
  const rawdata = fs.readFileSync(resolve('storage.json'));
  const storageState = JSON.parse(rawdata);
  const browser = await chromium.launch({
    // executablePath: playwright.executablePath(),
    devtools: false,
    headless: false,
    slowMo: 1000 // 延时
  });
  const context = await browser.newContext({
    ...iPhone,
    permissions: ['geolocation'],
    geolocation: { latitude: 52.52, longitude: 13.39 },
    colorScheme: 'dark',
    locale: 'de-DE',
    recordVideo: { // 录屏
      dir: 'videos/',
      size: { width: 1024, height: 768 },
    },
    storageState,
  });

  const page = await context.newPage();


  // console.log(token);
  await page.goto(pageUrl)


  try {
    // Click p:has-text("获取验证码")
    await page.click('p:has-text("获取验证码")', { timeout: 2000 });

    // Fill [placeholder="填写手机号"]
    await page.fill('[placeholder="填写手机号"]', phoneNum);

    // Click text=获取验证码
    await page.click('text=获取验证码');

    // Click [placeholder="填写手机验证码"]
    await page.click('[placeholder="填写手机验证码"]');
    promptPrint(page)
  } catch (error) {
    checkIn(page)
  }
  // Fill [placeholder="填写手机验证码"]


}
function promptPrint(page) {
  prompt.start();

  var property = {
    name: 'smsCode',
    message: '请输入验证码?',
    warning: '请输入验证码',
    default: '9527'
  };
  prompt.get(property, async function (err, result) {
    await login(page, result.smsCode)
  });
}

async function login(page, smsCode) {
  await page.fill('[placeholder="填写手机验证码"]', smsCode);

  await page.click('text=登录');

  await page.click('text=鑫');

  await page.click('.ls-btn-next');
  await checkIn(page)

}

async function checkIn(page) {

  await page.click('.member_footer_item.red_point .member_footer_item_icon');

  await page.waitForLoadState(/*{ url: 'https://vip.qschou.com/member/checkin?pertain=vip&from=NewsButton#' }*/)
  let storage = await page.context().storageState();
  storage = JSON.stringify(storage, null, "\t")
  
  fs.writeFile(resolve('storage.json'), storage, function (err) {
    if (err) { res.status(500).send('Server is error...') }
  })
  const element = await page.$('.check_in')
  if (element) {
    await page.click('.check_in', 2)
    process.exit(0);
  } else {
    console.log('今日已签到');
    process.exit(0);
  }
}

autoSignIn()