<template>
  <div class="chart-container">
    <template v-if="typeof loading === 'boolean'">
      <Spin v-show="loading" size="large" fix></Spin>
    </template>
    <div v-if="noData && echartsType != 'moreBar'" class="no-data">
      <p>暂无数据</p>
    </div>
    <div
      ref="chartDom"
      class="chart-wrap"
      :class="{fullChart: chartFullStatus, rotate: chartRotate}"
      :style="{width: chartW, height: chartH}"
      @touchstart="handlerTouchStart"
      @touchmove="handlerTouchMove"
      @touchend="handlerTouchEnd"
    >
      <Spin v-if="typeof loading === 'undefined'" size="large" fix></Spin>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

let tapStart = {},
  tapTime = 0;

export default {
  name: "index",
  props: ["options", "loading", "echartsType"],
  watch: {
    options: {
      deep: true,
      handler(newValue) {
        console.log(newValue)
        this.setOption();
      }
    }
  },
  computed: {
    noData() {
      if (this.options && !this.loading && this.options.series) {
        const series = this.options.series;
        if (Array.isArray(series)) {
          if (!series.length) return true;
          if (!series[0].data || !series[0].data.length) return true;
        }
      }
      return false;
    }
  },
  data() {
    return {
      chart: null,
      timer: null,
      chartW: "100%",
      chartH: "100%",
      chartRotate: false,
      chartFullStatus: false
    };
  },
  methods: {
    setOption() {
      if (!this.$refs.chartDom) {
        console.warn("chart unready.", this.$refs.chartDom);
        return;
      }
      if (!this.chart) this.chart = echarts.init(this.$refs.chartDom);
      console.log(this.options);
      this.chart.setOption(this.options, true);
    },
    resize() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.chart &&
          this.chart.resize(
            this.$refs.chartDom.innerWidth,
            this.$refs.chartDom.innerHeight
          );
        if (this.chartFullStatus) this.fullChart();
      }, 100);
    },
    handlerTouchStart(ev) {
      tapStart = {
        x: ev.changedTouches[0].clientX,
        y: ev.changedTouches[0].clientY,
        t: Date.now()
      };
    },
    handlerTouchMove(ev) {
      if (this.chartFullStatus) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    handlerTouchEnd(ev) {
      const { clientX, clientY } = ev.changedTouches[0];
      if (
        clientX - tapStart.x < 20 &&
        clientY - tapStart.y < 20 &&
        Date.now() - tapStart.t < 300
      ) {
        if (Date.now() - tapTime < 300) {
          if (this.chartFullStatus) {
            this.closeFull();
          } else {
            this.fullChart();
          }
        }
        tapTime = Date.now();
      }
    },
    fullChart() {
      this.chartW = Math.max(window.innerWidth, window.innerHeight) + "px";
      this.chartH = Math.min(window.innerWidth, window.innerHeight) + "px";
      this.chartFullStatus = true;
      this.chartRotate = window.innerWidth < window.innerHeight;
      this.resize();
    },
    closeFull() {
      this.chartW = "100%";
      this.chartH = "100%";
      this.chartFullStatus = false;
      this.chartRotate = false;
      setTimeout(() => {
        this.resize();
      }, 500);
    }
  },
  mounted() {
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  }
};
</script>

<style lang="less" scoped>
.chart-container,
.chart-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.chart-wrap {
  transition: background-color 0.8s ease-in-out, all 0.3s ease-in-out;
  &.fullChart {
    position: fixed !important;
    left: 0;
    top: 0;
    z-index: 9999;
    background: #fff;
    &.rotate {
      transform: translateX(100vw) rotateZ(90deg);
      transform-origin: left top;
    }
  }
}
.no-data {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 600;
  p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ececec;
  }
}
</style>