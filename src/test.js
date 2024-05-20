
const a = '中国人民银行授权全国银行间同业拆借中心公布，2023年9月20日贷款市场报价利率（LPR）为：1年期LPR为3.45%，5年期以上LPR为4.2%。以上LPR在下一次发布LPR之前有效。'


function test(text) {
  try {
    let data = text.match(/\d{4}年[01]?\d月[0123]?\d日/g)[0]
    data = data.replace('年', '/').replace('月', '/').replace('日', '')
    const time = new Date(Date.parse(data.replace('年', '-').replace('月', '-').replace('日', '')))
    let valu5year = text.match(/5年期以上LPR为[\s]?(\d{1}.\d)/g)[0];
    let valu1year = text.match(/1年期LPR为[\s]?(\d{1}.\d)/g)[0];
    valu5year = valu5year.replace('5年期以上LPR为', '').trim()
    valu1year = valu1year.replace('1年期LPR为', '').trim()
    console.log(`🚀 ~ test ~ valu1year:`, valu1year)
    console.log(`🚀 ~ test ~ valu5year:`, valu5year)
  } catch (e) {
    console.error(e)
  }
}

test(a)