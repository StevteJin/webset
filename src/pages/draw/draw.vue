<template>
  <div class="dnfbox">
    <div class="leftbox">
      <div class="dnftitle">{{strategyName}}-{{strategyTypeText}}</div>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="myChart" :style="{width: '100%', height: '364px'}"></div>
    </div>
    <div class="rightbox" v-if="tableData.length>0">
      <el-table :data="tableData" style="width: 100%;background-color:rgb(67,67,67);" :height="350" :span="24" :row-style="{height:'40px'}" :header-row-style="{height:'32px'}" :default-sort="{prop: 'LineIndex', order: 'descending'}" :cell-style="cellStyle" :header-cell-style="headerCellStyle" :border="true" stripe>
        <!-- <el-table-column prop="LineIndex" label="网格线索引" sortable align="center"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="网格线索引" align="center">
          <template slot-scope="scope">
            <div style="color:rgb(0,122,204);" v-if="scope.row.TheoryPositionNum>0||scope.row.TruePositionNum>0">{{scope.row.LineIndex}}</div>
            <div v-if="scope.row.TheoryPositionNum<=0">{{scope.row.LineIndex}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="LinePrice" label="网格线价格" sortable align="center"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="网格线价格" align="center">
          <template slot-scope="scope">
            <div style="color:rgb(0,122,204);" v-if="scope.row.TheoryPositionNum>0||scope.row.TruePositionNum>0">{{scope.row.LinePrice}}</div>
            <div v-if="scope.row.TheoryPositionNum<=0">{{scope.row.LinePrice}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="TheoryPositionNum" label="理论持仓数量" sortable align="center"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="理论持仓数量" align="center">
          <template slot-scope="scope">
            <div style="color:rgb(0,122,204);" v-if="scope.row.TheoryPositionNum>0||scope.row.TruePositionNum>0">{{scope.row.TheoryPositionNum}}</div>
            <div v-if="scope.row.TheoryPositionNum<=0&&scope.row.TruePositionNum<=0">{{scope.row.TheoryPositionNum}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="TruePositionNum" label="实际持仓数量" sortable align="center"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="实际持仓数量" align="center">
          <template slot-scope="scope">
            <div style="color:rgb(0,122,204);" v-if="scope.row.TheoryPositionNum>0||scope.row.TruePositionNum>0">{{scope.row.TruePositionNum}}</div>
            <div v-if="scope.row.TheoryPositionNum<=0&&scope.row.TruePositionNum<=0">{{scope.row.TruePositionNum}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSzie" :pager-count="5" :total="total" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
    <div class="rightbox" v-if="tableData.length<=0">
      <el-table :data="tableData" style="width: 100%;background-color:rgb(67,67,67);" :height="368" :span="24" :row-style="{height:'36px'}" :header-row-style="{height:'32px'}" :default-sort="{prop: 'LineIndex', order: 'descending'}" :cell-style="cellStyle" :header-cell-style="headerCellStyle" :border="true" stripe>
        <el-table-column label="网格线索引" sortable align="center"></el-table-column>
        <el-table-column label="网格线价格" sortable align="center"></el-table-column>
        <el-table-column label="理论持仓数量" sortable align="center"></el-table-column>
        <el-table-column label="实际持仓数量" sortable align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSzie" :pager-count="5" :total="total" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
  </div>
</template>

<script>
import Loading from "@/pages/loading/loading";
export default {
  components: { Loading },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      BrokerID: "",
      UserAccountID: "",
      StrategyID: "",
      tableData: [],
      pageSzie: 20,
      currentPage: 1,
      total: 0,
      gridLinePrices: 1,
      middlePrice: 1,
      strategyTypeText: "",
      scatter: [],
      screenWidth: document.body.clientWidth,
      strategyName: "",
      isLoading: true,
      //是否需要止盈止损
      isNeedStopWinOrStopLoss: "1",
      //止损价
      stopLossPrice: "",
      //止盈价
      stopWinPrice: ""
    };
  },
  created() {
    this.BrokerID = this.$route.query.BrokerID;
    this.UserAccountID = this.$route.query.UserAccountID;
    this.StrategyID = this.$route.query.StrategyID;
  },
  watch: {
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          // 打印screenWidth变化的值
          console.log(that.screenWidth);
          that.timer = false;
        }, 400);
      }
    },
    "$route.query": function(newVal, oldVal) {
      console.log("新的", newVal);
      location.reload();
    }
  },
  computed: {
    headerCellStyle() {
      return {
        padding: "1px 0",
        background: "#2E2E30",
        height: "34px",
        border: "0px",
        color: "#CCCCCC",
        "font-size": "12px"
      };
    },
    cellStyle() {
      return {
        padding: "0",
        "border-bottom": "1px solid rgb(67,67,67)",
        "border-right": "1px solid rgb(67,67,67)",
        color: "#CCCCCC",
        "font-size": "12px"
      };
    }
  },
  mounted() {
    this.getAccountList();
    this.getDrawList();
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
    //取图表数据
    getAccountList() {
      this.axios
        .post("/three/strategy/detail", {
          BrokerID: this.BrokerID,
          UserAccountID: this.UserAccountID,
          size: this.pageSzie,
          page: this.currentPage,
          StrategyID: this.StrategyID
        })
        .then(response => {
          if (response.data.code == 1) {
            this.tableData = response.data.data.data;
            this.total = response.data.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDrawList() {
      this.axios
        .post("/three/strategy/chart", {
          BrokerID: this.BrokerID,
          UserAccountID: this.UserAccountID,
          StrategyID: this.StrategyID
        })
        .then(response => {
          if (response.data.code == 1) {
            //Y轴
            this.gridLinePrices = response.data.data.config.gridLinePrices;
            //中间值
            this.middlePrice = response.data.data.config.middlePrice;
            console.log("我是中间值", this.middlePrice);
            //标题
            this.strategyTypeText = response.data.data.config.strategyTypeText;
            this.strategyName = response.data.data.config.strategyName;
            this.scatter = response.data.data.scatter;
            console.log("数组啊", this.scatter);
            let numBox = response.data.data.config.intervalPrice;
            //止盈止损
            this.isNeedStopWinOrStopLoss =
              response.data.data.config.isNeedStopWinOrStopLoss;
            this.stopLossPrice = response.data.data.config.stopLossPrice;
            this.stopWinPrice = response.data.data.config.stopWinPrice;
            //默认显示的值范围
            console.log(typeof this.scatter);
            let timeArray = [];
            let scatter = [];
            let a, b, d, c;
            if (this.scatter.length > 0) {
              this.scatter.forEach((item, index, array) => {
                //执行代码
                timeArray.push(item[1]);
                scatter.push([
                  item[1],
                  (item[2] - this.gridLinePrices[0]) / numBox,
                  item[2],
                  item[3],
                  item[4],
                  item[5]
                ]);
              });
              a = this.scatter[0][2];
              b = this.gridLinePrices[this.gridLinePrices.length - 1];
              d = this.gridLinePrices[0];
              console.log("ab", a, b, d);
              c = (this.middlePrice - d) / (b - d);
              console.log("我是", c);
              c = c * 100;
              console.log("时间", timeArray);
              console.log("数组", scatter);
            } else {
              scatter = [];
              c = "";
            }
            this.drawLine(
              this.gridLinePrices,
              this.middlePrice,
              this.strategyTypeText,
              timeArray,
              scatter,
              numBox,
              c,
              this.strategyName,
              this.isNeedStopWinOrStopLoss,
              this.stopLossPrice,
              this.stopWinPrice
            );
            this.isLoading = false;
          } else {
            this.tableData = [];
            for (var i = 0; i < 8; i++) {
              this.tableData.push({
                LineIndex: "",
                LinePrice: "",
                TheoryPositionNum: "",
                TruePositionNum: ""
              });
            }
            this.gridLinePrices = [0, 0, 0, 0, 0, 0];
            this.strategyTypeText = "无数据";
            this.strategyName = "无数据";

            this.drawLine(
              this.gridLinePrices,
              null,
              this.strategyTypeText,
              null,
              null,
              null,
              null,
              this.strategyName,
              null,
              null,
              null
            );
            this.isLoading = false;
            console.log("我是isLoading", this.isLoading);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountList();
    },
    drawLine(
      gridLinePrices,
      middlePrice,
      strategyTypeText,
      time,
      scatter,
      numBox,
      c,
      strategyName,
      isNeedStopWinOrStopLoss,
      stopLossPrice,
      stopWinPrice
    ) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let o, p;
      if (gridLinePrices.length > 11) {
        if (c) {
          o = c * 0.7;
          p = 100 ? c * 1.3 : 100;
          console.log("我是p", p);
        } else {
          o = 0;
          p = 100;
        }
      } else {
        o = 0;
        p = 100;
      }

      window.addEventListener("resize", () => {
        myChart.resize();
      });
      //坐标颜色
      var upColor = "#ec0000";
      var upBorderColor = "#8A0000";
      var downColor = "#00da3c";
      var downBorderColor = "#008F28";
      //stopWinPrice为止盈价，stopLossPrice为止损价
      let stopLossPrice1, stopWinPrice1;
      //当止损价小于<Y轴最小值时
      if (stopLossPrice < gridLinePrices[0]) {
        stopLossPrice1 = gridLinePrices[0];
      } else if (stopLossPrice > gridLinePrices[gridLinePrices.length - 1]) {
        //当止损价>Y轴最大值时
        stopLossPrice1 = gridLinePrices[gridLinePrices.length - 1];
      } else {
        stopLossPrice1 = stopLossPrice;
      }

      //当止盈价>Y轴最大值时
      if (stopWinPrice > gridLinePrices[gridLinePrices.length - 1]) {
        stopWinPrice1 = gridLinePrices[gridLinePrices.length - 1];
      } else if (stopWinPrice < gridLinePrices[0]) {
        //当止盈价<Y轴最小值时
        stopWinPrice1 = gridLinePrices[0];
      } else {
        stopWinPrice1 = stopWinPrice;
      }
      console.log(
        "止盈止损",
        stopLossPrice1,
        gridLinePrices[gridLinePrices.length - 1],
        stopWinPrice1
      );
      //判断是否有止损止盈的点scatter
      // console.log("止损止盈的点", scatter);
      let sca;
      if (scatter&&scatter.length > 0) {
        sca = scatter.map((item, index) => {
          console.log("他", item[2]);
          //点大于Y轴最大值
          if (
            Number(item[2]) > Number(gridLinePrices[gridLinePrices.length - 1])
          ) {
            console.log(11);
            item[2] = gridLinePrices[gridLinePrices.length - 1];
            item[1] = gridLinePrices.length - 1;
          } else if (Number(item[2]) < Number(gridLinePrices[0])) {
            console.log(22);
            //点小于Y轴最小值
            item[2] = gridLinePrices[0];
            console.log("它它", item[2]);
            item[1] = 0;
          }
          return item;
        });
        console.log("他他", scatter, sca);
      } else {
        sca = null;
      }

      let markLine, str;
      if (
        isNeedStopWinOrStopLoss == 1 &&
        Number(stopWinPrice) != 0 &&
        Number(stopLossPrice) != 0
      ) {
        markLine = {
          symbol: "none",
          data: [
            {
              name: "止盈线",
              //   yAxis: stopWinPrice
              yAxis: stopWinPrice1,
              lineStyle: {
                normal: {
                  type: "dashed",
                  color: "#FF5C5C"
                }
              },
              label: {
                show: true,
                position: "middle",
                color: "#FF5C5C",
                formatter: function(params) {
                  str = "止盈线:" + stopWinPrice;

                  return str;
                }
              },
              tooltip: {
                /*返回需要的信息*/
                formatter: function(param) {
                  var value = param.value;
                  return (
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3);width:160px;hieght:300px; font-size: 12px;"> ' +
                    "止盈线：" +
                    stopWinPrice +
                    "</div>"
                  );
                }
              }
            },
            {
              name: "止损线",
              yAxis: stopLossPrice1,
              lineStyle: {
                normal: {
                  type: "dashed",
                  color: "#39E365"
                }
              },
              label: {
                show: true,
                position: "middle",
                color: "#39E365",
                formatter: function(params) {
                  str = "止损线:" + stopLossPrice;

                  return str;
                }
              },
              tooltip: {
                /*返回需要的信息*/
                formatter: function(param) {
                  var value = param.value;
                  return (
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3);width:160px;hieght:300px; font-size: 12px;"> ' +
                    "止损线：" +
                    stopLossPrice +
                    "</div>"
                  );
                }
              }
            }
          ],
          label: {
            normal: {
              show: true,
              position: "middle"
            }
          }
        };
      } else if (isNeedStopWinOrStopLoss == 1 && Number(stopWinPrice) != 0) {
        markLine = {
          symbol: "none",
          data: [
            {
              name: "止盈线",
              //   yAxis: stopWinPrice
              yAxis: stopWinPrice1,
              lineStyle: {
                normal: {
                  type: "dashed",
                  color: "#FF5C5C"
                }
              },
              label: {
                show: true,
                position: "middle",
                color: "#FF5C5C",
                formatter: function(params) {
                  str = "止盈线:" + stopWinPrice;

                  return str;
                }
              },
              tooltip: {
                /*返回需要的信息*/
                formatter: function(param) {
                  var value = param.value;
                  return (
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3);width:160px;hieght:300px; font-size: 12px;"> ' +
                    "止盈线：" +
                    stopWinPrice +
                    "</div>"
                  );
                }
              }
            }
          ],
          label: {
            normal: {
              show: true,
              position: "middle"
            }
          }
        };
      } else if (isNeedStopWinOrStopLoss == 1 && Number(stopLossPrice) != 0) {
        markLine = {
          symbol: "none",
          data: [
            {
              name: "止损线",
              yAxis: stopLossPrice1,
              lineStyle: {
                normal: {
                  type: "dashed",
                  color: "#39E365"
                }
              },
              label: {
                show: true,
                position: "middle",
                color: "#39E365",
                formatter: function(params) {
                  str = "止损线:" + stopLossPrice;

                  return str;
                }
              },
              tooltip: {
                /*返回需要的信息*/
                formatter: function(param) {
                  var value = param.value;
                  return (
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3);width:160px;hieght:300px; font-size: 12px;"> ' +
                    "止损线：" +
                    stopLossPrice +
                    "</div>"
                  );
                }
              }
            }
          ],
          label: {
            normal: {
              show: true,
              position: "middle"
            }
          }
        };
      } else {
        markLine = false;
      }
      // 绘制图表
      myChart.setOption({
        //表格名称
        title: {
          left: "center",
          top: 10,
          fontSize: "12px"
        },
        backgroundColor: "rgb(46,46,48)",
        grid: {
          show: true,
          borderColor: "transparent",
          backgroundColor: "#262628",
          x: 90,
          y: 20,
          x2: 50,
          y2: 60
        },
        //公用的X轴
        xAxis: {
          type: "category",
          boundaryGap: 0, //xAxis中的boundaryGap属性，设置为false代表是零刻度开始，设置为true代表离零刻度间隔一段距离
          splitLine: {
            show: false
          },
          //线的样式
          axisLine: { lineStyle: { color: "#B3B5B7" } }
        },
        //Y轴,这里有左右两个Y轴
        yAxis: [
          {
            type: "category",
            scale: true,
            boundaryGap: false,
            //线的样式
            axisLine: {
              lineStyle: {
                color: function(value, index) {
                  if (value == middlePrice) {
                    return "white";
                  } else {
                    return value > middlePrice ? "#FF5C5C" : "#39E365";
                  }
                }
              }
            },
            //横向网格线
            splitLine: {
              show: true,
              lineStyle: { color: "#434347" }
            },
            lineStyle: {
              color: ["#2F2F31"],
              width: 1,
              type: "solid"
            },
            data: gridLinePrices
          }
        ],
        dataZoom: [
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            right: "12px",
            start: o, //数据窗口范围的起始百分比
            end: p,
            showDetail: false,
            width: "20px",
            backgroundColor: "#3B3B3D",
            fillerColor: "#4F5050",
            borderColor: "transparent"
          },
          {
            type: "slider",
            show: true,
            bottom: "10px",
            xAxisIndex: [0],
            start: 0, //数据窗口范围的起始百分比
            end: 100,
            color: "#fff",
            height: "20px",
            showDetail: false,
            backgroundColor: "#3B3B3D",
            fillerColor: "#4F5050",
            borderColor: "transparent"
          },
          {
            type: "inside",
            yAxisIndex: [0],
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true,
            start: 0,
            end: 100
          }
        ],
        tooltip: {
          /*返回需要的信息*/
          formatter: function(param) {
            var value = param.value;
            return (
              '<div style="border-bottom: 1px solid rgba(255,255,255,.3);width:160px;hieght:300px; font-size: 12px;"> ' +
              // value[2] +
              "成交时间" +
              "(" +
              value[0] +
              ")" +
              "</br>" +
              value[4][0] +
              "</br>" +
              value[4][1] +
              "</div>"
            );
          }
        },
        series: [
          {
            //scatter为散点图
            type: "scatter",
            // data: scatter,
            data: sca,
            z: 10000,
            itemStyle: {
              normal: {
                // shadowBlur: 10,
                // shadowColor: "rgba(120, 36, 50, 0.5)",
                // shadowOffsetY: 5,
                color: function(e) {
                  if (e.value[5] == "open") {
                    return "#FF5C5C";
                  } else {
                    return "#39E365";
                  }
                }
              }
            },
            markLine: markLine
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dnfbox {
  width: 100%;
  height: 100vh;
  background-color: rgb(17, 17, 19);
  overflow: hidden;
}
.dnfbox .leftbox {
  float: left;
  width: 59.8%;
  margin-right: 2px;
}
.dnftitle {
  width: 100%;
  height: 34px;
  background-color: #2e2e30;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 34px;
  margin-bottom: 4px;
}
.dnfbox .rightbox {
  float: right;
  width: 40%;
  background-color: rgb(23, 23, 33);
}
.dnfbox .pagination {
  border-top: 2px solid rgb(17, 17, 19);
  height: 50px;
  background-color: #2e2e30;
  position: relative;
}
</style>
<style>
.dnfbox .el-table tr {
  height: 24px;
  background-color: rgb(31, 31, 31);
}
.dnfbox .el-table tr:hover {
  background: none;
}
.dnfbox .el-table--border {
  border: none;
}
.dnfbox .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #2e2e30;
}
.dnfbox .el-table--border::after {
  background-color: rgb(67, 67, 67);
}
.dnfbox .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
.dnfbox .el-table th.is-leaf {
  border: 1px solid rgb(67, 67, 67);
  border-left: none;
}

.dnfbox .el-pagination button:disabled {
  background-color: rgb(46, 46, 48);
}
.dnfbox .el-pager li {
  background-color: rgb(46, 46, 48);
  color: #c0c4cc;
}
.el-pager li.active {
  color: #e46943 !important;
}
.dnfbox .el-pagination .btn-next {
  background-color: rgb(46, 46, 48);
  color: #c0c4cc;
}
.dnfbox .el-pagination .btn-prev {
  background-color: rgb(46, 46, 48);
  color: #c0c4cc;
}
.dnfbox .el-table::before {
  background-color: rgb(17, 17, 19);
}
.dnfbox .el-pagination {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 8px);
  background-color: rgb(46, 46, 48);
}
</style>
