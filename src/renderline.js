const _ = require('lodash')
const blessed = require('blessed')
const contrib = require('blessed-contrib');
// const datas = [
//     {
//       data: '2019/8/20',
//       valu1year: '4.25',
//       valu5year: '4.85',
//     },
//     {
//       data: '2019/9/20',
//       valu1year: '4.20',
//       valu5year: '4.85',
//     },
//     {
//       data: '2019/10/21',
//       valu1year: '4.20',
//       valu5year: '4.85',
//     },
//     {
//       data: '2019/11/20',
//       valu1year: '4.15',
//       valu5year: '4.80',
//     },
//     {
//       data: '2019/12/20',
//       valu1year: '4.15',
//       valu5year: '4.80',
//     },
//     {
//       data: '2020/1/20',
//       valu1year: '4.15',
//       valu5year: '4.80',
//     },
//     {
//       data: '2020/2/20',
//       valu1year: '4.05',
//       valu5year: '4.75',
//     },
//     {
//       data: '2020/3/20',
//       valu1year: '4.05',
//       valu5year: '4.75',
//     },
//     {
//       data: '2020/4/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/5/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/6/22',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/7/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/8/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/9/21',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/10/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/11/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2020/12/21',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2021/1/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2021/2/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2021/3/22',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     },
//     {
//       data: '2021/4/20',
//       valu1year: '3.85',
//       valu5year: '4.65',
//     }
//   ]

function renderLine(lprData) {

    let lineData = []
    let oneYearData = []
    let xData = []
    lprData.forEach(item => {
        lineData.push(parseFloat(item.valu5year))
        oneYearData.push(parseFloat(item.valu1year))
        const day = item.data.substr(0, item.data.lastIndexOf('/'))
        xData.push(day)
    })

    const screen = blessed.screen()
    const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

    const transactionsLine = grid.set(0, 0, 6, 12, contrib.line,
        {
            style:
            { line: "yellow"
            , text: "green"
            , baseline: "white"},
            showNthLabel: 0,
            minY: 3.7,
            maxY: 5
            , wholeNumbersOnly: false
            , label: 'PBOCLPR'
            //   , xLabelPadding: 3
            //   , xPadding: 6
            , showLegend: true // 显示线的说明
            // , legend: { width: 6 }
        })

        const data = [{
        title: '5years',
        x: xData,
        y: lineData,
        style:
        {
            line: "cyan"
            , text: "green"
            , baseline: "cyan"
        }
    }, {
        title: '1year',
        x: xData,
        y: oneYearData,
        style:
        {
            line: "yellow"
            , text: "green"
            , baseline: "white"
        }
    }]

    transactionsLine.setData(data)

    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });
    renderTable(grid, lprData)
    //   renderBar(grid)
    //   renderSpark(grid)
    screen.render()
}

function renderTable(grid, lprData) {

    const table = grid.set(6, 0, 6, 3, contrib.table,
        {
            keys: true
            , fg: 'green'
            , label: 'LPR Table'
            , columnSpacing: 1
            , columnWidth: [20, 10, 10]
        })
    table.focus()
    tableData = lprData.map(item => {
        return [item.data, item.valu1year, item.valu5year]
    })
    table.setData({ headers: ['month', '1year', '5year'], data: tableData })
}

function renderSpark(grid) {
    const sparkline = grid.set(6, 3, 6, 9, contrib.sparkline,
        {
            label: 'LPR'
            , tags: true
            , style: { fg: 'blue', titleFg: 'white' }
        })
    const spark1 = []
    let spark2 = []
    for (const item of lprData) {
        console.log(item);
        spark1.push(+item.valu1year * 100)
        spark2.push(+item.valu5year * 100)
    }

    sparkline.setData(['1year', '5year'], [spark1, spark2])

}
module.exports = renderLine