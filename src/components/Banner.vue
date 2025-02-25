<template>
  <div class="banner">
      <Swipe type="card" class="swipe">
        <SwipeItem class="bannerImg" v-for="(item, index) in bannerImages" :key="index">
          <a :href="item.jump_url" style="text-decoration: none; outline: none;">
              <img v-lazy="item.pic_name" />
          </a>
        </SwipeItem>
      </Swipe>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Lazyload } from "vant"
import { getAdvertising } from "@/api/user"
Vue.use(Lazyload)
const baseUrl = 'https://mob.hexntc.com/bpost/uploadFile'
export default {
  name: 'home',
  components: {
    Swipe,
    SwipeItem,
  },
  data () {
    return {
      bannerImages: []
    }
  },
  computed: {},
  created () {
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
  mounted () {},
  methods: {},
  beforeDestroy () {}
}

</script>
<style lang="scss" scoped>
.banner{
  width: 100%;
  height: 20%;
  .swipe{
    width: 100%;
    height: 100%;
    .bannerImg {
      img {
        width: 100%;
        height: 100%;
        }
      }
    }
}
</style>
