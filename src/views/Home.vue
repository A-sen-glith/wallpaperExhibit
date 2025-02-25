<template>
  <div class="container">
    <div class="main" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="advert" v-if="showAdvert">
        <Swipe type="mask" class="swipe">
          <SwipeItem class="advertisingImg" v-for="(item, index) in advertImages" :key="index">
            <img v-lazy="item.pic_name" />
          </SwipeItem>
        </Swipe>
        <div class="advertSwitch" @click="showAdvert = false">关闭</div>
      </div>

      <Banner />
      <div class="content">
        <div class="selectType">
          <div class="Classification">
            <div class="ClassificationTitle">分类</div>
            <select class="ClassificationSelect">
              <option value="" disabled selected hidden>请选择</option>
              <option value="1">分类1</option>
              <option value="2">分类2</option>
              <option value="3">分类3</option>
            </select>
          </div>
          <div class="Classification">
            <div class="ClassificationTitle">二级分类</div>
            <select class="ClassificationSelect">
              <option value="" disabled selected hidden>请选择</option>
              <option value="1">分类1</option>
              <option value="2">分类2</option>
              <option value="3">分类3</option>
            </select>
          </div>
        </div>
        <div class="selectContent">
          <div class="search">
            <input class="ipt" v-model="value" placeholder="请输入标题、作者姓名或壁报编号" />
            <div class="searchBtn">搜索</div>
          </div>
          <div class="contentList"></div>
          <div class="current"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Lazyload } from "vant"
import Banner from "components/Banner"
import { getAdvertising } from "@/api/user"
// const { mapActions } = createNamespacedHelpers('test') // 可使用这种方式直接获得test模板
Vue.use(Lazyload)
const baseUrl = 'https://mob.hexntc.com/bb/MeetingAdd'
export default {
  name: 'home',
  components: {
    Swipe,
    SwipeItem,
    Banner,
  },
  data () {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      advertImages: [],
      bannerImages: [],
      showAdvert: false
    }
  },
  computed: {},
  created () {
    getAdvertising({
      'page': 1, // 页码
      'pageSize': 20, // 每页记录数
      'type': '广告', // 类型：广告，banner
      'memo': '', // 备注
      'status': '已开启', // 已开启（前台写死），已关闭
      'meeting_id': 1, // 会议id
      'uid': 1
    }).then(res => {
      const { list } = res.data
      this.advertImages = list
      if (this.advertImages.length > 0) {
        this.showAdvert = true,
        this.advertImages.forEach(v => {
          setTimeout(() => {
            this.showAdvert = false
          }, v.stay_duration*1000)
        })
      }
      console.log("获取广告信息成功", baseUrl + '/' + res.data.list[0].pic_name)
    }).catch(err => {
      console.log("获取广告信息失败", err)
    }
    )

    getAdvertising({
      'page': 1, // 页码
      'pageSize': 20, // 每页记录数
      'type': 'banner', // 类型：广告，banner
      'memo': '', // 备注
      'status': '已开启', // 已开启（前台写死），已关闭
      'meeting_id': 1, // 会议id
      'uid': 1
    }).then(res => {
      const { list } = res.data
      this.bannerImages = list
      console.log("获取banner信息成功", baseUrl + '/' + res.data.list[0].pic_name)
    })
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
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handResize)
  }
}

</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  ::v-deep .van-swipe__indicator{
    width: 0;
  }
  .main {
    background-color: #fff;
    .advert{
      position: relative;
      width: 100%;
      height: 100%;
      .swipe{
      // display: flex;
        width: 100%;
        height: 100%;
        .advertisingImg {
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .advertSwitch{
        position: absolute;
        top: 7px;
        right: 7px;
        width: 43px;
        height: 14px;
        padding: 5px;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        color: #fff;
        background-color: #223149;
        border-radius: 3px;
        z-index: 9;
      }
    }
    .content{
      width: 100%;
      height: 80%;
      .selectType{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 15%;
        border: 1px solid #797979;
        .Classification{
          display: flex;
          align-items: center;
          height: 40%;
          .ClassificationTitle{
            width: 15%;
            text-align: center;
          }
          .ClassificationSelect{
            width: 60%;
            height: 80%;
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>
