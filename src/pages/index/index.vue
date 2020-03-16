<template>
  <div class="tableheight">
    <el-table v-if="EventType1.length>0&StrategyName1.length>0&StrategyID1.length>0" :data="tableData" style="width: 100%;" :height="400" :span="24" :row-style="{height:'40px'}" :header-row-style="{height:'32px'}" :cell-style="{padding:'1px'}" :span-method="objectSpanMethod">
      <el-table-column prop="StrategyName" label="策略名称"  width="100"></el-table-column>
      <el-table-column prop="StrategyID" label="策略ID" width="140" ></el-table-column>
      <el-table-column prop="EventTypeText" label="事件类型"  width="100"></el-table-column>
      <el-table-column prop="EventTime" label="发生时间"  width="180"></el-table-column>
      <el-table-column prop="EventDetail" label="事件详情"  width="340"></el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-select v-model="value1" style="width:20%;" filterable clearable placeholder="策略名称">
            <el-option v-for="(item,index) in StrategyName1" :key="index" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="value2" style="width:18%;" filterable clearable placeholder="策略ID">
            <el-option v-for="(item,index) in StrategyID1" :key="index" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="value3" style="width:20%;" filterable clearable placeholder="事件类型">
            <el-option v-for="(item,index) in EventType1" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-date-picker v-model="value4" type="datetime" placeholder="发生时间" style="width:23%;"></el-date-picker>
          <el-button @click="search">搜索</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSzie" :pager-count="5" :total="total" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
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
      UserAccountID: ""
    };
  },
  created() {
    this.BrokerID = this.$route.query.BrokerID;
    this.UserAccountID = this.$route.query.UserAccountID;
  },
  watch: {
    EventType1: {
      handler(newVal, oldVal) {
        console.log("新：", newVal, "旧", oldVal);
      },
      deep: true
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
    //当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex == 4) {
          return [1, 2];
        }
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
          EventType: this.value3,
          StrategyName: this.value1,
          StrategyID: this.value2,
          StartTime: this.value4
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
.pagination {
  float: right;
  margin-top: 10px;
}
.tableheight {
  width: 100% !important;
  height: 450px;
  background-color: transparent;
}
</style>
<style>
.tableheight * {
  color: rgb(68, 71, 80) !important;
  font-size: 12px;
}
.tableheight .el-input__inner {
  height: 26px !important;
  line-height: 26px !important;
}
.tableheight .el-input__inner::placeholder {
  color: rgb(68, 71, 80) !important;
}
.tableheight .el-select .el-input .el-select__caret {
  margin-top: 8px !important;
}
.tableheight .el-select .el-input .el-select__caret.is-reverse {
  margin-top: -8px !important;
}
.tableheight .el-button {
  height: 26px !important;
  line-height: 1px !important;
}
.tableheight .el-icon-time {
  margin-top: -6px !important;
}
.tableheight .el-table__body-wrapper {
  background-color: #fff !important;
}
.el-picker-panel {
  line-height: 12px !important;
  top: 36px !important;
}
.el-date-picker__header {
  margin: 4px 12px 4px 12px !important;
}
.el-date-table td {
  padding: 0px !important;
}
.el-picker-panel__content {
  margin: 0px 15px 0px 15px !important;
}
</style>
