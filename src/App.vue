<template>
  <div id="app">
    <div class="ui inverted menu">
      <div class="header item">
        Landslides
      </div>
      <div class="item">
        <router-link to="/">Home</router-link>
        <router-link to="/list">List</router-link>
      </div>
    </div>
    <div class="ui container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color: #000;
}
</style>
