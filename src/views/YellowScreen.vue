<template>
  <div
    class="container"
    :style="`background: ${color}`"
  ></div>
</template>

<script>
export default {
  name: "YellowScreen",
  data() {
    return {
      color: "",
    };
  },
  created() {
    setTimeout(() => {
      this.color = "orange";
    }, 3000);
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 150vh;
  background: linear-gradient(yellow, black);
  // background-color: yellow;
}
</style>
