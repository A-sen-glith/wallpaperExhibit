<template>
  <div class="container">
    <h1>AI艺术图像生成</h1>
    <div class="drawType" v-show="makeUp === ''">
      <div
        :class="{ drawTypeCheck: typeOtp === 'img' }"
        @click="typeOtpFun('img')"
      >
        传图作画
      </div>
      <div
        :class="{ drawTypeCheck: typeOtp === 'txt' }"
        @click="typeOtpFun('txt')"
      >
        文字作画
      </div>
    </div>
    <div
      class="addPicDiv"
      @click="clickFile"
      v-show="makeUp === '' && typeOtp === 'img'"
    >
      <div v-show="imgCutData === ''" class="add"></div>
      <div style="position: relative" v-show="imgCutData === ''">
        点击添加照片
      </div>
      <img
        v-show="imgCutData !== ''"
        style="height: 100%; width: 100%"
        :src="imgCutData"
      />
    </div>
    <div class="addPicDiv" v-show="makeUp === '已生成' && ifSend === '已发送'">
      <img
        v-show="newImg !== ''"
        style="height: 100%"
        :src="`${imgUrl}/${newImg}`"
      />
    </div>
    <div class="addTxtDiv" v-show="makeUp === '' && typeOtp === 'txt'">
      <van-field
        v-model="makeTxt"
        style="height: 100%; width: 100%"
        autosize
        type="textarea"
        placeholder="请输入您需要AI绘制的场景、人物、风景、物品等等......"
      />
    </div>
    <div
      class="uploadBut"
      v-show="
        (makeUp === '' && typeOtp === 'img' && fileUrl === '') ||
        (makeUp === '' && typeOtp === 'txt' && makeTxt === '')
      "
    >
      确定上传
    </div>
    <div
      class="uploadBut bgDA2428"
      @click="playerstatusFun"
      v-show="
        (makeUp === '' && typeOtp === 'img' && fileUrl !== '') ||
        (makeUp === '' && typeOtp === 'txt' && makeTxt !== '')
      "
    >
      确定上传
    </div>
    <div class="describeTxt" v-show="makeUp === '' && typeOtp === 'img'">
      — 添加图片，作为AI“白泽”的作画对象 —
    </div>
    <div class="describeTxt" v-show="makeUp === '' && typeOtp === 'txt'">
      — 编辑文字，告诉“白泽”您想画什么 —
    </div>
    <div v-show="makeUp !== '' && ifSend !== '已发送'" class="yunup"></div>
    <div v-show="makeUp !== '' && ifSend !== '已发送'" class="font28">
      图片已上传至演示屏
    </div>
    <div v-show="makeUp !== '' && ifSend !== '已发送'" class="font18">
      接下来在演示屏上选择作画风格即可
    </div>
    <!--<div v-show="makeUp !== '' &&ifSend!=='已发送'" @click="refreshFun" class="refresh">刷新</div> -->
    <div
      class="describeTxt"
      style="margin-top: 20px; margin-bottom: 10px"
      v-show="makeUp === '已生成' && ifSend === '已发送'"
    >
      — 长按上方图片保存至相册 —
    </div>
    <!--@click="saveImage" -->
    <div
      v-show="makeUp === '已生成' && ifSend === '已发送' && typeOtp === 'img'"
      style="
        color: #70707c;
        font-weight: 600;
        font-size: 22px;
        text-align: center;
        margin-bottom: 20px;
      "
    >
      原图
    </div>
    <div
      v-show="makeUp === '已生成' && ifSend === '已发送' && typeOtp === 'txt'"
      style="
        color: #70707c;
        font-weight: 600;
        font-size: 22px;
        text-align: center;
        margin-bottom: 20px;
      "
    >
      文字描述
    </div>
    <div
      class="addTxtDiv"
      style="height: 146px; width: 260px"
      v-show="makeUp === '已生成' && ifSend === '已发送' && typeOtp === 'txt'"
    >
      <van-field
        v-model="makeTxt"
        style="height: 100%; width: 100%"
        autosize
        type="textarea"
        placeholder="请输入您需要AI绘制的场景、人物、风景、物品等等......"
      />
    </div>
    <div
      class="addPicDiv"
      style="height: 146px; width: 260px"
      v-show="makeUp === '已生成' && ifSend === '已发送' && typeOtp === 'img'"
    >
      <img
        v-show="oldImg !== ''"
        style="height: 100%; width: 100%"
        :src="`${imgUrl}/${oldImg}`"
      />
    </div>
    <input
      type="file"
      ref="imgDiv"
      style="display: none"
      name="file"
      accept="image/*"
      @change="uploadImg($event)"
    />
    <!--
      <input ref="imgDiv" style="display: none;" @change="getFile($event)" type="file" accept="image/*">
     -->
    <!--
      <van-dialog v-model="showCut" @confirm="imgCut"  show-cancel-button>
      <div class="cropper">
      <div style="margin: 5px 0;display: flex;justify-content: space-evenly;">
          <van-button size="mini" type="primary" plain @click="rotateLeft"
            >↺ 左旋转</van-button
          >
          <van-button size="mini" type="primary" plain @click="rotateRight"
            >↻ 右旋转</van-button
          >
        </div>
        <vueCropper
          style="width: 100%; height: 300px;"
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :fixedBox="option.fixedBox"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :height="option.height"
          :infoTrue="option.infoTrue"
          :maxImgSize="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @imgLoad="imgLoad"
        ></vueCropper>
      </div>
    </van-dialog>
     -->
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
      showCut: false,
      option: {
        img: "", //裁剪图片的地址
        outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
        outputType: "jpeg", //裁剪生成图片的格式（jpeg || png || webp）
        info: true, //图片大小信息
        canScale: true, //图片是否允许滚轮缩放
        autoCrop: true, //是否默认生成截图框
        // autoCropWidth: 80%, //默认生成截图框宽度
        // autoCropHeight: 240, //默认生成截图框高度
        fixed: true, //是否开启截图框宽高固定比例
        fixedNumber: [16, 9], //截图框的宽高比例
        full: false, //false按原比例裁切图片，不失真
        fixedBox: true, //固定截图框大小，不允许改变
        canMove: true, //上传图片是否可以移动
        canMoveBox: false, //截图框能否拖动
        original: false, //上传图片按照原始比例渲染
        centerBox: false, //截图框是否被限制在图片里面
        height: true, //是否按照设备的dpr 输出等比例图片
        infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000, //限制图片最大宽度和高度
        enlarge: 1, //图片根据截图框输出比例倍数
        mode: "contain", //图片默认渲染方式  contain , cover, 100px, 100% auto
      },
      imgCutData: "",
      typeOtp: "img",
      fileUrl: "",
      makeTxt: "",
      filename: "",
      makeUp: "",
      openId: "",
      imgUrl: "https://huanqiu-ai.com/aibz/uploadFile",
      equipNo: 1,
      newImg: "",
      oldImg: "",
      picresultTime: null,
      ifSend: "",
    };
  },
  components: {
    [Button.name]: Button,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    FooterTabbar,
    "van-cell-group": CellGroup,
    "van-cell": Cell,
    "van-list": List,
    [Dialog.Component.name]: Dialog.Component,
    "van-field": Field,
    "van-overlay": Overlay,
    "van-radio": Radio,
    "van-form": Form,
    Toast,
  },
  computed: {},
  methods: {
    uploadImg() {
      console.log(event.target.files);
      console.log(event.target.files[0]);
      const files = event.target.files;
      this.filename = files[0].name;
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (img) => {
        clipic.getImage({
          // width: 500,
          // height: 400,
          ratio: 16 / 9,
          src: img.target.result,
          encode: "blob",
          onDone: (base64) => {
            // this.base64 = base64
            this.imgCutData = window.URL.createObjectURL(base64);
            console.log(base64);
            this.getFile1(base64);
          },
        });
      };
      event.value = "";
    },
    refreshFun() {
      this.picresultFun();
      Toast.success("刷新成功");
    },
    downloadIamge(imgsrc, name) {
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      a.download = name || "photo"; // 设置图片名称
      a.style.display = "none";
      a.href = imgsrc;
      a.dispatchEvent(event); // 触发a的单击事件
    },
    picresultTimeFun() {
      this.picresultTime = setInterval(() => {
        this.picresultFun();
      }, 3000);
    },
    saveImage() {
      this.downloadIamge(`${this.imgUrl}/${this.newImg}`, this.newImg);
    },
    typeOtpFun(data) {
      if (this.makeUp !== "") return;
      this.typeOtp = data;
    },
    getFile(e) {
      let file = e.target.files[0];
      console.log(file, e);
      this.filename = file.name;
      this.showCut = true;
      if (file) {
        let data;
        data = window.URL.createObjectURL(new Blob([file]));
        this.option.img = data;
        this.dialogVisible = true;
        //转化为blob
        // let reader = new FileReader();
        // reader.onload = (e) => {
        //   console.log('e',e)
        //   let data;
        //   if (typeof e.target.result === "object") {
        //     data = window.URL.createObjectURL(new Blob([this.$refs.inputFile.files[0]]));
        //   } else {
        //     data = e.target.result;
        //   }

        // };
        //转化为base64
        // reader.readAsDataURL(file);
        e.target.value = ""; // input上传图片，可以连续上传同一张图片
      }
    },
    // 点击触发input的点击事件
    clickFile() {
      this.$refs.imgDiv.click();
    },
    imgLoad(msg) {
      console.log("工具初始化函数=====" + msg);
    },
    //向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    //向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    imgCut() {
      this.$refs.cropper.getCropBlob(async (data) => {
        this.imgCutData = window.URL.createObjectURL(data);
        console.log(data);
        this.getFile1(data);
        //...处理图片
      });
    },
    getFile1(data) {
      const file = data;
      const sliceBuffer = [];
      let sliceSize = file.size;
      while (sliceSize > 1024 * 1024) {
        const blobPart = file.slice(
          sliceBuffer.length * 1024 * 1024,
          (sliceBuffer.length + 1) * 1024 * 1024
        );
        sliceBuffer.push(blobPart);
        sliceSize -= 1024 * 1024;
      }

      if (sliceSize > 0) {
        sliceBuffer.push(
          file.slice(sliceBuffer.length * 1024 * 1024, file.size)
        );
      }

      const fileReader = new FileReader();
      fileReader.onload = (res) => {
        const result = fileReader.result;
        const fileHash =
          SparkMD5.hashBinary(result) +
          Math.floor(Math.random() * (100 - 1)) +
          1;

        this.checkFileChunkState(fileHash)
          .then((res) => {
            let { chunkList, state } = res;
            if (state === 1) {
              alert("已经上传完成");
              return;
            }

            chunkList = chunkList.map((e) => parseInt(e));

            const chunkRequests = [];
            sliceBuffer.forEach((buffer, i) => {
              if (!chunkList.includes(i)) {
                const blob = new File([buffer], `${i}`);
                chunkRequests.push(this.uploadFileChunk(fileHash, blob));
              }
            });
            return Promise.all(chunkRequests);
          })
          .then((res) => {
            return new Promise((resolve) => {
              res.forEach((e) => {
                e.json().then(({ chunkList }) => {
                  if (chunkList.length === sliceBuffer.length) {
                    this.megerChunkFile(fileHash, this.filename).then((res) => {
                      resolve(res);
                    });
                  }
                });
              });
            });
          })
          .then((res) => {
            res.fileHash = fileHash;
            res.name = this.filename;
            this.fileUrl = `${res.fileHash}/${res.name}`;
            console.log(this.filename);
            // this.$emit('updata', res);
          });
      };
      fileReader.onerror = function (err) {
        console.log("报错了", err.target.error);
      };
      fileReader.readAsBinaryString(file);
      // this.$refs.inputFile.value = "";
    },
    uploadFileChunk(hash, file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("hash", hash);
      return fetch(`${this.fileUrl}/aipic/uploadChunk`, {
        method: "POST",
        body: formData,
      });
    },

    checkFileChunkState(hash) {
      return new Promise((resolve) => {
        fetch(`${this.fileUrl}/aipic/checkChunk?hash=${hash}`)
          .then((r) => r.json())
          .then((response) => {
            resolve(response);
          });
      });
    },

    megerChunkFile(hash, fileName) {
      return new Promise((resolve) => {
        fetch(
          `${this.fileUrl}/aipic/megerChunk?hash=${hash}&fileName=${fileName}`
        )
          .then((r) => r.json())
          .then((r) => {
            resolve(r);
          });
      });
    },
    playerstatusFun() {
      playerstatusupd({
        openid: this.openId,
        status: "准备中",
        gameType: this.typeOtp === "img" ? "图片" : "文字",
        oldPic: this.typeOtp === "img" ? this.fileUrl : "",
        texts: this.typeOtp === "txt" ? this.makeTxt : "",
        picStyle: "",
        equipNo: this.equipNo,
      })
        .then((r) => {
          if (r.code === 0) {
            // this.makeUp = false;
            clearInterval(this.picresultTime);
            this.picresultFun();
            this.picresultTimeFun();
          } else {
            Dialog.alert({
              title: "提示",
              message: r.msg,
            }).then(() => {
              // this.makeUp = false;
            });
          }
        })
        .catch((r) => {
          let msg = r.toString();
          msg = msg.replace("Error:", "");
          Dialog.alert({
            title: "提示",
            message: msg,
          }).then(() => {
            // this.makeUp = false;
          });
        });
    },
    picresultFun() {
      picresult({
        openid: this.openId,
        equipNo: this.equipNo,
      })
        .then((r) => {
          if (r.data.newPic === "39.105.33.147:8621") {
            clearInterval(this.picresultTime);
            Dialog.alert({
              title: "提示",
              message: "图片生成失败，请点击重绘，重新传输图片",
            }).then(() => {
              location.reload();
            });
            return;
          }
          if (r.data.ifSend === "已发送") {
            // clearInterval(this.picresultTime)
          }
          if (r.code === 1) {
            this.oldImg = "";
            this.newImg = "";
            this.makeUp = "";
            this.opendId = "";
            this.ifSend = "";
            this.fileUrl = "";
            this.imgCutData = "";
          } else {
            if (this.newImg !== "" && r.data.newPic === "") return;
            this.oldImg = r.data.oldPic;
            this.newImg =
              r.data.ifSend === "已发送" ? r.data.newPic : this.newImg;
            this.makeUp = r.data.status;
            this.opendId = r.data.openid;
            this.ifSend = this.ifSend === "已发送" ? "已发送" : r.data.ifSend;
          }
        })
        .catch((r) => {
          let msg = r.toString();
          msg = msg.replace("Error:", "");
          Dialog.alert({
            title: "提示",
            message: msg,
          }).then(() => {
            // this.makeUp = false;
          });
        });
    },
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      console.log(r);
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },
    getOpenId() {
      let code = this.getUrlParam("code");
      wxoauth(code)
        .then((r) => {
          if (r.code === 0) {
            this.openId = r.data.openid;
          } else {
            Dialog.alert({
              title: "提示",
              message: r.msg,
            }).then(() => {
              // this.makeUp = false;
            });
          }
        })
        .catch((r) => {
          let msg = r.toString();
          msg = msg.replace("Error:", "");
          Dialog.alert({
            title: "提示",
            message: msg,
          }).then(() => {
            // this.makeUp = false;
          });
        });
    },
  },
  mounted() {
    let url = window.location.href;
    if (url.indexOf("code=") !== -1) {
      this.getOpenId();
    } else {
      return
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60b8f641ac40a3a8&redirect_uri=https://huanqiu-ai.com/aibz/mob/index.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      // window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7a226735edf5d688&redirect_uri=https://huanqiu-ai.com/aibz/mob2/index.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    }
  },
};
</script>
<style lang="scss" scoped>
.clipic-operation-bar {
  bottom: 20% !important;
}
h1 {
  font-size: 24px;
  text-align: center;
  margin-top: 62px;
  margin-bottom: 35px;
  color: #1b1b1d;
}
.container {
  height: auto;
  width: 100%;
}

.upmodule {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}
.addPicDiv {
  width: 250px;
  height: 140px;
  background: #f5f6f8;
  border: 1px solid #d1d2d4;
  border-radius: 16px;
  margin: 0 auto;
  display: flex;
  color: #70707c;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
  position: relative;
  div {
    font-size: 16px;
  }
  .add {
    height: 44px;
    width: 44px;
    background: #d2d3d7;
    border-radius: 50%;
    background-image: url("./add.png");
    background-repeat: no-repeat;
    background-size: 70% 70%;
    background-position-x: 7px;
    background-position-y: 6px;
    margin-bottom: -20px;
  }
}
.uploadBut {
  height: 60px;
  width: 250px;
  background: #d2d3d7;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  line-height: 60px;
  border-radius: 50px;
  margin: 30px auto;
}
.bgDA2428 {
  background: #da2428;
}

.cropper {
  height: 390px;
}

.drawType {
  width: 250px;
  height: 44px;
  margin: 20px auto;
  display: flex;
  border: 1px solid #d1d2d4;
  border-radius: 25px;
  div {
    width: 246px;
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 25px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
  }
  .drawTypeCheck {
    border: 1px solid #da2428;
    color: #da2428;
  }
}
.describeTxt {
  color: #70707c;
  font-size: 16px;
  text-align: center;
}

.addTxtDiv {
  width: 311px;
  height: 112px;
  margin: 0 auto;
  border: 1px solid #d1d2d4;
  border-radius: 15px;
  overflow: hidden;
  font-size: 16px;
}

.yunup {
  width: 100px;
  height: 100px;
  background: url("./yun.png");
  background-size: 100% 100%;
  margin: 0 auto;
}

.font28 {
  font-size: 28px;
  font-weight: 700;
  color: #1b1b1d;
  text-align: center;
}
.font18 {
  font-size: 16px;
  color: #70707c;
  text-align: center;
  margin-top: 20px;
}
.refresh {
  background: #da2428;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  width: 140px;
  height: 60px;
  border-radius: 50px;
  margin: 20px auto;
  text-align: center;
  line-height: 60px;
}
</style>
