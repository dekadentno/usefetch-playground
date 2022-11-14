<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue';
// import { useAPI } from './api';
import useAPI from './api';
import { ref } from 'vue';
const pokemon = ref(null)

async function testko() {
  console.log('testko');

  const { 
    data,
    error,
    abort,
    statusCode,
    isFetching,
    isFinished,
    canAbort,
    execute,
  } = await useAPI.getaj('pokemon', {limit: 10, offset: 2})

  console.log('data', data);
  pokemon.value = JSON.parse(data.value);
}
</script>

<template>
  <img @click="testko" alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
  <pre v-if="pokemon">
  {{pokemon}}

  </pre>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
