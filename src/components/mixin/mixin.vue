<template>

</template>

<script>
  export default {
    name: "mixin",
    created(){
      // console.log("mixin");
    },
    watch:{
      '$route':function(curVal,oldVal){
        // console.log(curVal,oldVal);
      }
    }
  }
</script>

<style scoped>

</style>
