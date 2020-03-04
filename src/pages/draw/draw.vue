<template>
    <div class="dnfbox">
        <div class="leftbox">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
        </div>
        <div class="rightbox">
            <el-table :data="tableData" style="width: 100%;background-color:rgb(67,67,67);" :height="368" :span="24" :row-style="{height:'40px'}" :header-row-style="{height:'32px'}" :default-sort="{prop: 'LineIndex', order: 'ascending'}" :cell-style="cellStyle" :header-cell-style="headerCellStyle" :border="true" stripe>
                <el-table-column prop="LineIndex" label="网格线索引" sortable align="center"></el-table-column>
                <el-table-column prop="LinePrice" label="网格线价格" sortable align="center"></el-table-column>
                <el-table-column prop="TheoryPositionNum" label="理论持仓数量" sortable align="center"></el-table-column>
                <el-table-column prop="TruePositionNum" label="实际持仓数量" sortable align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSzie" :pager-count="5" :total="total" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      BrokerID: 9999,
      UserAccountID: 18072245601,
      StrategyID: 1583202800525,
      tableData: [],
      pageSzie: 20,
      currentPage: 1,
      total: 0,
      gridLinePrices: 1,
      middlePrice: 1,
      strategyTypeText: "",
      scatter: []
    };
  },
  created() {},
  watch: {},
  computed: {
    headerCellStyle() {
      return {
        padding: "3px 0",
        background: "rgb(54,54,54)",
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
  },
  methods: {
    //取图表数据
    getAccountList() {
      this.axios
        .post("/three/strategy/detail", {
          BrokerID: this.BrokerID,
          UserAccountID: this.UserAccountID,
          size: this.pageSzie,
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
            //标题
            this.strategyTypeText = response.data.data.config.strategyTypeText;
            this.scatter = response.data.data.config.scatter;
            this.drawLine(
              this.gridLinePrices,
              this.middlePrice,
              this.strategyTypeText
            );
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
    drawLine(gridLinePrices, middlePrice, strategyTypeText) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      //坐标颜色
      var upColor = "#ec0000";
      var upBorderColor = "#8A0000";
      var downColor = "#00da3c";
      var downBorderColor = "#008F28";

      // 绘制图表
      myChart.setOption({
        //表格名称
        title: {
          text: strategyTypeText,
          left: "center",
          top: 0
        },
        backgroundColor: "rgb(17,17,19)",
        //公用的X轴
        xAxis: {
          type: "category",
          boundaryGap: false, //xAxis中的boundaryGap属性，设置为false代表是零刻度开始，设置为true代表离零刻度间隔一段距离
          splitLine: {
            show: false
          },
          //线的样式
          axisLine: { lineStyle: { color: "#8392A5" } },
          data: [
            "00:00",
            "01:15",
            "02:30",
            "03:45",
            "05:00",
            "06:15",
            "07:30",
            "08:45",
            "10:00",
            "11:15",
            "12:30",
            "13:45",
            "15:00",
            "16:15",
            "17:30",
            "18:45",
            "20:00",
            "21:15",
            "22:30",
            "23:45"
          ]
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
                    return value > middlePrice ? "red" : "green";
                  }
                }
              }
            },
            //横向网格线
            splitLine: {
              show: true,
              lineStyle: { color: "rgb(131,146,165,0.3)" }
            },
            data: gridLinePrices
          }
        ],
        series: [
          {
            //scatter为散点图
            type: "scatter",
            data: [[0, 0.6, 2463], [1, 3, 10784], [2, 5, 7849], [3, 7, 27456]]
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dnfbox {
}
.dnfbox .leftbox {
  float: left;
  width: 60%;
}
.dnfbox .rightbox {
  float: right;
  width: 40%;
  background-color: rgb(23, 23, 33);
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
  background: rgb(46, 46, 47);
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
  background-color: #171721;
}
.dnfbox .el-pager li {
  background-color: #171721;
  color: #c0c4cc;
}
.el-pager li.active {
  color: #409eff !important;
}
.dnfbox .el-pagination .btn-next {
  background-color: #171721;
  color: #c0c4cc;
}
.dnfbox .el-pagination .btn-prev {
  background-color: #171721;
  color: #c0c4cc;
}
</style>
