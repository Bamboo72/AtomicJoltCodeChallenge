<script setup lang="ts">
import Pokedex from './components/Pokedex.vue'
</script>

<template>
  <div class="app">
    <div class="canvas-background"></div>
    <div class="content">
      <Pokedex />
    </div>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
}

.canvas-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('./assets/CanvasBackground.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.content {
  position: relative;
  z-index: 1;
  padding: 1rem;
}
</style>
