<template>
  <div class="image-background">
    <div class="loader" :style="{ width: props.width, height: props.height }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
}

let props = withDefaults(defineProps<Props>(), {
  width: "100px",
  height: "100px",
});
</script>

<style scoped lang="scss">
.image-background {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  position: relative;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, transparent 40%, #d57eeb);
  animation: animate 2s linear infinite;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
    filter: hue-rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader:before {
  content: "";
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background: #000;
  border-radius: 50%;
  z-index: 1000;
}
.loader:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: linear-gradient(45deg, transparent, transparent 40%, #a6c1ee);
  border-radius: 50%;
  z-index: 1000;
  z-index: 1;
  filter: blur(30px);
}
</style>
