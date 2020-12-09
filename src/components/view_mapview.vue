<template>
  <div class="map-view">
    <div class="btns">
      <span class="btn-icon" v-for="(item, index) in view.activities" :key="index">
        <!-- <i class="el-icon-plus" v-if="item.type == 2" @click="handleBtn(item.type, item)"></i>
          <i class="el-icon-delete" v-else-if="item.type == 3" @click="handleBtn(item.type, item)"></i> -->
          <a
            class="1 vbtn btn btn-primary obpm-primary"
            :class="item.color"
            :title="item.name"
            autobuild="false"
            @click="handleBtn(item.type, item)"
            v-if="item.type == 2"
          >
            <i v-if="item.icon && item.icon.type=='font'" :class="item.icon.icon"/>
            <img v-else-if="item.icon" :src="'../../lib/icon/'+item.icon.icon" height="14">
            <i v-else class="queryBtnicon"></i>
            {{item.name}}
          </a>
      </span>
      <span>
        <el-switch
          v-model="wayValue"
          inactive-text="显示路线"
         >
        </el-switch>
      </span>
      <!-- <span class="btn-icon">
        <i class="el-icon-delete"></i>
      </span> -->
    </div>
    <div class="map-con" 
      ref = "mapView"
    >
      <div class="view-map">
        <span @click="normalMap()" :class="mapNum==1?'map-color':''">地图</span>
        <span @click="mixMap()" :class="mapNum==2?'map-color':''">卫星</span>
      </div>
      <baidu-map
        id="box"
        :center="center" 
        :zoom="zoom"  
        class="bm-view"
        :mapType="currentMapType"
        @dblclick="getDbclickInfo"
        :double-click-zoom = "false"
        @zoomend="zoomEnd"
        >
        <div v-if="viewDataList.data && viewDataList.data.length>0">
          <div v-for="(item,index) in viewDataList.data" :key="index">
            <bm-marker :position="item.local?item.local:{lng:'',lat:''}" :dragging="true" @click="infoWindowOpen(item.id, item)">
            </bm-marker>
          </div>
        </div>
        <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type> -->
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        <bm-geolocation anchor="BMAP_ANCHOR_TOP_RIGHT" 
          :showAddressBar="true" 
          :autoLocation="true">
        </bm-geolocation>
        <bm-local-search 
          :keyword="location" 
          :auto-viewport="true" 
          style="display: none"
        >
        </bm-local-search>
        <bm-context-menu>
          <bm-context-menu-item :callback="setSign" text="标记该点位置"></bm-context-menu-item>
          <bm-context-menu-item :callback="cancelSign" text="取消标记"></bm-context-menu-item>
          <bm-context-menu-item :callback="enlargeMap" text="放大"></bm-context-menu-item>
          <bm-context-menu-item :callback="reduceMap" text="缩小"></bm-context-menu-item>
        </bm-context-menu>
      </baidu-map>
    </div>
    <div class="num">总条数：{{row_count}}</div>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  name: "view-mapview",
  props: ["view", "info"],
  data: function() {
		return {
      center: {
        lng: 113.261503, 
        lat: 23.131377
      },
      zoom: 14,
      isActive:false,
      currentMapType:"BMAP_NORMAL_MAP",
      mapNum:1,
      currentLongitude:"",
      currentLatitude:"",
      keyword: '',
      location:'',
      show: false,
      markerPoint: {
        
      },
      markerAdress:'',
      adressTitle:'',
      adressContent:'',
      markerHidden:true,
      viewDataList:'',
      markerList:[],
      localDetail:'',
      id:'',
      pendingContentH: "",
      row_count:'',
      wayValue: false,
		}
  },
  mounted() {
    this.getData();
    this.$nextTick(function() {
      if(this.$refs.mapView) {
        this.pendingContentH =
          document.documentElement.clientHeight -
          this.$refs.mapView.getBoundingClientRect().top;
      }
    });
  },
  methods: {
     handleBtn(type, item) {
      let params = {
        linkType: "00",
        appId: this.$root.appid,
        active: true,
        name:'地图视图',
        actionContent: item.onActionForm,
      };
      this.$emit("add-tab", params)
    },
    getData() {
      this.$api.getViewData(
        //普通试图接口
        this.$root.appid,
        this.view.id,
        {},

        {},
        {
          onSucess: response => {

            let viewData = response.data.data;
            this.row_count = viewData.row_count;
            //let map = new BMap.Map();
            let myGeo = new BMap.Geocoder();
            for(let i=0; i<viewData.data.length; i++) {
              for(let j=0; j<this.view.columns.length; j++) {
               
                let obj = {};
                if(j == 1) {
                  let addressData = viewData.data[i].items[this.view.columns[j].id];
                  let address = addressData.value; 
                  myGeo.getPoint(address ,(point) => {
                    obj.lng = point.lng;
                    obj.lat = point.lat;
                    viewData.data[i].local = obj;
                  }) 
                }
              }
            }
            this.viewDataList = viewData;
            
          }
        }
      );
    },
    handler ({BMap, map}) {
      this.center.lng = 113.261503;
      this.center.lat = 23.131377;
      this.zoom = 9
      console.log(BMap);
      console.log(map);
    },
    zoomEnd(e){
      console.log(e)
      this.zoom = e.target.getZoom();
    },
    //右键放大
    enlargeMap(e){
      this.center = {
        lng: e.point.lng,
        lat: e.point.lat
      };
      this.zoom = this.zoom+2;
      if(this.zoom>=19){
        this.zoom = 19;
      }
      console.log(this.zoom);
    },
    //右键缩小
    reduceMap(e){
      this.center = {
        lng: e.point.lng,
        lat: e.point.lat
      };
      this.zoom = this.zoom-2;
      if(this.zoom<=0) {
        this.zoom = 1
      }
    },
    setSign(e){
      let mLng = e.point.lng,
          mLat = e.point.lat;
      this.setMark(mLng, mLat);
    },
    cancelSign({BMap, map}){
      //有问题，隐藏
      this.markerHidden = false;
      console.log(BMap);
      console.log(map);
    },
    infoWindowClose () {
      this.show = false
    },
    infoWindowOpen (id,item) {
      let arr = [];
      for(let j=0; j<this.view.columns.length; j++) {   
        let obj = {};
        let name = item.items[this.view.columns[j].id].name;
        let value = item.items[this.view.columns[j].id].value;
        obj.name = name,
        obj.value = value;
        arr.push(obj);
      }
      this.localDetail = arr;
      this.show = true
      this.id = id;
    },
    getDbclickInfo (e) {
      let mLng = e.point.lng,
          mLat = e.point.lat;
      this.setMark(mLng, mLat);
    },
    normalMap(){
      if(this.mapNum == 2) {
        this.currentMapType = "BMAP_NORMAL_MAP"
        this.mapNum = 1;
      }
    },
    mixMap(){
      if(this.mapNum == 1) {
        this.currentMapType = "BMAP_HYBRID_MAP"
        this.mapNum = 2;
      }
    },
    searchLocation(){
      this.location = this.keyword;
    },
    searchBox(e) {
      this.isActive = !this.isActive;
      console.log(e);
    },
    Delete(id){
      let that = this;
      console.log('删除',id)
      let arr =[];
      arr.push(id);
      this.$api.batchRemoveDocuments(this.$root.appid, arr, {
        onSucess: () => {
          Toast({
            message: "删除成功",
            iconClass: 'fa fa-check fa-2x'
          });
          that.reload();
        }
      });
    }
  }
}
</script>

<style lang="scss">

</style>