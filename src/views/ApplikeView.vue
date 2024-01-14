<template>
  <div
    class="container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      class="page"
      :style="{ transform: `translateX(${translateX}px)`, transition: transitionStyle }"
    >
      <div
        class="wrapper"
        :class="`wrapper wrapper-${index}`"
        v-for="(tab, index) in activeTabs"
        :key="tab.id"
      >
        <component :is="tab.component"></component>
      </div>
    </div>
    <bottom-tabs class="bottom_navigator" :tabs="tabs" :active-tab="currentPath"></bottom-tabs>
  </div>
</template>

<script>
import BottomTabs from "@/components/BottomTabs.vue";
export default {
  components: { BottomTabs },
  data() {
    return {
      pool: [],
      tabs: [
        {
          id: 1,
          name: "red",
          path: "/red",
          component: () => import("@/views/RedScreen.vue"),
        },
        {
          id: 2,
          name: "green",
          path: "/green",
          component: () => import("@/views/GreenScreen.vue"),
        },
        {
          id: 3,
          name: "blue",
          path: "/blue",
          component: () => import("@/views/BlueScreen.vue"),
        },
        {
          id: 4,
          name: "yellow",
          path: "/yellow",
          component: () => import("@/views/YellowScreen.vue"),
        },
      ],
      startX: 0,
      startY: 0,
      translateX: 0,
      transitionStyle: {},
    };
  },
  computed: {
    currentPath() {
      return this.$route.params.sub;
    },
    currentIndex() {
      // Todo: to store
      return this.tabs.findIndex((item) => item.path.indexOf(this.currentPath) >= 0);
    },
    activeTabs() {
      const tabsArray = [];
      tabsArray.push(this.tabs[this.currentIndex]);
      if (this.currentIndex > 0) tabsArray.unshift(this.tabs[this.currentIndex - 1]);
      else tabsArray.unshift({});
      if (this.currentIndex < this.tabs.length - 1) tabsArray.push(this.tabs[this.currentIndex + 1]);
      return tabsArray;
    },
  },
  methods: {
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.transitionStyle = "none";
    },
    handleTouchMove(e) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      // 수평 스와이프 감지
      if (Math.abs(touchX - this.startX) > 10) {
        e.preventDefault(); // 수직 스크롤 방지
      }
      if (Math.abs(touchY - this.startY) > 10) {
        return
      }
      if (Math.abs(touchX - this.startX) > 10) {
        if (touchX - this.startX > 0 && this.currentIndex === 0) return
        if (touchX - this.startX < 0 && this.currentIndex === this.tabs.length - 1) return
        this.translateX = touchX - this.startX;
      }
    },
    handleTouchEnd() {
      this.transitionStyle = "transform 0.3s ease-in-out";

      let targetIndex = this.currentIndex;
      if (this.translateX < -160) {
        // 오른쪽으로 스와이프
        targetIndex = this.currentIndex + 1;
        this.translateX = -window.innerWidth;
      } else if (this.translateX > 160) {
        // 왼쪽으로 스와이프
        targetIndex = this.currentIndex - 1;
        this.translateX = window.innerWidth;
      } else {
        this.translateX = 0;
      }

      // 트랜지션 완료 후 라우트 변경
      if (targetIndex !== this.currentIndex) {
        setTimeout(() => {
          this.transitionStyle = "none";
          this.goToTab(targetIndex);
          this.translateX = 0; // 위치 초기화
        }, 500); // 0.3초 후 실행
      }
    },
    goToTab(index) {
      if (index < 0 || index >= this.tabs.length) return;
      const routePath = `/app-like${this.tabs[index].path}`;
      this.$router.push(routePath);
    },
    updateCurrentIndex() {
      this.currentIndex = this.tabs.findIndex((item) => item.path.indexOf(this.currentPath) >= 0);
    },
  },
  watch: {
    $route() {
      this.updateCurrentIndex();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  overflow: visible;
}

.page {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 300vw;
}

.wrapper {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  will-change: transform;
}

.wrapper {
  &.wrapper-0 {
    left: -100vw;
  }
  &.wrapper-1 {
    left: 0;
  }
  &.wrapper-2 {
    right: 100vw;
  }
}

.bottom_navigator {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
}
.tabs {
  display: flex;
  background-color: white;
  .tab {
    flex: 1;
    padding: 16px 0;
    text-align: center;
    a {
      text-decoration: none;
    }
    &.active {
      a {
        font-weight: bold;
        color: red;
      }
    }
  }
}
</style>
