<template>
    <section @click="close" v-show="visible" class="full-screen ">
        <el-button class="area" @click="changePage(-1)" v-if="imgs.length>1" :disabled="imgs.length>1&&index==0">上一张</el-button>
        <figure class="photo" :style='sty'>
          <img :src="imgs[index]" :class="curCls"/>
        </figure>
        <el-button class="area" @click="changePage(1)" v-if="imgs.length>1" :disabled="imgs.length>1&&index==imgs.length-1">下一张</el-button>
    </section>
</template>

<script>
export default {
  name: "photo-watcher",
  props: ["visible", "imgs", "index"],


  data(){
    return{
      curCls:"line",
    }
  },
  watch:{
    imgs(curVal){

      let img=document.createElement("img");
      let self=this;
      img.onload=function(){
        if(this.height>this.width){
          self.curCls="line";
        }else{
          self.curCls="hon";
        }
      }
      img.src=curVal[this.index];
    },
  },
  computed: {

    sty() {
      const res = {
        "background-size": "contain",
        "background-repeat": "no-repeat",
        "background-position": "center"
      };
      return res;
    }
  },
  methods: {
    imgOnload(e){
      
    },
    close() {
      this.$emit("update:visible", false);
    },
    changePage(offset) {
      let index = this.index;
      if (this.index + offset < 0) {
        index = 0;
      } else if (this.index + offset >= this.imgs.length) {
        index = this.imgs.length - 1;
      } else {
        index = this.index + offset;
      }
      this.$emit("update:index", index);
    }
  }
};
</script>

<style>
  .hon{
    width:1000px
  }
  .line{
    width:500px
  }
.full-screen {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
  width: 100vw;
  height: 100vh;
  background-color: rgba(148, 148, 148, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo {
  min-width: 50%;
  display: flex;
  width: fit-content;
  height: 100%;
  align-items: center;
}
</style>
