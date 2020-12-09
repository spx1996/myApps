<template>
  <div id="searchFormTable" class="displayn" style="display: block;">
    <!-- 输出查询表单HTML -->
    <div class="searchDiv" id="searchFormPanel">
      <component name="searchform" :is="form(formdata)"></component>
    </div>
    <div class="row" v-show="searchBtnShow(formdata)">
      <div class="col-xs-12 text-center">
        <button id="searchBtn" type="button" class="btn btn-primary" @click="onSearchClick">查询</button>
        <button id="restBtn" type="button" class="btn btn-default btn-reset" @click="reset">重置</button>
      </div>
    </div>
  </div>
</template>


<script>
import API from "@/api.js";
export default {
  name: "form-searchform",
  props: ["appId", "viewId"],
  created: function() {
    this.initSearchForm({
      appId: this.appId,
      viewId: this.viewId
    });
  },

  data: function() {
    return {
      formdata: undefined,
    };
  },

  methods: {
    form(data) {
      if (data) {
        return {
          methods: {
            findField(id) {
              for (let i = 0; i < data.fields.length; i++) {
                let fld = data.fields[i];
                if (id == fld.id) return fld;
              }
              return null;
            }
          },
          template: "<div>" + data.template + "</div>"
        };
      } else
        return {
          template: "<div></div>"
        };
    },

    initSearchForm({ appId, viewId }) {
      API.getSearchFormTemplate(appId, viewId, {
        onSucess: response => {
          if (response.data.data) {
            this.formdata = response.data.data;
          }
        }
      });
    },

    searchBtnShow(data) {
      return data && data.template && data.template.length > 0;
    },
    
    onSearchClick() {
      let data = this.buildSearchData();
      
      let searchData = JSON.parse(JSON.stringify(this.buildSearchData()));
    
      data.appId = this.appId;
      data.viewId = this.viewId;
      this.$emit("onSearch",data, searchData);
      //this.$emit("onSearch", this.buildSearchData());
    },

    reset() {
      let fields = this.formdata.fields;
      fields.forEach(item => {
        item.value = "";
        // if(item.impressionVal) {
        //   //item.impressionVal = '';
        // }
      });
    },

    buildSearchData() {
      let data = {};
      for (let i = 0; i < this.formdata.fields.length; i++) {
        let fld = this.formdata.fields[i];
        data[fld.name] = fld.value;
      }
      return data;
    }
  }
};
</script>
