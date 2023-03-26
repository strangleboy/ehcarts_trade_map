//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
// 定时加入一个随机数
function shuffle(arr, myChart) {
  setTimeout(function run() {
    let a = randomNum(-10, 10);
    let b = randomNum(-10, 10);
    arr.push([a, b]);
    setTimeout(run, 1000);
    option.series[0].data = [[a, b]];
    console.log(myChart.getModel().option, option);
    myChart.setOption(option);
  }, 1000);
}

var myChart = echarts.init(document.getElementById("main"));
var data = [[0, 0]];
shuffle(data, myChart);
// 指定图表的配置项和数据
var option = {
  xAxis: {
    type: "value",
    min: -10,
    max: 10,
    axisLine: {
      show: true,
      interval: function (index, value) {
        console.log(index, value);
      },
    },
  },
  yAxis: {
    type: "value",
    min: -10,
    max: 10,
    axisLine: {
      show: true,
      interval: function (index, value) {
        console.log(index, value);
      },
    },
  },
  toolbar: {},
  animation: false,
  series: [
    {
      type: "effectScatter",
      symbolSize: 10,
      data: [],
      itemStyle: {
        color: "red",
      },
    },
    {
      type: "line",
      data: data,
    },
  ],
  dataZoom: [
    {
      type: "inside",
      xAxisIndex: 0,
      start: 35,
      end: 65,
      filterMode: "none",
    },
    {
      type: "inside",
      yAxisIndex: 0,
      start: 35,
      end: 65,
      filterMode: "none",
    },
  ],
};
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

// 创建比例尺函数，根据ruller标识尺寸适当的调整偏移的值
const zoomRuller = (text) => {
  let m = parseFloat(text);
  let units = ["mm", "cm", "m", "km"]; // 支持的单位
  let factors = [0.001, 0.01, 1, 1000]; // 单位对应的转换因子

  for (let i = 0; i < units.length - 1; i++) {
    if (m >= factors[i] && m < factors[i + 1]) {
      // 当前的值是否在当前和之后的单位之间
      var value = m / factors[i]; // 使用前一个单位计算转换后的值
      return value.toFixed(0) + units[i]; // 返回转换结果并保留两位小数
    } else if (m < factors[i]) {
      return m / factors[i] + units[i];
    }
  }
  return (m / factors[units.length - 1]).toFixed(0) + units[units.length - 1];
};

// 在 div 中显示格子大小
var gridSizeDiv = document.getElementById("gridSize");
var interval = myChart.getModel("xAxis", 0).getComponent("xAxis", 0).axis
  .scale._interval;
console.log(interval);
gridSizeDiv.innerHTML = zoomRuller(interval);

myChart.on("dataZoom", function (e) {
  // 放大到最大范围的时候，将范围扩大10倍，同时缩小比例
  if (e.batch[0].start === 0 && e.batch[0].end === 100) {
    option.xAxis.min *= 10;
    option.xAxis.max *= 10;
    option.yAxis.min *= 10;
    option.yAxis.max *= 10;
    option.dataZoom[0].start = 45;
    option.dataZoom[0].end = 55;
    option.dataZoom[1].start = 45;
    option.dataZoom[1].end = 55;
  } else {
    option.dataZoom[0].start = e.batch[0].start;
    option.dataZoom[0].end = e.batch[0].end;
    option.dataZoom[1].start = e.batch[1].start;
    option.dataZoom[1].end = e.batch[1].end;
  }
  myChart.setOption(option);
  // 获取当前x,y轴实时的间隔大小
  var textX = myChart.getModel("xAxis", 0).getComponent("xAxis", 0).axis
    .scale._interval;
  var textY = myChart.getModel("yAxis", 0).getComponent("yAxis", 0).axis
    .scale._interval;
  // 显示比例尺数值，因为采用的是正方形和inside模式的缩放，所以只需要取一个轴的间隔即可作为比例尺使用
  gridSizeDiv.innerHTML = zoomRuller(textX);
});
