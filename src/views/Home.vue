<template>
  <div class="container">
    <div class="main" :style="{ width: width + 'px', height: height + 'px' }">111</div>
  </div>
</template>

<script>
import {
  Button,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Cell,
  CellGroup,
  List,
  Dialog,
  Field,
  Overlay,
  RadioGroup,
  Radio,
  Form,
  Toast,
} from "vant";
import { mapActions, mapMutations, mapState } from "vuex"; // createNamespacedHelpers
import FooterTabbar from "components/FooterTabbar";
import img from "assets/webpack.png";
import Clipic from "clipic";
const clipic = new Clipic();

import { playerstatusupd, picresult, wxoauth } from "@/api/user";
// const { mapActions } = createNamespacedHelpers('test') // 可使用这种方式直接获得test模板
export default {
  name: "home",
  data() {
    return {
      width:window.innerWidth,
      height:window.innerHeight
    }
  },
  components: {},
  computed: {},
  methods: {
    handResize(){
      this.width = window.innerWidth
      this.height = window.innerHeight
      console.log('Resize:', this.width, this.height);
      if (this.width > this.height && this.width>=768){
        // this.width = Math.min(this.width,1024)
        this.height = this.height
        this.width = this.height *(16/9)
        console.log('电脑设备: 9:16比例', this.width, this.height);
      }else {
        this.height = window.innerHeight
        console.log('手机或平板: 全屏展示', this.width, this.height);
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handResize);
    this.handResize()
  },
  beforeDestroy(){
      window.removeEventListener('resize', this.handResize)
    }
};
</script>
<style lang="scss" scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center; 
  height: 100vh;
  .main{
    background-color: yellow; /* 给 main 添加背景颜色 */
  }
}
</style>
