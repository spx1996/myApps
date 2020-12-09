<template>
  <div class="calendar-view">
    <div 
      class="act-btns" 
    >
      <activity 
        v-for="activity in view.activities" 
        :key="activity.id" 
        :info="activity"
      />
      <a
        class="btn btn-primary btn-type"
        style="background:#8ec9f6;color:white;"
        @click="onClick"
      >
        列表显示
      </a>
    </div>
    <!--列表显示-->
    <div v-if="showViewList" class="show-view">
       <el-table
        min-height="270"
        ref="multipleTable"
        v-if="view.columns && view.columns.length>0"
        :data="tableData"
        style="width: 100%"
        @row-click="onRowClick"
        @selection-change="handleSelectionChange"
        :span-method="arraySpanMethod"
      >
        <el-table-column 
          type="selection" 
          v-model="checkedAll" 
          width="55"
        >
        </el-table-column>
        <template v-for="(column, index) in view.columns">
          <el-table-column
            :show-overflow-tooltip="true"
            :key="index"
            :prop="column.id"
            :label="column.name"
            :width="column.width"
            :sortable="column.isOrderByField=='true'?true:false"
            v-if="!column.hiddenColumn"
          >
            <template slot-scope="scope">
              {{scope.row[column.id]}}
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="calendar-wrap" v-else>
      <div class="cal-type">
        <div class="date">
          <span>
            <i class="upperDataicon" @click="prevTime(currentActive)"></i>
          </span>
          <span>
            <div v-if="currentActive == 1">
              {{currentDate}}
            </div>
            <div  v-else-if="currentActive == 2">
              {{currentDate}}
            </div>
            <div  v-else-if="currentActive == 3">
              {{currentDate}}
            </div>
          </span>
          <span>
            <i class="lowerDataicon" @click="nextTime(currentActive)"></i>
          </span>
        </div>
        <div class="view-type">
          <span :class="{date_active:currentActive==1?true:''}" @click="showView(1)">日视图</span>
          <span :class="{date_active:currentActive==2?true:''}" @click="showView(2)">周视图</span>
          <span :class="{date_active:currentActive==3?true:''}" @click="showView(3)">月视图</span>
        </div>
      </div>
      <div class="cal-box">
        <div class="day-view" v-if="currentActive == 1">
          <el-table
            min-height="270"
            ref="multipleTable"
            v-if="view.columns && view.columns.length>0"
            :data="tableData"
            style="width: 100%"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
            :span-method="arraySpanMethod"
          >
            <el-table-column 
              type="selection" 
              v-model="checkedAll" 
              width="55"
            >
            </el-table-column>
            <template v-for="(column, index) in view.columns">
              <el-table-column
                :show-overflow-tooltip="true"
                :key="index"
                :prop="column.id"
                :label="column.name"
                :width="column.width"
                :sortable="column.isOrderByField=='true'?true:false"
                v-if="!column.hiddenColumn"
              >
                <template slot-scope="scope">
                  {{scope.row[column.id]}}
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div class="week-view" v-if="currentActive == 2">
          
          <!-- <ul class="ul">
            <li  
              class="li"
              v-for="(column,i) in view.columns"
              :key="i"
            >
              <div>{{column.name}}</div>
              <div
                v-for="(row,index) in documents"
                :key="index">
                {{row.items[column.id].value}}
              </div>
            </li>
          </ul> -->
          <div>
            <table>
              <thead>
                <tr>
                  <th v-for="(column,i) in view.columns"
                  :key="i">{{column.name}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(column,i) in view.columns"
                  :key="i">
                  <td>{{i}}</td>
                  <td>{{i}}</td>
                  <td>{{i}}</td>
                  <td>{{i}}</td>
                  <td>{{i}}</td>
                </tr>
              </tbody>
            </table>
            {{tableData}}
            <!-- <ul class="try-ul-li">
              <li  
                class="li"
                v-for="(column,i) in view.columns"
                :key="i"
              >
                <div>{{column.name}}</div>
                <div
                  v-for="(row,index) in documents"
                  :key="index">
                  {{row.items[column.id].value}}
                </div>
              </li>
            </ul> -->
          </div>
          
        </div>
        <div class="mon-view" v-if="currentActive == 3">
          dd4444
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import activity from "@/components/activity.vue";
export default {
  name: "view-calendarview",
  props: [
    "view",
    "openParams",
    "showtype",
  ],
  components: {
    activity,
  },
  watch: {
    
  },
  computed: {
    
  },

  mounted() {
    this.getData();
  },

  data: function() {
    return {
      tableData:[],
      documents:'',
      currentActive:1,
      checkedAll:[],
      dayNumber: 1,
      currentDate:'',
      showViewList:false,
      currentWeek:0,
      addWeekNum:'',
      startTime:'',
      endTime:'',
      oneWeekArray:[]
    };
  },

  methods: {
    onClick() {
      if(this.showViewList) {
        this.showViewList = false
      }else {
        let startTime = "1900-01-01 00:00",
          endTime = "2099-12-31 00:00";
        this.showViewList = true;
        this.getData('', '', '', startTime, endTime);
      }
       
    },
    writeCurrentDate(val, paramTime){
      let day = ''
      if(val == "NEXT") {
        day = new Date();
        day.setTime(day.getTime()+24*60*60*1000*this.dayNumber);
      }else if(val == "PREV"){
        let str = this.currentDate;
        str = str.replace(/-/g,'/');
        day = new Date(str);
        day.setTime(day.getTime()-24*60*60*1000);
      }else if(val == "WEEK") {
        day = new Date(paramTime);
      }
      let year = day.getFullYear()
      let Month = day.getMonth() + 1;
      let Day = day.getDate();
      Month = Month >= 10 ? Month: "0"+Month;
      Day = Day >= 10 ? Day: "0" + Day;
      let s = year +"-" +  Month + "-" + Day;
      return s;
      
    },

    //下一个时间
    nextTime(currentActive) {
      if(currentActive == 1) { //日视图
        this.currentDate = this.writeCurrentDate("NEXT");
        this.dayNumber++;
        let startTime = this.currentDate + " 00:00";
        let endTime = this.currentDate + " 24:00";
        this.getData('', '', '', startTime, endTime); 
      }else if (currentActive == 2) {
        this.oneWeekArray = [];
        this.currentWeek = this.currentWeek + 1;
        let isNext = true;
        let saturday = this.getMonday("s",0, this.currentWeek, isNext)
        let sunday = this.getMonday("e",0, this.currentWeek, isNext);
        this.currentDate = saturday + "~" + sunday;
        this.addWeekNum = this.currentWeek;
        let startTime = this.oneWeekArray[0] + " 00:00";
        let endTime = this.currentDate[6] + " 24:00";
        this.getData('', '', '', startTime, endTime);
      }
    },

    //上一个时间
    prevTime(currentActive) {
      if(currentActive == 1) {
        this.currentDate = this.writeCurrentDate("PREV");
        this.dayNumber--;
        let startTime = this.currentDate + " 00:00";
        let endTime = this.currentDate + " 24:00";
        this.getData('', '', '', startTime, endTime); 
      }else if (currentActive == 2) {
        this.oneWeekArray = [];
        if(this.addWeekNum > 1) {
          this.currentWeek = this.addWeekNum;
          this.addWeekNum--;
        }else {
          this.currentWeek = this.currentWeek+1;
        }
        
        //this.currentWeek = this.currentWeek + 1;
        let isNext = false;
        let saturday = this.getMonday("s",0, this.currentWeek, isNext)
        let sunday = this.getMonday("e",0, this.currentWeek, isNext);
        this.currentDate = saturday + "~" + sunday;
        if(saturday && sunday) {
          let startTime = saturday + " 00:00";
          let endTime = sunday + " 24:00";
          this.getData('', '', '', startTime, endTime);
        }
        
      }
    },

    showView(val) {
      if(val == 1) {
        this.currentActive = val;
      }else if(val ==2) {
        this.oneWeekArray = [];
        this.currentWeek = 1;
        let isNext = true;
        let saturday = this.getMonday("s",0, this.currentWeek, isNext);
        let sunday = this.getMonday("e",0, this.currentWeek, isNext);
        this.currentDate = saturday + "~" + sunday;
        this.currentActive = val;
      }else if(val == 3) {
        debugger

      }
    },

    getMonday(type, dates, num, nextOrPrev, valTime) {
      let weekTime = '';
      weekTime = 24 * 60 * 60 * 1000 * 7 * (num -1);
      let now = new Date();
      let nowTime = now.getTime();
      let day = now.getDay();
      let longTime = 24 * 60 * 60 * 1000;
      let n = longTime * 7 * (dates || 0);
      let dd;
      let dateArr = [];
      if (type == "s") {
          if(nextOrPrev) {
            dd = nowTime - (day - 1) * longTime + weekTime + n - longTime;
            let arr = [];
            for(let i=0; i<7; i++) {
              let value = i>0?(i*longTime+dd):dd
              let val = "WEEK"
              let ymd = this.writeCurrentDate(val, value);
              arr.push(ymd);
              if(i<6) {
                this.oneWeekArray.push(ymd);
              }
            }
          }else {
            if(this.addWeekNum > 1) {
              let less = 24 * 60 * 60 * 1000 * 7 * (num - 2);
              dd = nowTime - (day - 1) * longTime + less + n - longTime;
            }else {
              dd = nowTime - (day - 1) * longTime - weekTime + n - longTime;
            }
            let arr = [];
            for(let i=0; i<7; i++) {
              let value = i>0?(i*longTime+dd):dd
              let val = "WEEK"
              let ymd = this.writeCurrentDate(val, value);
              arr.push(ymd);
              if(i<6) {
                this.oneWeekArray.push(ymd);
              }
            }
            
          }
        
      };
      if (type == "e") {
        if(nextOrPrev) {
          dd = nowTime + (7 - day) * longTime + weekTime + n - longTime;
          this.endTime = dd;
          let val = "WEEK";
          let ymd = this.writeCurrentDate(val, dd);
          this.oneWeekArray.push(ymd);
        }else {
          if(this.addWeekNum > 1) {
            let less = 24 * 60 * 60 * 1000 * 7 * (num - 2);
            dd = nowTime + (7 - day) * longTime + less + n - longTime;
          }else {
            dd = nowTime + (7 - day) * longTime - weekTime + n - longTime;
          }
          let val = "WEEK";
          let ymd = this.writeCurrentDate(val, dd);
          this.oneWeekArray.push(ymd);
        } 
      }; 
      console.log("this.oneWeekArray---->",this.oneWeekArray);
      dd = new Date(dd);
      let y = dd.getFullYear();
      let m = dd.getMonth() + 1;
      let d = dd.getDate();
      m = m < 10 ? "0" + m: m;
      d = d < 10 ? "0" + d: d;
      let ymd = y + "-" + m + "-" + d;
      return ymd;
    },


    onRowClick() {

    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if(row && row.isInclude && columnIndex == 1) {
        let len =  this.view.columns.length;  
        return [1,len];
      }
    },
    handleSelectionChange() {

    },
    
    getData(page, size, searchData, startTime, endTime) {
      this.getViewData(page, size,searchData, startTime, endTime).then(response => {
        let docs = response.data.data;
        this.documents = response.data.data;
        // let docArr = [];
        // for(let i=0; i<this.view.columns.length; i++) {
        //   for(let j=0; j<this.documents.length; j++) {
        //     if(this.documents[j].items) {
        //       for(let key in this.documents[j].items) {
        //         if(key == this.view.columns[i].id) {
        //           let obj = {};
        //           obj[key] = this.documents[j].items[key].value;
        //           docArr.push(arr1)
        //           console.log("this.documents.items--->",this.documents[j].items[key].value);
        //         }
        //       }
        //     }

        //   }
        // }
        // console.log("docArr--->",docArr);f

        this.row_count = response.data.row_count;
        let tds = [];
        if (docs)
          docs.forEach(doc => {
            let rows = {};
            rows.formId = doc.formId;
            rows.docId = doc.id;
            for (var key in doc.items) {
              let items = doc.items[key];
              rows[key] = items.value;
            }
            if(doc.isSum) {
              rows.isSum = doc.isSum;
            }
            tds.push(rows);
          });
          
          this.tableData = tds;
      });
    },
    
    getCurrentDate() {
      let day = new Date();
      day.setTime(day.getTime());
      let year = day.getFullYear()
      let Month = day.getMonth() + 1;
      let Day = day.getDate();
      Month = Month >= 10 ? Month: "0"+Month;
      Day = Day >= 10 ? Day: "0" + Day;
      let s = year +"-" +  Month + "-" + Day;
      this.currentDate = s;
      let obj = {
        startDate: s + " 00:00",
        endDate: s + " 24:00"
      }
      return obj;
    },

    //模拟数据请求
    getViewData(page, size, searchData, startTime, endTime) {
      let startDate = startTime?startTime:this.getCurrentDate().startDate;
      let endDate = endTime?endTime:this.getCurrentDate().endDate;
      let treeData = "";
      let treeName = "";
      return new Promise(resolve => {
        this.$api.getViewData(
          //普通视图接口
          this.$root.appid,
          this.view.id,
          {
            parentId: this.parentId ? this.parentId : "",
            currpage: page?page:this.currentPage,
            lines: 10,
            searchWord:'',
            startDate:startDate,
            endDate:endDate,
          },
          searchData?searchData:{},
          {
            onSucess: response => {
              let viewData = response.data;
              resolve(viewData);
            }
          }
        );
      });
    },
  },
};
</script>