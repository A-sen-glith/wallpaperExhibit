<template>
  <div class="container">
    <div class="main" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="advert" v-if="showAdvert">
        <Swipe type="mask" class="swipe">
          <SwipeItem class="advertisingImg" v-for="(item, index) in advertImages" :key="index">
            <a :href="item.jump_url" style="text-decoration: none; outline: none;">
              <img v-lazy="item.pic_name" />
            </a>
          </SwipeItem>
        </Swipe>
        <div class="advertSwitch" @click="showAdvert = false">关闭</div>
      </div>

      <div class="content">
        <Banner />
        <div class="searchContent">
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
              <input class="ipt" v-model="searchTxt" placeholder="请输入标题、作者姓名或壁报编号" />
              <div class="searchBtn" @click="searchClick">搜索</div>
            </div>
            <div class="contentList" v-if="searchList">
              <div class="contentListItems" v-for="(item,index) in searchList" :key="index">
                <div class="serialNumber public">
                  <div>编号：</div>
                  <div>{{ item.sort_number }}</div>
                </div>
                <div class="author public">
                  <div>作者：</div>
                  <div>{{ item.author }}</div>
                </div>
                <div class="topic public">
                  <div>题目：</div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
            <div class="current" v-show="totalItems != 0">
              <Pagination v-model="currentPage" :total-items="totalItems" :items-per-page="itemsPerPage">
                <template #prev-text>
                  <Icon name="arrow-left" />
                </template>
                <template #next-text>
                  <Icon name="arrow" />
                </template>
                <template #page="{ text }">{{ text }}</template>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Lazyload, Pagination, Icon   } from "vant"
import Banner from "components/Banner"
import { getAdvertising, getPosterList } from "@/api/user"
// const { mapActions } = createNamespacedHelpers('test') // 可使用这种方式直接获得test模板
Vue.use(Lazyload)
const baseUrl = 'https://mob.hexntc.com/bb/MeetingAdd'
export default {
  name: 'home',
  components: {
    Swipe,
    SwipeItem,
    Icon,
    Banner,
    Pagination 
  },
  data () {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      advertImages: [],
      bannerImages: [],
      searchList:[],
      showAdvert: false,
      searchTxt:"",
      totalItems:"0",
      currentPage: 1,
      itemsPerPage: 20,
      inactivityTimeout: null,
      lockDuration:'0',
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
            // this.showAdvert = false
          }, v.stay_duration*1000)
        })
      }
      console.log("获取广告信息成功", baseUrl + '/' + res.data.list[0].pic_name)
    }).catch(err => {
      console.log("获取广告信息失败", err)
    })
    this.monitorInactivity()
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
    searchClick () {
      console.log("searchTxt", this.searchTxt);
      getPosterList({
      "page": 1, //页码
      "pageSize": 20, //每页记录数
      "category_id": 2, //类别id,0全部
      "status": "已开启", //已开启（前台写死），已关闭
      "meeting_id": 1, //会议id，必填
      "content": this.searchTxt, //检索框内容
      "uid": 1
    }).then(res => {
      console.log("搜索数据", res);
      const {list, pagesum, lock_duration} = res.data
      this.searchList = list
      this.totalItems = pagesum
      this.lockDuration = lock_duration
    })
    },
    monitorInactivity () {
      if(this.lockDuration != '0'){
        const resetTimer = () => {
        if (this.inactivityTimeout) {
          clearTimeout(this.inactivityTimeout);
        }
        this.inactivityTimeout = setTimeout(() => {
          this.showAdvert = true;
        }, this.lockDuration*1000);
      };
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("touchstart", resetTimer);
      window.addEventListener("touchmove", resetTimer);
      resetTimer();
      }
    },
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handResize)
    window.removeEventListener("mousemove", this.resetTimer);
    window.removeEventListener("keydown", this.resetTimer);
    window.removeEventListener("touchstart", this.resetTimer);
    window.removeEventListener("touchmove", this.resetTimer);

    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout); // Clear timeout on component destroy
    }
  }
}

</script>
<style lang="scss" scoped>
html{
    font-size:6px;
}
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
    position: relative;
    background-color: #fff;
    .advert{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      .swipe{
        width: 100%;
        height: 100%;
        z-index:8;
        .advertisingImg {
          img {
            width: 100%;
            height: 100%;
            z-index: 99;
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
      height: 100%;
      .searchContent{
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
              width: 18%;
              text-align: center;
              font-size: 0.3rem;
            }
            .ClassificationSelect{
              width: 60%;
              height: 80%;
              font-size: 0.3rem;
            }
          }
        }
        .selectContent{
          height: 78.5%;
          padding: 5%;
          border: 1px solid #797979;
          .search{
            display: flex;
            align-items: center;
            height: 7%;
            .ipt{
              width: 80%;
              height: 100%;
            }
            .searchBtn{
              display: flex;
              justify-content: center;
              align-items: center;
              width: 19%;
              height: 100%;
              margin-left: 0.1%;
              border: 1px solid #797979;
              border-radius: 10%;
            }
          }
          .contentList{
            max-height: 80%;
            overflow-y: auto;
            .contentListItems{
              margin-top: 2%;
              padding-top: 4%;
              border: 1px solid #797979;
              box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
              .public{
                display: flex;
                div {
                  margin-bottom: 1%;
                }
              }
            }
            .contentListItems .public div:first-child{
                width: 20%;
                text-align: right;
            }
            .contentListItems .public div:last-child{
                width: 70%;
            }
          }
          .current{
            margin-top: 5%;
            height: 10%;
            font-size: 1rem;
          }
        }
    }
    }
  }
}
</style>
