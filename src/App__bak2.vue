<template>
  <div @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <transition :name="transitionName">
      <div class="page">
        <router-view></router-view>
      </div>
    </transition>
    <ul class="bottom-tabs">
      <li class="tab" v-for="route in routes" :key="route.id">
        <router-link class="tab" :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      transitionName: 'slide-left',
      routes: [
        { id: 1, name: "Home", path: "/" },
        { id: 2, name: "About", path: "/about" },
        { id: 3, name: "Sample", path: "/sample" },
        { id: 4, name: "Settings", path: "/settings" },
      ],
    };
  },
  methods: {
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },
    handleTouchMove(e) {
      this.endX = e.touches[0].clientX;
      this.endY = e.touches[0].clientY;
    },
    handleTouchEnd() {
      const diffX = this.startX - this.endX;
      const diffY = this.startY - this.endY;

      // 수평 스와이프 감지
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          // 왼쪽으로 스와이프
          this.nextRoute();
        } else {
          // 오른쪽으로 스와이프
          this.previousRoute();
        }
      }
    },
    nextRoute() {
      const currentIndex = this.routes.findIndex(route => route.path === this.$route.path);
      if (currentIndex >= 0 && currentIndex < this.routes.length - 1) {
        this.transitionName = 'slide-left';
        this.$router.push(this.routes[currentIndex + 1].path);
      }
    },
    previousRoute() {
      const currentIndex = this.routes.findIndex(route => route.path === this.$route.path);
      if (currentIndex > 0) {
        this.transitionName = 'slide-right';
        this.$router.push(this.routes[currentIndex - 1].path);
      }
    }
  }
};
</script>

<style lang="scss">
.page {
  height: 100vh;
  background-color: #eef;
}
.bottom-tabs {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: red;

  .tab {
    flex: 1;
    text-align: center;
  }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}</style>
