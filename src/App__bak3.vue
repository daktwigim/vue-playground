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
      moveLeft: false,
      moveRight: false,
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
  computed: {
    nextPage() {
      const currentIndex = this.routes.findIndex(route => route.path === this.$route.path);
      const nextIndex = currentIndex + 1;
      return nextIndex < this.routes.length ? this.routes[nextIndex].path : null;
    },
    prevPage() {
      const currentIndex = this.routes.findIndex(route => route.path === this.$route.path);
      const prevIndex = currentIndex - 1;
      return prevIndex >= 0 ? this.routes[prevIndex].path : null;
    },
  },
  methods: {
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.moveLeft = false;
      this.moveRight = false;
    },
    handleTouchMove(e) {
      const currentX = e.touches[0].clientX;
      const diffX = this.startX - currentX;

      if (diffX > 0) {
        // 왼쪽으로 스와이프
        this.moveLeft = true;
        this.moveRight = false;
      } else {
        // 오른쪽으로 스와이프
        this.moveLeft = false;
        this.moveRight = true;
      }
    },
    handleTouchEnd() {
      if (this.moveLeft && this.nextPage) {
        this.transitionName = 'slide-left';
        this.$router.push(this.nextPage);
      } else if (this.moveRight && this.prevPage) {
        this.transitionName = 'slide-right';
        this.$router.push(this.prevPage);
      }
      this.moveLeft = false;
      this.moveRight = false;
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

.swipe-container {
  overflow: hidden;
}

.move-left, .move-right {
  transition: transform 0.5s;
}

.move-left {
  transform: translateX(-100%);
}

.move-right {
  transform: translateX(100%);
}
.page-transition-enter-active, .page-transition-leave-active {
  transition: transform 0.3s;
}
.page-transition-enter, .page-transition-leave-to {
  position: absolute;
  width: 100%;
}

.slide-left-enter, .slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter, .slide-right-leave-to {
  transform: translateX(-100%);
}
</style>
