<template>
    <div :id='id' style="width:100%; position:relative;">
      <template v-if="field.displayType == Constant.PermissionType_HIDDEN">
				<!--隐藏-->
				{{field.hiddenValue}}
			</template>

      <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
        <input type="button" class="btns" value="查询" @click.stop.prevent="searchBox($event)">
        <div class="change-map">
          <span @click="normalMap()" :class="mapNum==1?'map-color':''">地图</span>
          <span @click="mixMap()" :class="mapNum==2?'map-color':''">混合</span>
        </div>
        <div class="search-frame" v-if="isActive">
          <div class="frame-content">
            <div class="header">
              <span>搜索:</span>
              <input type="button" class="btns" value="关闭" @click.stop.prevent="searchBox()">
            </div>
            <div class="wrap">
              <span>经纬度搜索：</span>
              <span>经度：</span>
              <span>
                <el-input  placeholder="" v-model="currentLongitude"></el-input>
              </span>
              <span>纬度：</span>
              <span>
                <el-input  placeholder="" v-model="currentLatitude"></el-input>
              </span>
              <span>
                <!-- <button @click="changeLAL()">查询</button> -->
                <input type="button" class="btns" value="查询" @click.stop.prevent="changeLAL()">
              </span>
              <span>地址搜索：</span>
              <span>详细地址</span>
              <span>
                <el-input v-model="keyword" ></el-input>
              </span>
              <span>
                <input type="button" class="btns" value="查询" @click.stop.prevent="searchLocation()">
              </span>
            </div>
          </div>
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
          <bm-marker v-if="markerHidden" :position="markerPoint" :dragging="true" @click="infoWindowOpen">
            <bm-info-window 
              :show="show" 
              @close="infoWindowClose" 
              @open="infoWindowOpen"
              style="width:280px;height:220px;"
            >
              <!-- {{markerAdress}} -->
              <div class="address-wrap">
                <div>地址：</div>
                <div class="info">{{markerAdress}}</div>
                <div class="common">
                  <div>添加标题：</div>
                  <el-input  placeholder="" v-model="adressTitle"></el-input>
                </div>
                <div class="add-con">
                  <div>添加内容：</div>
                  <el-input  placeholder="" v-model="adressContent"></el-input>
                </div>
                <div class="isEmpty" v-if="isWarring">标题或者内容不能为空！！！</div>
                <div class="add-btn">
                  <span>
                    <input type="button" class="btns" value="确定" @click.stop.prevent="onOk()">
                  </span>
                  <span>
                    <input type="button" class="btns" value="重置" @click.stop.prevent="onReset()">
                  </span>
                </div>
              </div>
            </bm-info-window>
          </bm-marker>
          <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type> -->
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" 
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
      </template>

      <template v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      
      </template>

      <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
				<!--可编辑-->
        <!-- <button @click.prevent="searchBox()">查询</button> -->
        <input type="button" class="btns" value="查询" @click.stop.prevent="searchBox($event)">
        <div class="change-map">
          <span @click="normalMap()" :class="mapNum==1?'map-color':''">地图</span>
          <span @click="mixMap()" :class="mapNum==2?'map-color':''">混合</span>
        </div>
        <div class="search-frame" v-if="isActive">
          <div class="frame-content">
            <div class="header">
              <span>搜索:</span>
              <input type="button" class="btns" value="关闭" @click.stop.prevent="searchBox()">
            </div>
            <div class="wrap">
              <span>经纬度搜索：</span>
              <span>经度：</span>
              <span>
                <el-input  placeholder="" v-model="currentLongitude"></el-input>
              </span>
              <span>纬度：</span>
              <span>
                <el-input  placeholder="" v-model="currentLatitude"></el-input>
              </span>
              <span>
                <!-- <button @click="changeLAL()">查询</button> -->
                <input type="button" class="btns" value="查询" @click.stop.prevent="changeLAL()">
              </span>
              <span>地址搜索：</span>
              <span>详细地址</span>
              <span>
                <el-input v-model="keyword" ></el-input>
              </span>
              <span>
                <input type="button" class="btns" value="查询" @click.stop.prevent="searchLocation()">
              </span>
            </div>
          </div>
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
          <bm-marker v-if="markerHidden" :position="markerPoint" :dragging="true" @click="infoWindowOpen">
            <bm-info-window 
              :show="show" 
              @close="infoWindowClose" 
              @open="infoWindowOpen"
              style="width:280px;height:220px;"
            >
              <!-- {{markerAdress}} -->
              <div class="address-wrap">
                <div>地址：</div>
                <div class="info">{{markerAdress}}</div>
                <div class="common">
                  <div>添加标题：</div>
                  <el-input  placeholder="" v-model="adressTitle"></el-input>
                </div>
                <div class="add-con">
                  <div>添加内容：</div>
                  <el-input  placeholder="" v-model="adressContent"></el-input>
                </div>
                <div class="isEmpty" v-if="isWarring">标题或者内容不能为空！！！</div>
                <div class="add-btn">
                  <span>
                    <input type="button" class="btns" value="确定" @click.stop.prevent="onOk()">
                  </span>
                  <span>
                    <input type="button" class="btns" value="重置" @click.stop.prevent="onReset()">
                  </span>
                </div>
              </div>
            </bm-info-window>
          </bm-marker>
          <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type> -->
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" 
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
      </template>

    </div>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-map",
  props: ["id"],
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    },
  },
  data: function() {
		return {
      Constant,
      center: {
        lng: 116.404, 
        lat: 39.915
      },
      zoom: 3,
      currentStyle:"search-frame",
      isActive:false,
      currentMapType:"BMAP_NORMAL_MAP",
      mapNum:1,
      currentLongitude:"",
      currentLatitude:"",
      keyword: '',
      location:'',
      show: false,
      markerPoint: {
        lng:'',
        lat:'',
      },
      markerAdress:'',
      adressTitle:'',
      adressContent:'',
      markerHidden:true,
      isWarring: false,
		}
  },
  
  methods: {
    onOk(){
      if(this.adressTitle && this.adressContent) {
        this.isWarring = false;
        this.show = false;
      }else {
        this.isWarring = true;
      }
      
    },
    onReset() {
      this.adressTitle = '';
      this.adressContent = '';
    },
    handler ({BMap, map}) {
      console.log({BMap, map})
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 3
      // var point = new BMap.Point(109.49926175379778, 36.60449676862417)
      // map.centerAndZoom(point, 13)
      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中
      // var circle = new BMap.Circle(point, 6, { strokeColor: 'Red', strokeWeight: 6, strokeOpacity: 1, Color: 'Red', fillColor: '#f03' })
      // map.addOverlay(circle)
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
      console.log("设置标记");
      let mLng = e.point.lng,
          mLat = e.point.lat;
      this.setMark(mLng, mLat, close = true);
    },
    cancelSign({BMap, map}){
      //有问题，隐藏
      this.markerHidden = false;
//       console.log(allOverlay);
//        for (var i = 0; i < allOverlay.length; i++){
//           map.removeOverlay(allOverlay[i]);
//        } 
    },
    infoWindowClose () {
      this.show = false
    },
    infoWindowOpen () {
      this.show = true
    },
    getDbclickInfo (e) {
      let mLng = e.point.lng,
          mLat = e.point.lat;
      this.setMark(mLng, mLat);
    },
    setMark(mLng, mLat, close){
      console.log(close);
      let that = this;
      let myGeo = new BMap.Geocoder();
      let p = new BMap.Point(mLng, mLat);
      myGeo.getLocation(p, function(rs){
        let addComp = rs.addressComponents;
        let address = addComp.province+addComp.city+addComp.district+addComp.street+addComp.streetNumber;
        if(that.markerAdress && that.markerAdress !=  address) {
          that.adressTitle = '';
          that.adressContent = '';
        }
        that.markerAdress = address;
        that.markerPoint.lng = mLng;
        that.markerPoint.lat = mLat;
        that.markerHidden = true;
        if(close == true) {
          that.show = false
        }else {
          that.show = true;
        }
        console.log("that.markerAdress---->", that.markerAdress);
      });
    },
    normalMap(){
      console.log("正常")
      if(this.mapNum == 2) {
        this.currentMapType = "BMAP_NORMAL_MAP"
        this.mapNum = 1;
      }
    },
    mixMap(){
      console.log("混合");
      if(this.mapNum == 1) {
        this.currentMapType = "BMAP_HYBRID_MAP"
        this.mapNum = 2;
      }
    },
    searchLocation(){
      this.location = this.keyword;
    },
    searchBox(e) {
      console.log("55555");
      this.isActive = !this.isActive;
    },
    changeLAL () {
      console.log("经纬度改变了");
      let that = this;
      if(this.currentLongitude && this.currentLatitude) {
        this.center = {
          lng: that.currentLongitude,
          lat: that.currentLatitude
        },
        this.zoom = 15;
      }
      
    },
  }
}
</script>

<style lang="scss">
  .bm-view {
    margin:0 auto;
    width: 95%;
    height: 600px;
  }
  .isHidden {
    display: none;
  }
  .btns{
    padding:2px 7px;
    font-size: 11px;
  }
  .change-map {
    width:75px;
    height:20px;
    position:absolute;
    right:36px;
    top:40px;
    z-index:5000;
    display:-webkit-flex;
    display: flex;
    flex-direction: row;
    background:white;
    border:1px solid #8ea8e0;
    border-radius: 4px;
    overflow: hidden;
    -webkit-box-shadow:2px 2px 4px #8ea8e0;  
    -moz-box-shadow:2px 2px 4px #8ea8e0;  
    box-shadow:2px 2px 4px #8ea8e0; 
    span {
      cursor:pointer;
      display:block;
      width:50%;
      height:20px;
      line-height: 20px;
      text-align: center;
      font-size:12px;
    }
  }
  .map-color{
    background:#8ea8e0;
    color:white;
    font-weight:bold;
  }
  .search-frame{
    width:215px;
    border:1px solid black;
    background: white;
    position: absolute;
    left:0;
    top:30px;
    z-index:5000;
    .frame-content {
      width:100%;
      height:560px;
      .header {
        width:100%;
        height:40px;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        background:#e2e2e2;
        span:first-child {
          margin-left:3px;
          width:80%;
          font-size:22px;
          font-weight: bold;
        }
      }
      .wrap {
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        padding-left:3px;
        padding-right:3px;
        span:first-child {
          width:100%;
          height:40px;
          line-height:40px;
          font-size:19px;
          font-weight:bold;
          margin-bottom:10px;
        }
        span:nth-child(2),span:nth-child(4),span:nth-child(8) {
          height:30px;
          line-height:30px;
          font-size:16px;
        }
        span:nth-child(6), span:nth-child(10){
          margin-top:10px;
        }
        span:nth-child(7) {
          margin-top:40px;
          height:40px;
          line-height:40px;
          font-size:19px;
          font-weight:bold;
          margin-bottom:10px;
        }
      }
    }
  }
  .address-wrap {
    width:100%;
    &>div{
      width:100%;
      display:-webkit-flex;
      display: flex;
      flex-direction:row;
      &>div{
        height:40px;
        line-height:40px;
        vertical-align:middle;
        white-space:nowrap;
      }
      &:first-child {
        margin: 5px 0 10px 0;
        font-weight: bold;
      }
    }
    .info {
      margin-bottom:30px;
    }
    .add-con {
      margin-top: 10px;
    }
    // .common {
    //   margin-bottom: 15px;
    // }
    .isEmpty {
      color:red;
      margin-top: 5px;
      margin-bottom: 10px;
      text-align: center;
    }
    .add-btn {
      margin-top:15px;
      display: -webkit-flex;
      display:flex;
      justify-content: center;
      &>span {
        margin-right:30px;
      }
    }
  }
</style>