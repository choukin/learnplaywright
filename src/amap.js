const { chromium, devices, webkit, firefox } = require('playwright');
const prompt = require('prompt');
const fs = require('fs');
const path = require('path')
const pageUrl = 'https://www.amap.com'; // const storage = await context.storageState();
// process.env.STORAGE = JSON.stringify(storage);
const iPhone = devices['iPhone 11 Pro'];
const phoneNum = '18511894310'

function resolve(dir) {
  return path.join(__dirname, dir);
}

async function autoSignIn() {
  const rawdata = fs.readFileSync(resolve('storage.json'));
  const storageState = JSON.parse(rawdata);
  const browser = await chromium.launch({
    // executablePath: playwright.executablePath(),
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    devtools: false,
    headless: false,
    slowMo: 1000 // 延时
  });
  const context = await browser.newContext({
    args: [
      '--disable-blink-features=AutomationControlled', //个参数用于禁用 Chrome 的某些 Blink 引擎特性，具体来说是禁用了让网站能够检测到浏览器正在被自动化控制的特性。这有助于避免被一些网站检测到使用自动化工具
      '--disable-dev-shm-usage', // 告诉 Chrome 不要使用 /dev/shm，这对于在资源受限的环境（如某些 Docker 容器配置）中运行浏览器特别有用。
      '-–no-sandbox', // 这个参数用于禁用 Chrome 的沙盒模式。沙盒模式是一种安全机制，用于隔离运行在浏览器中的程序，防止它们造成系统级的破坏。在某些环境（如 Docker 容器）中，可能需要禁用沙盒模式以避免权限问题。
      '--disable-setuid-sandbox',
      '--start-maximized', // 网页加载时就最大化的窗口
    ], // 添加启动参数
    permissions: ['geolocation'],
    geolocation: {
      longitude: 113.938891,
      latitude: 22.536589,
      accuracy: 114.085753,
    },
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
    await page.click('div.circle-select', { timeout: 2000 });

    // Fill [placeholder="填写手机号"]
    await page.fill('[placeholder="请输入手机号"]', phoneNum);

    // Click text=获取验证码
    await page.click('text=获取验证码');

    // Click [placeholder="填写手机验证码"]
    // await page.click('[placeholder="填写手机验证码"]'); 
    await page.getByRole('textbox').click();

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
  await page.getByRole('textbox').fill(smsCode);
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

// autoSignIn()

async function closeBrowser(browser, page, context) {
  if (browser) {
    await browser.close();
  }
  if (page) {
    await page.close();
  }
  if (context) {
    await context.close();
  }
}
const cookiesFile = 'amap-cookie.json';
async function clollectBusinessDistrict(pageUrl, keyword, city) {
  console.log(`🚀 ~ 开始爬取列表数据页面链接 ~ clollectNotes:`, pageUrl);
  return new Promise(async (resolve, reject) => {
    const browser = await chromium.launch({
      storageState: cookiesFile,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      devtools: false,
      headless: false,
      slowMo: 1000, // 延时
      args: [
        '--disable-blink-features=AutomationControlled', //个参数用于禁用 Chrome 的某些 Blink 引擎特性，具体来说是禁用了让网站能够检测到浏览器正在被自动化控制的特性。这有助于避免被一些网站检测到使用自动化工具
        '--disable-dev-shm-usage', // 告诉 Chrome 不要使用 /dev/shm，这对于在资源受限的环境（如某些 Docker 容器配置）中运行浏览器特别有用。
        '-–no-sandbox', // 这个参数用于禁用 Chrome 的沙盒模式。沙盒模式是一种安全机制，用于隔离运行在浏览器中的程序，防止它们造成系统级的破坏。在某些环境（如 Docker 容器）中，可能需要禁用沙盒模式以避免权限问题。
        '--disable-setuid-sandbox',
        // '--start-maximized', // 网页加载时就最大化的窗口
      ], // 添加启动参数
    });
    const context = await browser.newContext({
      // storageState: cookiesFile,
      // viewport: config.browserConfig.viewport,
      geolocation: {
        longitude: 113.938891,
        latitude: 22.536589,
        accuracy: 114.085753,
      },
      permissions: ['geolocation'],
    });
    // 获取登录标识 cookie
    const cookie = {
      name: 'passport_login',
      value: 'MTk1MDc4MzA0LGFtYXBDU09kdWN2M0gsbWp1bXhpYzNjNDMzZWIyZzRqNHYyZmphbHhpYml5Z3csMTcyODI3NTA2MSxPREprWlRRNE5ETTJZek13TlRjeVl6aGtOVEUyWlRGall6TmpObU0xWWpVPQ%3D%3D',
      domain: '.amap.com',
      path: '/',
      expires: 1736051061.685061,
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    };
    // console.log(`🚀 ~ returnnewPromise ~ cookie:`, cookie);
    // 设置 登录标识 cookie
    await context.addCookies([cookie]);

    // @ts-ignore
    const page = await context.newPage();
    await page.waitForTimeout(2000);
    let address = [];
    // 监听请求
    // page.on('response', (response) => {
    //   handleRequest(response);
    // });
    // 设置页面视口大小
    await page.setViewportSize({ width: 1080, height: 1080 });
    // 等待页面加载状态为 'load'，表示页面已完全加载
    await page.goto(pageUrl, { waitUntil: 'load' });

    await page.waitForTimeout(2000);
    try {
      // 输入城市信息
      await page.locator('#citybox').click();
      await page.getByPlaceholder('请输入城市').click();
      await page.getByPlaceholder('请输入城市').fill(city);
      await page.getByPlaceholder('请输入城市').press('Enter');
      // 输入关键字信息
      await page.getByPlaceholder('搜索位置、公交站、地铁站').click();
      await page
        .getByPlaceholder('搜索位置、公交站、地铁站')
        .fill(`${keyword}`);
      await page.locator('#searchbtn i').click();
    } catch (e) {
      // 获取网页屏幕截图
      const imageUrl = sendPageScreenshot();
      // 发送监控信息
      await sendMessage({
        title: `程序错误`,
        text: `<span style="color:blue">高德爬虫错误</span>  \n 页面链接:[${pageUrl}](${pageUrl}) \n ![图片](${imageUrl})`,
      });
    }

    const box = await page.$('.baxia-dialog-content');
    // // 获取元素的边界框
    const boxbounding = await box.boundingBox();
    console.log(`🚀 ~ returnnewPromise ~ boxbounding:`, boxbounding)
    // 假设页面上有一个 iframe，其 ID 为 "my-iframe"
    const iframe = await page.frameLocator('#baxia-dialog-content');
    // 在 iframe 中选择元素
    const elementInIframe = await iframe.locator('.warnning-text');
    // 现在你可以对 elementInIframe 进行操作，比如获取文本内容
    const text = await elementInIframe.textContent();
    console.log(text);

    // 假设你要拖动的元素有一个 ID 为 "draggable-element"
    const elementSlide = await iframe.locator('.nc_iconfont.btn_slide');
    console.log(`🚀 ~ returnnewPromise ~ elementSlide:`, elementSlide)
    await elementSlide.click()
    // 获取元素的边界框
    const elementBox = await elementSlide.boundingBox();

    // 计算拖动的起始点和结束点
    const startX = elementBox.x + elementBox.width / 2;
    const startY = elementBox.y + elementBox.height / 2;
    const endX = startX + 300 - 21; // 拖动到右侧100像素的位置
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.waitForTimeout(300);


    // let currentX = startX;


    // while (currentX < endX) {
    //   // 随机产生下一步的位置和停顿时间
    //   const moveDistance = (Math.random() * 2 > 1) ? -1.5 : (Math.random() * 10 + 75); // 每次移动5-15px
    //   console.log(`🚀 ~ returnnewPromise ~ moveDistance:`, moveDistance)


    //   const jitter = Math.random() * 3 - 1.5; // 随机上下抖动±1.5px
    //   console.log(`🚀 ~ returnnewPromise ~ jitter:`, jitter)
    //   const pauseTime = Math.random() * 30 + 20; // 随机暂停20-50ms

    //   currentX += moveDistance;
    //   await page.mouse.move(currentX, startY + jitter);
    //   console.log(`🚀 ~ returnnewPromise ~ currentX:`, currentX)

    //   await page.waitForTimeout(pauseTime);
    // }



    // 定义每个步骤的时间和总时间
    const totalSteps = 20;
    const stepTime = 5;

    for (let i = 0; i <= totalSteps; i++) {
      // 当前步骤占总时间的比例
      const t = i / totalSteps;
      // 使用easeOutBounce函数计算当前位置占总距离的比例
      const easeT = easeOutBounce(t, 0, 1, 1);
      console.log(`🚀 ~ returnnewPromise ~ easeT:`, easeT)

      const newX = startX + (256) * easeT;
      console.log(i + ` i 🚀 ~ returnnewPromise ~ newX:`, newX)
      const jitter = Math.random() * 3 - 1.5; // 随机上下抖动±1.5px
      const newY = startY + jitter;

      await page.mouse.move(newX, newY, { steps: 1 });
      await page.waitForTimeout(stepTime);
    }

    // 松手前最好还是等待一下，这也很符合真实操作
    await page.waitForTimeout(800);
    await page.mouse.up();
    context.storageState({ path: cookiesFile });
    // await page.locator('#searchbtn i').click();



    async function sendPageScreenshot() {
      // if (page && !page.isClosed()) {
      const filename = new Date().getTime() + '.png';
      // console.log(`🚀 ~ sendPageScreenshot ~ filename:`, filename);
      const imagePath = filePath + '/' + filename;
      // console.log(`🚀 ~ sendPageScreenshot ~ imagePath:`, imagePath);
      await page.screenshot({ path: filePath + '/' + filename });
      const fileRes = await uploadPoster(imagePath, filename);
      const imageUrl = 'https://' + fileRes?.Location;
      deleteLocalImage(imagePath);
      return imageUrl;
    }

    async function handleRequest(response) {
      // console.log(`🚀 ~ handleRequest ~ handleRequest:`);
      const request = response.request();
      const resourceType = request.resourceType();
      const url = request.url();

      if (['xhr', 'fetch'].includes(resourceType) && url.includes(poiInfo)) {
        // const bodyText = await response.text();
        // console.log(`🚀 ~ handleRequest ~ bodyText:`, bodyText);
        try {
          const body = await response.json();
          if (!body || !body.data) {
            await closeBrowser(browser, page, context);
            resolve(address);
            return false;
          }
          console.log(`🚀 ~ handleRequest ~ body:`, body.data);
          const { status, total, poi_list, url } = body.data;
          if (!!url) {
            // const timep = new Date().getTime() + '.png';
            // const imagePath = process.env.SCREENSHOTDIR + '/' + timep;
            // console.log(`🚀 ~ handleRequest ~ imagePath:`, imagePath);
            // await page.screenshot({ path: imagePath });
            // const imageUrl = await uploadAndDeleteLocal(imagePath, timep);
            const imageUrl = await sendPageScreenshot();
            console.log(`🚀 ~ handleRequest ~ url:`, url);
            // 发送监控信息

            reject(new Error('被拦截了'));
            return false;
          }
          console.log(111, poi_list);
          // 登录状态失效
          if (status === '9999') {

            await closeBrowser(browser, page, context);
            return;
          }
          console.log(333, poi_list);
          if (!body.data.poi_list) {
            console.log('没有搜到数据 page.isClosed()', page.isClosed());
            if (!page.isClosed()) {
              try {
                await page.waitForTimeout(2000);
              } catch (e) {
                console.error(e);
              }
            }
            await closeBrowser(browser, page, context);
            resolve(address);
            return false;
          }
          address = address.concat(poi_list);
          // console.log(
          //   `🚀 ~ handleRequest ~ body: poi_list length`,
          //   poi_list.length,
          // );
          // console.log(
          //   `🚀 ~ handleRequest ~ body: total `,
          //   +total + '  address.length:' + address.length,
          // );
          // console.log(
          //   `🚀 ~ handleRequest ~ address.length >= +total:`,
          //   address.length >= +total,
          // );
          if (poi_list.length < 20 || address.length >= +total) {
            await page.waitForTimeout(2000);
            resolve(address);
            return false;
          } else {
            // 检查页面中是否存在选择器匹配的元素
            const element = await page.$('.serp-paging');
            // console.log(`🚀 ~ handleRequest ~ element:`, element)
            if (element) {
              await page.waitForTimeout(2000);
              console.log(`🚀 ~ handleRequest ~ element:  下一页`);
              await page.locator('#serp .paging-next').click();
            } else {
              resolve(address);
              return false;
            }
          }
        } catch (error) {
          console.error(`🚀 ~ `, error);

          // const imageUrl = await sendPageScreenshot();
          // // 发送监控信息
          // await sendMessage({
          //   title: `程序错误`,
          //   text: `<span style="color:blue">高德爬虫错误</span>  \n 页面链接:[${pageUrl}](${pageUrl}) \n ![图片](${imageUrl})`,
          // });
          reject(error);
          return false;
        }
      }
    }
  });
}

// 你无需理解参数都是什么作用 
// 拖拽滑块，模拟真人操作轨迹
// 缓慢加速 -> 快速加速 -> 减速 -> 微调
function easeOutBounce(t, b, c, d) {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
}


(async () => {
  await clollectBusinessDistrict('https://www.amap.com/', '高德', '北京')
})();