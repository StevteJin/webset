<template>
  <div class="h5tableheight">
    <el-table
      v-if="EventType1.length>0&StrategyName1.length>0&StrategyID1.length>0"
      :data="tableData"
      style="width: 100%;"
      :height="500"
      :span="24"
      :row-style="{height:'40px'}"
      :header-row-style="{height:'32px'}"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="事件详情：">
              <span>{{ props.row.EventDetail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="StrategyName" label="策略名称" width="70"></el-table-column>
      <el-table-column prop="StrategyID" label="策略ID" width="60"></el-table-column>
      <el-table-column prop="EventTypeText" label="事件类型" width="75"></el-table-column>
      <el-table-column prop="EventTime" label="发生时间"></el-table-column>
    </el-table>
    <div class="h5pagination">
      <el-pagination
        :current-page.sync="currentPage"
        layout="prev, pager, next"
        :page-size="pageSzie"
        :pager-count="5"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import "normalize.css/normalize.css";
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "超级11多",
          address: "1211080221",
          type: "启动",
          content: "开仓231"
        },
        {
          date: "2016-05-04",
          name: "超级22多",
          address: "1211080221",
          type: "开仓",
          content: "开仓231"
        },
        {
          date: "2016-05-01",
          name: "超级33多",
          address: "1211080221",
          type: "开仓",
          content: "开仓231"
        },
        {
          date: "2016-05-03",
          name: "超级44多",
          address: "1211080221",
          type: "启动",
          content: "开仓231"
        }
      ],
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      EventType1: [],
      StrategyName1: [],
      StrategyID1: [],
      pageSzie: 20,
      currentPage: 1,
      total: 0,
      BrokerID: "",
      UserAccountID: "",
      StrategyName: "",
      StrategyID: "",
      EventType: "",
      StartTime: ""
    };
  },
  computed: {
    headerCellStyle() {
      return {
        background: "#2E2E3D",
        color: "#B9B8CA",
        fontSize: "12px",
        "border-bottom": "1px solid #171721",
        "border-right": "none",
        "border-left": "none",
        padding: "0px"
      };
    },
    cellStyle() {
      return {
        padding: "0px",
        fontSize: "12px",
        "border-top": "0px",
        "border-bottom": "1px solid #171721",
        background: "#21212D",
        color: "#FFFFFF",
        "border-left": "none",
        "border-right": "none"
      };
    }
  },
  created() {
    this.BrokerID = this.$route.query.BrokerID;
    this.UserAccountID = this.$route.query.UserAccountID;
    this.StrategyName = this.$route.query.StrategyName || "";
    this.StrategyID = this.$route.query.StrategyID || "";
    this.EventType = this.$route.query.EventType || "";
    //时间
    let a = this.$route.query.StartTime || "";
    if (a) {
      this.StartTime = this.timeFormat(a);
    }
  },
  watch: {
    EventType1: {
      handler(newVal, oldVal) {
        console.log("新：", newVal, "旧", oldVal);
      },
      deep: true
    },
    BrokerID: {
      handler(newVal, oldVal) {},
      deep: true
    },
    UserAccountID: {
      handler(newVal, oldVal) {},
      deep: true
    },
    StrategyName: {
      handler(newVal, oldVal) {},
      deep: true
    },
    StrategyID: {
      handler(newVal, oldVal) {},
      deep: true
    },
    EventType: {
      handler(newVal, oldVal) {},
      deep: true
    },
    StartTime: {
      handler(newVal, oldVal) {},
      deep: true
    },
    "$route.query": function(newVal, oldVal) {
      console.log("新的", newVal);
      location.reload();
    }
  },
  mounted() {
    //EventType这是事件类型，StrategyID策略id，StrategyName策略名称，对哇
    this.getEventType("EventType");
    this.getEventType("StrategyName");
    this.getEventType("StrategyID");
    this.getAccountList();
  },
  methods: {
    timeFormat(dateStr) {
      console.log("我是时间" + typeof dateStr);
      dateStr = Number(dateStr);
      let date = new Date(dateStr);
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return Y + M + D + h + m;
    },
    formatter(row, column) {
      return row.address;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountList();
    },
    search() {
      this.getAccountList();
    },
    getAccountList() {
      this.axios
        .post("/three/strategy/log", {
          BrokerID: this.BrokerID,
          UserAccountID: this.UserAccountID,
          size: this.pageSzie,
          page: this.currentPage,
          EventType: this.EventType,
          StrategyName: this.StrategyName,
          StrategyID: this.StrategyID,
          StartTime: this.StartTime
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
    getEventType: function(type) {
      this.axios
        .post("/three/search/field", {
          BrokerID: this.BrokerID,
          UserAccountID: this.UserAccountID,
          SearchField: type
        })
        .then(response => {
          if (response.data.code == 1) {
            if (type == "EventType") {
              this.EventType1 = response.data.data;
              console.log("类型", this.EventType1.constructor == Array);
              // console.log("事件类型", typeof(this.EventType1));
            } else if (type == "StrategyName") {
              this.StrategyName1 = response.data.data;
              // console.log("策略名称", this.StrategyName);
            } else if (type == "StrategyID") {
              this.StrategyID1 = response.data.data;
              // console.log("策略ID", this.StrategyID);
            }
            this.$forceUpdate();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.h5pagination {
  float: right;
  margin-top: 10px;
}
.h5tableheight {
  width: 100% !important;
  padding: 0;
  margin: 0;
  border: 0;
  height: 90vh;
  background-color: #171721;
}
.demo-table-expand {
  font-size: 0;
  background-color: #171721;
  padding-bottom: 0px;
  width: 100%;
}
.demo-table-expand label {
  background-color: #171721;
}
.demo-table-expand .el-form-item {
  background-color: #171721;
  color: #ff3b2c;
  margin-bottom: 0;
}

.el-table__empty-block {
  background-color: #171721;
}
body {
  background-color: #171721;
}
</style>
<style>
.el-table {
  background-color: #171721;
}
.el-table__expanded-cell {
  padding: 0px !important;
  padding-left: 20px !important;
  background-color: #171721;
}
.h5tableheight .el-pagination button:disabled {
  background-color: #171721;
}
.h5tableheight .el-pager li {
  background-color: #171721;
  color: #c0c4cc;
}
.el-pager li.active{
  color: #409EFF!important;
}
.h5tableheight .el-pagination .btn-next {
  background-color: #171721;
  color: #c0c4cc;
}
.h5tableheight .el-pagination .btn-prev {
  background-color: #171721;
  color: #c0c4cc;
}
</style>

