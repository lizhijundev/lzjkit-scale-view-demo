"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "ScaleView",
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: void 0
    },
    y: {
      type: Number,
      default: void 0
    },
    minScaleRate: {
      type: Number,
      default: 0.8
    },
    maxScaleRate: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      // 容器尺寸
      containerWidth: 10,
      containerHeight: 10,
      // 组件内容尺寸
      contentWidth: 10,
      contentHeight: 10,
      toX: this.x,
      toY: this.y,
      oldPosition: {
        x: 0,
        y: 0
      },
      scaleValue: 1,
      scaleMin: 0.5,
      scaleMax: 2,
      timer: null
    };
  },
  watch: {
    x: function(newVal) {
      this.toX = newVal;
    },
    y: function(newVal) {
      this.toY = newVal;
    }
  },
  computed: {
    contentStyle() {
      return {
        // width: `${this.contentWidth}px`,
        // height: `${this.contentHeight}px`
      };
    }
  },
  mounted() {
    this.renderView();
    common_vendor.index.onWindowResize(this.onContainerResize);
  },
  beforeUnmount() {
    common_vendor.index.offWindowResize(this.onContainerResize);
  },
  methods: {
    debugLog(logName = "", params = {}) {
      this.debug && console.log(logName, params);
    },
    debounce(fn, wait) {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(fn, wait);
    },
    onViewScale(e) {
      this.debounce(() => {
        this.debugLog("ScaleView onViewScale", e.detail);
        this.scaleValue = e.detail.scale;
      }, 100);
    },
    onViewMove(e) {
      this.debounce(() => {
        this.debugLog("ScaleView onViewMove", e.detail);
        this.oldPosition.x = e.detail.x;
        this.oldPosition.y = e.detail.y;
        this.toX = e.detail.x;
        this.toY = e.detail.y;
      }, 100);
    },
    onContainerResize() {
      this.renderView();
    },
    // 重新计算容器内尺寸和渲染
    async renderView() {
      const _ctx = this;
      const containerSize = await this.calcContainerSize();
      const contentSize = await this.calcContentSize();
      this.debugLog("ScaleViewParent Size", containerSize);
      this.debugLog("ScaleView Size", contentSize);
      this.containerWidth = containerSize.width;
      this.containerHeight = containerSize.height;
      this.$emit("onContainerSizeUpdate", {
        width: containerSize.width,
        height: containerSize.height
      });
      this.contentWidth = contentSize.width;
      this.contentHeight = contentSize.height;
      this.$emit("onContentSizeUpdate", {
        width: containerSize.contentWidth,
        height: containerSize.contentHeight
      });
      let scale = 1;
      if (this.contentWidth > this.contentHeight) {
        scale = this.containerWidth / this.contentWidth;
      } else {
        scale = this.containerHeight / this.contentHeight;
      }
      this.$nextTick(function() {
        _ctx.scaleValue = scale;
        _ctx.scaleMin = scale * _ctx.minScaleRate;
        _ctx.scaleMax = scale * _ctx.maxScaleRate;
        _ctx.toX = _ctx.x ?? 0;
        _ctx.toY = _ctx.y ?? 0;
      });
    },
    moveTo(x, y) {
      this.toX = this.oldPosition.x;
      this.toY = this.oldPosition.y;
      this.$nextTick(function() {
        this.toX = x;
        this.toY = y;
        this.debugLog("ScaleView moveTo", x, y);
      });
    },
    // 计算父容器尺寸
    calcContainerSize() {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const query = common_vendor.index.createSelectorQuery().in(this);
          query.select(".scale-view-container").fields({
            size: true
          }, (rect) => {
            resolve(rect);
          }).exec();
        });
      });
    },
    // 计算组件内部尺寸
    calcContentSize() {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const query = common_vendor.index.createSelectorQuery().in(this);
          query.select(".drag-container").fields({
            scrollOffset: true
          }, (rect) => {
            resolve({
              width: rect.scrollWidth,
              height: rect.scrollHeight
            });
          }).exec();
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.s($options.contentStyle),
    b: $data.toX,
    c: $data.toY,
    d: $data.scaleValue,
    e: $data.scaleMin,
    f: $data.scaleMax,
    g: common_vendor.o((...args) => $options.onViewMove && $options.onViewMove(...args)),
    h: common_vendor.o((...args) => $options.onViewScale && $options.onViewScale(...args)),
    i: $props.debug
  }, $props.debug ? {
    j: common_vendor.t($data.containerWidth),
    k: common_vendor.t($data.containerHeight),
    l: common_vendor.t($data.contentWidth),
    m: common_vendor.t($data.contentHeight),
    n: common_vendor.t($data.scaleValue.toFixed(2)),
    o: common_vendor.t($data.scaleMin.toFixed(2)),
    p: common_vendor.t($data.scaleMax.toFixed(2)),
    q: common_vendor.t($data.toX),
    r: common_vendor.t($data.toY)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/bob/dev/lzjkit-scale-view-demo/uni_modules/lzjkit-scale-view/components/lzjkit-scale-view/lzjkit-scale-view.vue"]]);
wx.createComponent(Component);
