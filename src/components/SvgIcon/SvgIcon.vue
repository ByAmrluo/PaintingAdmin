<template>
  <div>
    <svg :style="{ width, height }">
      <use :xlink:href="prefix" :fill="color"></use>
    </svg>
    <slot name="text"></slot>
  </div>
</template>

<script lang="ts" setup>
// import { } from "vue";
defineProps({
  prefix: {
    type: String,
    default: '#icon-'
  },
  color: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  }

})
</script>
<script lang="ts">
export default {
  //命名递归组件
  name: 'SvgIcon'
}
</script>
