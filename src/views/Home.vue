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
        <div class="advertSwitch" @click="showAdvert = false">{{ $t("close") }}</div>
      </div>

      <div class="content">
        <Banner style="width: 100%;height: 20%;" />
        <div class="searchContent">
          <div class="selectType">
            <div class="Classification">
              <div class="ClassificationTitle">{{ $t("type1") }}</div>
              <Select class="ClassificationSelect" :popper-append-to-body="false" popper-class="dataClass" v-model="value" @change="handSelectChange1" :placeholder="$t('pleaseSelect')">
                <Option
                  style="height: 0.3rem; line-height: 0.3rem; font-size: 12px;padding: 0 0.13rem;"
                  v-for="item in categoryList1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.pid">
                </Option>
              </Select>
            </div>
            <div class="Classification">
              <div class="ClassificationTitle">{{ $t("type2") }}</div>
              <!-- <select class="ClassificationSelect">
                <option value="" disabled selected hidden>请选择</option>
                <option value="1" v-for="item in categoryList1" :key="item.id">{{ item.name }}</option>
              </select> -->
              <Select class="ClassificationSelect" :popper-append-to-body="false" popper-class="dataClass" v-model="value2" @change="handSelectChange2" :placeholder="$t('pleaseSelect')">
                <Option
                  style="height: 0.3rem; line-height: 0.3rem;font-size: 12px; padding: 0 0.13rem;"
                  v-for="item in categoryList2"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </div>
          </div>
          <div class="selectContent">
            <div class="search">
              <input class="ipt" v-model="searchTxt" :placeholder="$t('placeholder')" />
              <div class="searchBtn" @click="searchClick">{{ $t("search") }}</div>
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
            <div class="contentList" v-if="searchList">
              <div class="contentListItems" v-for="item in searchList" :key="item.id" @click="goDetail(item)">
                <div class="serialNumber public">
                  <div>{{ $t('no') }}：</div>
                  <div>{{ item.sort_number }}</div>
                </div>
                <div class="author public">
                  <div>{{ $t('author') }}：</div>
                  <div>{{ item.author }}</div>
                </div>
                <div class="topic public">
                  <div>{{ $t('title') }}：</div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, Lazyload, Pagination, Icon  } from "vant"
import { Select, Option } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Banner from "components/Banner"
import { getAdvertising, getPosterList, getCategoryList } from "@/api/user"
// const { mapActions } = createNamespacedHelpers('test') // 可使用这种方式直接获得test模板
Vue.use(Lazyload)
const baseUrl = 'https://eposter.tri-think.cn/uploadFile'
export default {
  name: 'home',
  components: {
    Swipe,
    SwipeItem,
    Icon,
    Banner,
    Pagination,
    Select,
    Option
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
      lockDuration: '0',
      categoryList1: [],
      categoryList2: [],
      value: '',
      value2: '',
      categoryId1: '',
      categoryId2: '',
      meeting_id: 0,
    }
  },
  computed: {},
  created () {
    const meeting_id = this.$route.query.meeting_id;
    if (meeting_id) {
      this.meeting_id = Number(meeting_id);
    }
    getAdvertising({
      'page': 1, // 页码
      'pageSize': 20, // 每页记录数
      'type': '广告', // 类型：广告，banner
      'memo': '', // 备注
      'status': '已开启', // 已开启（前台写死），已关闭
      'meeting_id': this.meeting_id, // 会议id
      'uid': 1
    }).then(res => {
      const { list } = res.data
      this.advertImages = list
      this.advertImages.forEach(item => {
        item.pic_name = baseUrl + '/' + item.pic_name
      })
      if (this.advertImages.length > 0) {
        this.showAdvert = true,
          setTimeout(() => {
            this.showAdvert = false
          }, this.advertImages[0].stay_duration * 1000)
      }
      console.log("获取广告信息成功", baseUrl + '/' + res.data.list[0].pic_name)
    }).catch(err => {
      console.log("获取广告信息失败", err)
    })
    getCategoryList({
      "name": "", //类别名称
      "level": 1, //默认0全部，1一级类别，2二级类别
      "pid": 0, //父级类别id,默认0全部，
      "meeting_id": this.meeting_id, //会议id
      "status": "已启用", //类别开关：已启用（前端写死），已关闭
      "page": 1, //页码
      "pageSize": 10, //每页记录数
      "uid": 1 //记录id
    }).then(res => {
      console.log("获取类别信息成功", res.data.list);
      const {list} = res.data
      this.categoryList1 = list
    })
    getPosterList({
      "page": 1, //页码
      "pageSize": 20, //每页记录数
      "category_id": !this.categoryId1 ? 0 : (!this.categoryId2 ? this.categoryId1 : this.categoryId2),//类别id,0全部
      "status": "已开启", //已开启（前台写死），已关闭
      "meeting_id": this.meeting_id, //会议id，必填
      "content": this.searchTxt, //检索框内容
      "uid": 1
    }).then(res => {
      console.log("搜索数据", res);
      const {list, pagesum, lock_duration} = res.data
      this.searchList = list
      this.totalItems = pagesum
      this.lockDuration = lock_duration
      this.monitorInactivity()
    })
  },
  mounted () {
    window.addEventListener('resize', this.handResize)
    this.handResize()
  },
  methods: {
    resetTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.monitorInactivity();  // 重新开始监控
  },
    monitorInactivity () {
      if(this.lockDuration){
        console.log("wucccccccccccccccccc", this.lockDuration);
        const resetTimer = () => {
        if (this.inactivityTimeout) {
          clearTimeout(this.inactivityTimeout);
        }
        this.inactivityTimeout = setTimeout(() => {
          this.showAdvert = true;
          // this.lockDuration
        }, this.lockDuration*1000);
      };
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("touchstart", resetTimer);
      window.addEventListener("touchmove", resetTimer);
      resetTimer();
      }
    },
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
    handSelectChange1 (val) {
      console.log("handSelectChange1", val);
      getCategoryList({
        "name": "", //类别名称
        "level": 2, //默认0全部，1一级类别，2二级类别
        "pid": val, //父级类别id,默认0全部，
        "meeting_id": this.meeting_id, //会议id
        "status": "已启用", //类别开关：已启用（前端写死），已关闭
        "page": 1, //页码
        "pageSize": 10, //每页记录数
        "uid": 1 //记录id
      }).then(res => {
      console.log("获取类别信息成功", res.data.list);
      const {list} = res.data
      this.categoryList2 = list
    })
    },
    handSelectChange2 (val) {
      console.log("handSelectChange2", val);
      this.categoryId2 = val
    },
    searchClick () {
      console.log("this.value", this.value)
      console.log("searchTxt", this.searchTxt);
      // if(!this.searchTxt.trim()){
      //   return Toast("请输入搜索内容");
      // }
      getPosterList({
      "page": 1, //页码
      "pageSize": 20, //每页记录数
      "category_id": !this.categoryId1 ? 0 : (!this.categoryId2 ? this.categoryId1 : this.categoryId2),//类别id,0全部
      "status": "已开启", //已开启（前台写死），已关闭
      "meeting_id": this.meeting_id, //会议id，必填
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
    goDetail (item) {
      console.log("item", item);
      this.$router.push({name:'details',params:{data:item}})
    }
  },
  watch: {
    width (val) {
      this.width = val
    },
    height (val) {
      this.height = val
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handResize)
    window.removeEventListener("mousemove", this.resetTimer);
    window.removeEventListener("keydown", this.resetTimer);
    window.removeEventListener("touchstart", this.resetTimer);
    window.removeEventListener("touchmove", this.resetTimer);

    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
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
  // height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  ::v-deep .van-swipe__indicator{
    width: 0;
  }
  ::v-deep .van-pagination__item--active{
    background-color: #fff;
    color: #1989fa;
    height: 0.3rem;
    font-size: 0.26rem;
  }
  ::v-deep .van-pagination__item::after {
    border-width: 0;
  }
  ::v-deep .van-swipe__track{
      width: 100% !important;
  }
  ::v-deep .van-pagination{
    background-color: #fff;
    height: 0.3rem;
  }
  ::v-deep .van-pagination__item--disabled, .van-pagination__item--disabled:active{
    background-color: #fff;
    height: 0.3rem;
    font-size: 0.26rem;
  }
  ::v-deep .el-input{
    height: 100%;
    font-size: 0.18rem;
  }
  ::v-deep .el-input__inner{
    height: 100%;
    border: 1px solid #797979;
  }
  ::v-deep .el-input__suffix{
    display: flex;
    align-items: center;
  }
  ::v-deep .el-select .el-input .el-select__caret{
    width: 0.4rem;
    font-size: 0.2rem;
  }
  ::v-deep .el-select-dropdown.el-popper .el-select-dropdown__empty{
    padding: 0.14rem 0;
    font-size: 0.16rem;
  }
  ::v-deep .dataClass{
    // height: 20px !important;
    padding: 0;
    font-size: 6px;
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
          width: 100%;
          height: 99%;
          height: 15%;
          border: 1px solid #797979;
          .Classification{
            display: flex;
            align-items: center;
            height: 40%;
            .ClassificationTitle{
              width: 18%;
              text-align: center;
              font-size: 0.2rem;
            }
            .ClassificationSelect{
              width: 60%;
              height: 80%;
              font-size: 0.17rem;
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
            height: 4%;
            .ipt{
              width: 80%;
              height: 100%;
            }
            .searchBtn{
              display: flex;
              justify-content: center;
              align-items: center;
              width: 19%;
              height: 123%;
              margin-left: 0.1%;
              border: 1px solid #797979;
              border-radius: 7%;
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
