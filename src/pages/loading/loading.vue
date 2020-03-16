<template>
  <div class="loading"></div>
</template>

<script>
export default {
  name: "Loading" // 定义的组件名称 使用时写法：loading
};
</script>

<style scoped>
.loading {
    position: fixed;
    left: 0;
    right:0;
    top: 0;
    bottom:0;
    background:url("~@/assets/img/loading.gif") center 20% no-repeat rgb(17, 17, 19);
    background-size:30px 30px;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    overflow: hidden;
  }

</style>
<style>
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
