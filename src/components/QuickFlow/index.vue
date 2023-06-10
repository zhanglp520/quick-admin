<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const { data } = toRefs(props)

const vDrag = {
  mounted(el: any) {
    const odiv = el
    odiv.onmousedown = (e) => {
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e1) => {
        const left = e1.clientX - disX
        const top = e1.clientY - disY
        odiv.style.left = `${left}px`
        odiv.style.top = `${top}px`
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}
</script>
<template>
  <div class="flow-wrap">
    <div class="node-list">
      <div v-drag class="node-item node-circular node-start">开始</div>
      <div v-drag class="node-item node-circular node-end">结束</div>
      <div v-drag class="node-item node-rectangle">矩形</div>
      <div v-drag class="node-item node-circular">圆形</div>
      <div v-drag class="node-item node-condition">条件</div>
      <div v-drag class="node-line">连接线</div>
    </div>
  </div>
</template>
<style lang="scss">
.flow-wrap {
  min-height: calc(100vh - 180px);
  .node-list {
    border: solid 1px red;
    position: relative;
    min-height: calc(100vh - 180px);
    .node-item {
      border: solid 1px red;
      cursor: pointer;
      position: absolute;
      background-color: green;
      color: #fff;
      text-align: center;
    }
    .node-start {
      top: 50px;
      left: 50%;
    }
    .node-end {
      bottom: 50px;
      left: 50%;
    }
    .node-rectangle {
      border: solid 1px red;
      height: 100px;
      width: 100px;
      line-height: 100px;
      top: 50px;
      left: 50%;
    }
    .node-circular {
      border: solid 1px red;
      border-radius: 50%;
      height: 50px;
      width: 50px;
      line-height: 50px;
    }
    .node-condition {
      border: solid 1px red;
    }
    .node-line {
      border: solid 1px red;
    }
  }
}
</style>
