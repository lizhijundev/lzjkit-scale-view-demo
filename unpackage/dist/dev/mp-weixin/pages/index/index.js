"use strict";
const common_vendor = require("../../common/vendor.js");
const ScaleView = () => "../../uni_modules/lzjkit-scale-view/components/lzjkit-scale-view/lzjkit-scale-view.js";
const _sfc_main = {
  components: {
    ScaleView
  },
  data() {
    return {
      testData: {
        row: 3,
        column: 12
      }
    };
  },
  onLoad() {
  },
  methods: {
    onClickItem(x, y) {
      common_vendor.index.showToast({
        title: `你点击了(${x}, ${y})`,
        icon: "none",
        duration: 2e3
      });
    }
  }
};
if (!Array) {
  const _component_scale_view = common_vendor.resolveComponent("scale-view");
  _component_scale_view();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.testData.column, (y, k0, i0) => {
      return {
        a: common_vendor.t(y),
        b: `h-${y}`,
        c: y === 1 ? 1 : ""
      };
    }),
    b: common_vendor.f($data.testData.row, (x, k0, i0) => {
      return {
        a: common_vendor.f($data.testData.column, (y, k1, i1) => {
          return {
            a: common_vendor.t(y),
            b: `l-${y}`,
            c: y === 1 ? 1 : "",
            d: common_vendor.o(($event) => $options.onClickItem(x, y), `l-${y}`)
          };
        }),
        b: common_vendor.t(x),
        c: `r-${x}`
      };
    }),
    c: common_vendor.p({
      debug: true,
      x: 0,
      y: 0,
      ["min-scale-rate"]: 0.6,
      ["max-scale-rate"]: 2
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/bob/dev/lzjkit-scale-view-demo/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
