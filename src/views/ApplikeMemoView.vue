<template>
  <div
    class="container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      class="header"
      :style="{ transform: `translateY(${translateY}px)`, transition: transitionStyle }"
    >
      Header
    </div>
    <div
      class="page"
      :style="{ transform: `translateX(${translateX}px)`, transition: transitionStyle }"
    >
      <template v-for="tab in activeTabs">
        <div
          :key="tab.id"
          :class="`wrapper ${tab.status ? 'wrapper-' + tab.status : ''}`"
          :style="{ transform: `translateY(${32+translateY}px)`, transition: transitionStyle }"
        >
          <keep-alive include="RedScreen">
            <component
              v-if="tab.isActive"
              :is="tab.component"
            ></component>
          </keep-alive>
        </div>
      </template>
    </div>
    <bottom-tabs
      class="bottom_navigator"
      :tabs="tabs"
      :active-tab="currentPath"
      base-url="/app-like-memo"
    ></bottom-tabs>
  </div>
</template>

<script>
import BottomTabs from "@/components/BottomTabs.vue";
export default {
  name: "AppLikeMemo",
  components: { BottomTabs },
  data() {
    return {
      pool: {},
      tabs: [
        {
          id: 1,
          name: "red",
          path: "/red",
          isMemo: true,
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
      touchDirection: null,
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
    pooledTabs() {
      return this.tabs.map((tab) => ({ ...tab, components: this.getComponent(tab) }));
    },
    activeTabs() {
      return this.pooledTabs.map((tab, index) => {
        let status;
        switch (index - this.currentIndex) {
          case 0:
            status = "current";
            break;
          case 1:
            status = "append";
            break;
          case -1:
            status = "prepend";
            break;
          default:
            status = "none";
            break;
        }
        return { ...tab, status, isActive: Math.abs(index - this.currentIndex) <= 1 };
      });
    },
    ratio() {
      if (this.currentIndex === 0) {
        return (this.translateX / window.innerWidth) * 100;
      } else if (this.currentIndex === 1) {
        return -100 + (this.translateX / window.innerWidth) * 100;
      } else {
        return -100;
      }
    },
    translateY() {
      if (this.currentIndex === 0) {
        return (this.translateX / window.innerWidth) * 32;
      } else if (this.currentIndex === 1) {
        return -32 + (this.translateX / window.innerWidth) * 32;
      } else {
        return -32;
      }
    },
  },
  methods: {
    getComponent(tab) {
      // 이미 풀에 컴포넌트가 있는지 확인
      if (this.pool[tab.name]) {
        return this.pool[tab.name];
      }

      // 컴포넌트 풀에 추가
      if (tab.isMemo) {
        const componentInstance = tab.component;
        this.pool[tab.name] = componentInstance;
        return componentInstance;
      }

      // 풀링하지 않는 컴포넌트의 경우, 바로 반환
      return tab.component;
    },
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.transitionStyle = "none";
    },
    handleTouchMove(e) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      if (!this.touchDirection && Math.abs(touchX - this.startX) > 10) {
        this.touchDirection = "horizontal";
      }
      // 수평 스와이프 감지
      if (!this.touchDirection && Math.abs(touchY - this.startY) > 10) {
        this.touchDirection = "vertical";
      }

      if (this.touchDirection === "horizontal") {
        e.preventDefault(); // 수직 스크롤 방지
        if (touchX - this.startX > 0 && this.currentIndex === 0) return;
        if (touchX - this.startX < 0 && this.currentIndex === this.tabs.length - 1) return;
        this.translateX = touchX - this.startX;
      }

      if (this.touchDirection === "vertical") {
        return;
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

      this.touchDirection = null;
    },
    goToTab(index) {
      if (index < 0 || index >= this.tabs.length) return;
      const routePath = `/app-like-memo${this.tabs[index].path}`;
      this.$router.push(routePath);
    },
    // updateCurrentIndex() {
    //   this.currentIndex = this.tabs.findIndex((item) => item.path.indexOf(this.currentPath) >= 0);
    // },
  },
  // watch: {
  //   $route() {
  //     this.updateCurrentIndex();
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.container {
  overflow: visible;
}

.header {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  height: 32px;
  width: 100vw;
  background-color: white;
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
  // padding-top: 32px;
  // padding-bottom: 56px;

  &.wrapper-prepend {
    left: -100vw;
  }
  &.wrapper-current {
    left: 0;
  }
  &.wrapper-append {
    right: 100vw;
  }
  &.wrapper-none {
    display: none;
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
