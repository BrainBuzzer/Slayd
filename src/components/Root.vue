<template>
  <div>
    <div class="ui inverted vertical center aligned" id="mast">
    <div class="ui text container">
      <img src="/static/img/Slayd.png" alt="Slayd" class="ui medium centered image">
      <div class="ui text container">
        <h1 class="ui inverted header">Slayd</h1>
        <h2>A Landslide Tracing Platform</h2>
        <router-link class="ui huge inverted button" to="/list">List of Landslides</router-link>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'root',
  data() {
    return {
      loading: false,
    };
  },
};
</script>

<style scoped>
  #heatmap {
    height: 90vh;
  }
  #mast {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
