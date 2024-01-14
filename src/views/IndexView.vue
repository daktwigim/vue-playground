<template>
  <div>
    <!-- <div>{{ routes }}</div> -->
    <ul v-if="routes">
      <li v-for="(route) in routes" :key="route.path">
        <router-link :to="route.path">{{ route.path }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routes: this.$router.options.routes
    }
  },
  mounted() {
    console.dir(this.rotues)
  },
}
</script>

<style lang="scss" scoped>
ul {
  padding: 8px;
  li {
    padding: 0 4px;
  }
}
</style>