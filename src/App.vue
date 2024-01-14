<template>
  <router-view></router-view>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        { id: 1, name: "Home", path: "/" },
        { id: 2, name: "About", path: "/about" },
        { id: 3, name: "Sample", path: "/sample" },
        { id: 4, name: "Settings", path: "/settings" },
      ],
    };
  },
};
</script>

<style lang="scss">
.bottom-tabs {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: red;

  .tab-item {
    flex: 1;
    text-align: center;
  }
}
</style>
