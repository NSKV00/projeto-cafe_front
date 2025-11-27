<template>
  <v-app class="app">
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

</script>

<style>
.app {
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
}

.main-content {
  padding: 0 !important;
}
</style>
