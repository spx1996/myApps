<template>
  <div>
    <div class="flow-wrap">
      <transition :duration="1000" name="face">
        <div v-bind:class="[currentAct ? 'idea' : 'bigIdea' , 'common-idea']">
          <div class="idea-right">
            eeee
          </div>
        </div>
      </transition>
      <div class="footer-btn">
        <div>
          <el-button size="small">取消</el-button>
          <el-button size="small" type="success" @click="changeDiv">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api.js";
export default {
  props: ["stateId","approversData","divId"],
  data: function() {
    return {
      currentAct:true,
    };
  },
  mounted(){
  },
  methods: {

    changeDiv(){
      this.currentAct = !this.currentAct;
    },
    
   
  }
}
</script>

<style lang="scss">
.flow-wrap {
  width:100%;
  padding:20px 20px 0 20px;

  //正常时显示的样子
  .idea {
    height:195px;
    border: 1px solid #cdd4d4;
  }
  //手签时的样子
  .bigIdea {
    height:360px;
    border: 1px solid  #cdd4d4;
    animation: change 1s;
    -moz-animation: change 1s;    
    -webkit-animation: change 1s;    
    -o-animation: change 1s;
  }
  @keyframes change{
    from {
      height: 195px;
    }
    to {
      height: 360px;
    }
  }

  //盒子idea的共同样式
  .common-idea {
    margin-top:20px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    width:100%;
    .idea-right {
      width:88%;
      height:100%;
      padding:10px 20px 10px 20px;
    }
  }
  .footer-btn {
    position: relative;
    display: -webkit-flex;
    display: flex;
    justify-content: flex-end;
    width:100%;
    height:40px;
    &>div {
      position: absolute;
      bottom:-50px;
    }
  }
}


</style>