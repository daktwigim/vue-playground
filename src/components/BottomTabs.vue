<template>
  <div class="bottom_navigator">
    <ul class="tabs">
      <li
        :class="{ tab: true, active: tab.path.indexOf(activeTab) >= 0 }"
        v-for="tab in tabs"
        :key="tab.id"
      >
        <router-link :to="`${baseUrl}${tab.path}`">{{ tab.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: { tabs: {}, activeTab: {}, baseUrl: { default: "/app-like" } },
};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background-color: white;
  align-items: stretch;
  height: 56px;
  .tab {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 16px 0;
    a {
      padding: 4px 0;
      min-width: 60px;
      text-decoration: none;
      border-radius: 16px;
      color: #444;
    }
    &.active {
      a {
        font-weight: bold;
        color: white;
        background-color: blue;
      }
    }
  }
}
</style>
