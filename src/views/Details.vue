<template>
  <div class="container">
    <div class="detailsPage" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="backBtn" @click="goBack"><Icon name="arrow-left" />返回</div>
      <!-- <Banner /> -->
      <div class="content">
        <div class="imgItem" v-for=" item in detailImages" :key="item.id">
          <img v-lazy="item.pic_name" alt="">
        </div>
      </div>
  </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Icon, Lazyload } from "vant"
// import { getAdvertising } from "@/api/user"
import Banner from "components/Banner"
Vue.use(Lazyload)
const baseUrl = 'https://eposter.tri-think.cn/uploadFile'
export default {
  name: 'details',
  components: {
    Banner,
    Icon,
  },
  data () {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      bannerHeight: 0,
      detailImages: [],
      itemData: this.$route.params.data
    }
  },
  computed: {},
  created () {
    console.log("获取banner信息成功", this.itemData)
    if (!this.itemData) {
      console.error("没有传递有效的 itemData");
      return;
    }
    const { pic_list } = this.itemData
    this.detailImages = pic_list
    this.detailImages.forEach(item => {
      item.pic_name = baseUrl +'/' +item.pic_name
    })
    console.log("this.detailImages=====", this.detailImages);
  },
  mounted () {
    window.addEventListener('resize', this.handResize)
    this.handResize()
  },
  methods: {
    handResize () {
      this.width = window.innerWidth
      this.height = window.innerHeight
      console.log('Resize:', this.width, this.height)
      if (this.width > this.height && this.width >= 768) {
        // this.width = Math.min(this.width,1024)
        this.height = this.height
        this.width = this.height * (9 / 16)
        console.log('电脑设备: 9:16比例', this.width, this.height)
      } else {
        this.height = window.innerHeight
        console.log('手机或平板: 全屏展示', this.width, this.height)
      }
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handResize)
  }
}

</script>
<style lang="scss" scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  .detailsPage{
    width: 100%;
    height: 100%;
    position: relative;
    .backBtn {
      position: absolute;
      top: 1%;
      left: 1%;
      color: #fff;
      cursor: pointer;
      font-size: 8px;
      z-index: 10;
    }
    .content{
      width: 100%;
      height: 80%;
      .imgItem{
        width: 100%;
        img{
          width: 100%;
          vertical-align: bottom;
        }
      }
    }
    .content .imgItem:nth-child(2){
          width: 100%;
          margin-top: -1px;
      }
  }
}
</style>
