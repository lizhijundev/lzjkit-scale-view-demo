<template>
	<view class="content">
    <scale-view
        :x="0"
        :y="0"
        :min-scale-rate="0.6"
        :max-scale-rate="2">
      <view class="table">
        <view class="header">
          <view v-for="y in testData.column" :key="`h-${y}`" :class="{ first: y === 1, item: true }">列{{y}}</view>
        </view>
        <view v-for="x in testData.row" :key="`r-${x}`" class="row">
          <view v-for="y in testData.column" :key="`l-${y}`" :class="{first: y === 1,item: true }" @click="onClickItem(x,y)">({{ x }}, {{ y }})</view>
        </view>
      </view>
    </scale-view>
	</view>
</template>

<script>
import ScaleView from '@/uni_modules/lzjkit-scale-view/components/lzjkit-scale-view/lzjkit-scale-view'
	export default {
    components: {
      ScaleView
    },
		data() {
      return {
        testData: {
          row: 3,
          column: 12
        },
			}
		},
		onLoad() {

		},
		methods: {

      onClickItem(x,y) {
        uni.showToast({
          title: `你点击了(${x}, ${y})`,
          icon: 'none',
          duration: 2000
        });

      }
		}
	}
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;
    height: 300px;
	}

  .table{
    width: auto;
    height: auto;

    .header, .row {
      display: flex;
      flex-direction: row;
    }

    .header {
      top: 0;
      z-index: 2;
      .item{
        background: #f4f3f5;
      }
    }

    .first {
      left: 0;
      background: #e8eaed;
    }
    .item {
      width: 100px;
      height: 50px;
      line-height: 60px;
      text-align: center;
      border: 1px solid #000;
      flex-shrink: 0;
    }

  }


</style>
