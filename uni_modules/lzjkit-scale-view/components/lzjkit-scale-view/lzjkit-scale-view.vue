<template>
  <movable-area
      class="scale-view-container"
      :scale-area="true">
    <movable-view
        class="move-container"
        friction="4"
        :style="contentStyle"
        :x="toX"
        :y="toY"
        :out-of-bounds="false"
        :scale="true"
        :animation="false"
        :scale-value="scaleValue"
        :scaleMin="scaleMin"
        :scaleMax="scaleMax"
        direction="all"
        @change="onViewMove"
        @scale="onViewScale">
      <scroll-view
          ref="moveRef"
          :scroll-x="true" :scroll-y="true" class="drag-container">
        <slot></slot>
      </scroll-view>
    </movable-view>

    <view v-if="debug" class="test-container">
      <view>容器：{{containerWidth}}*{{containerHeight}} | 内容：{{ contentWidth }}*{{ contentHeight}}</view>
      <view>缩放比例：{{scaleValue.toFixed(2)}} | 缩放范围：{{scaleMin.toFixed(2)}} ~ {{scaleMax.toFixed(2)}}</view>
      <view>位置：({{toX}},{{toY}})</view>
    </view>
  </movable-area>
</template>

<script>
export default {
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
    },
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
    }
  },
  watch: {
    x: function (newVal) {
      this.toX = newVal
    },
    y: function (newVal) {
      this.toY = newVal
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
  mounted () {
    this.renderView()
    uni.onWindowResize(this.onContainerResize)
  },
  beforeUnmount() {
    uni.offWindowResize(this.onContainerResize)
  },
  methods: {
    debugLog(logName='', params={}) {
      this.debug && console.log(logName, params)
    },
    debounce(fn, wait) {
      if(this.timer !== null){
        clearTimeout(this.timer);
        this.timer = null
      }
      this.timer = setTimeout(fn,wait);
    },
    onViewScale(e) {
      this.debounce( () => {
        this.debugLog('ScaleView onViewScale', e.detail)
        this.scaleValue = e.detail.scale
      }, 100)
    },
    onViewMove(e) {
      this.debounce( () => {
        this.debugLog('ScaleView onViewMove', e.detail)
        this.oldPosition.x = e.detail.x
        this.oldPosition.y = e.detail.y

        this.toX = e.detail.x
        this.toY = e.detail.y
      }, 100)

    },
    onContainerResize() {
      this.renderView()
    },
    // 重新计算容器内尺寸和渲染
    async renderView() {
      const _ctx = this
      const containerSize = await this.calcContainerSize()
      const contentSize = await this.calcContentSize()

      this.debugLog('ScaleViewParent Size', containerSize)
      this.debugLog('ScaleView Size', contentSize)
      this.containerWidth = containerSize.width
      this.containerHeight = containerSize.height
      this.$emit('onContainerSizeUpdate', {
        width: containerSize.width,
        height: containerSize.height
      })

      this.contentWidth = contentSize.width
      this.contentHeight = contentSize.height
      this.$emit('onContentSizeUpdate', {
        width: containerSize.contentWidth,
        height: containerSize.contentHeight
      })
      let scale = 1
      // 按长边缩放，计算缩放比例
      if (this.contentWidth > this.contentHeight) {
        scale = this.containerWidth / this.contentWidth
      } else {
        scale = this.containerHeight / this.contentHeight
      }

      this.$nextTick(function (){
        _ctx.scaleValue = scale
        _ctx.scaleMin = scale * _ctx.minScaleRate
        _ctx.scaleMax = scale * _ctx.maxScaleRate

        _ctx.toX = _ctx.x ?? 0
        _ctx.toY = _ctx.y ?? 0
      })

    },
    moveTo(x, y) {
      this.toX = this.oldPosition.x
      this.toY = this.oldPosition.y
      this.$nextTick(function () {
        this.toX = x
        this.toY = y
        this.debugLog('ScaleView moveTo', x, y)
      })
    },
    // 计算父容器尺寸
    calcContainerSize() {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this)
          query.select('.scale-view-container').fields({
            size: true
          }, rect => {
            resolve(rect)
          }).exec()
        });
      })
    },
    // 计算组件内部尺寸
    calcContentSize() {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this)
          query.select('.drag-container').fields({
            scrollOffset: true
          },rect => {
            resolve({
              width: rect.scrollWidth,
              height: rect.scrollHeight
            })
          }).exec()
        });
      })
    },
  }
}
</script>

<style lang="scss">
.scale-view-container {
  width: 100%;
  height: 100%;
  position: relative;
  .move-container{
    display: inline-block;
    width: auto;
    height: auto;
  }
  .drag-container{
    display: inline-block;
    width: auto;
    height: auto;
  }
  .test-container{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    display: inline-block;
    background-color: #282B2A;
    color: #fff;
    opacity: 0.5;
    z-index: 90;
    padding: 6px;
    font-size: 12px;
  }
}
</style>