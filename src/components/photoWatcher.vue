<template>
    <section @click="close" v-show="visible" class="full-screen">
        <figure class="photo">
          <img :src="img" :class="curCls"/>
        </figure>
    </section>
</template>

<script>
export default {
  name: "photo-watcher",
  props: ["visible", "img"],
  data() {
    return {
      curCls: "line"
    };
  },
  watch: {
    imgs(curVal) {
      let img = document.createElement("img");
      let self = this;
      img.onload = function() {
        self.curCls=this.height>this.width?"line":"hon";
      };
      img.src = curval;
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style>
.hon {
  width: 1000px;
}
.line {
  width: 500px;
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
  justify-content: center;
  width: fit-content;
  height: 100%;
  align-items: center;
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
