Record





<javascript>

  // Go to http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/index.html
  await page.goto('http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/index.html');
  // Click body:has-text("<h1><strong>璇峰紑鍚疛avaScript骞跺埛鏂拌椤�.</strong></h1>")
  await page.click('body:has-text("<h1><strong>璇峰紑鍚疛avaScript骞跺埛鏂拌椤�.</strong></h1>")');
  // Go to http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/index.html
  await page.goto('http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/index.html');
  // Click text=2021年4月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.waitForNavigation(/*{ url: 'http://www.pbc.gov.cn/zhengcehuobisi/125207/125213/125440/3876551/4235022/index.html' }*/),
    page.click('text=2021年4月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page1.close();
  // Click text=2021年3月22日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page2] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2021年3月22日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page2.close();
  // Click text=2021年2月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page3] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2021年2月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page3.close();
  // Click text=2020年11月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page4] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2020年11月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page4.close();
  // Click text=2020年5月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page5] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2020年5月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page5.close();
  // Click text=2019年9月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page6] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2019年9月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page6.close();
  // Click text=2019年11月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page7] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2019年11月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Close page
  await page7.close();
  // Click text=2019年9月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告
  const [page8] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=2019年9月20日全国银行间同业拆借中心受权公布贷款市场报价利率（LPR）公告')
  ]);
  // Click text=中国人民银行授权全国银行间同业拆借中心公布，2019年9月20日贷款市场报价利率（LPR）为：1年期LPR为 4.20%，5年期以上LPR为 4.85%。以上L
  await page8.click('text=中国人民银行授权全国银行间同业拆借中心公布，2019年9月20日贷款市场报价利率（LPR）为：1年期LPR为 4.20%，5年期以上LPR为 4.85%。以上L');