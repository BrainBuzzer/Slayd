<template>
  <div class="ui grid">
    <div :class="{'ui page dimmer inverted transition hidden': !loading, 'ui page dimmer inverted transition active': loading}">
      <div class="ui text loader">Processing...</div>
    </div>
    <div class="sixteen wide column">
      <div id="heatmap"></div>
    </div>
    <div class="sixteen wide column">
      <table class="ui inverted celled table" id="tab">
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Storm Name</th>
            <th>Country</th>
            <th>Population</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in data">
            <td>{{ e.id }}</td>
            <td><router-link :to="`/l/${e.id}`">{{ e.near }}</router-link></td>
            <td>{{ e.storm_name }}</td>
            <td>{{ e.countryname }}</td>
            <td>{{ e.population }}</td>
            <td>{{ e.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const L = window.L;
const heat = [];
export default {
  name: 'home',
  data() {
    return {
      loading: true,
      data: null,
      error: false,
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    addMap() {
      const mymap = L.map('heatmap').setView([0, 0], 2);
      L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRpdHlhZ2lyaSIsImEiOiJjaXdhbHc0NHAwMGsyMnprMmRzamwxbHo2In0.0YYn-IB5zuHkeMMSaBELzg', {
          maxZoom: 18,
          attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
          id: 'mapbox.dark',
        }).addTo(mymap);
      console.log(heat);
      L.heatLayer(heat).addTo(mymap);
    },
    fetchData() {
      axios.get('https://data.nasa.gov/resource/tfkf-kniw.json')
            .then((data) => {
              this.loading = false;
              this.data = data.data;
              data.data.forEach((el) => {
                let a;
                switch (el.landslide_size) {
                  case 'small':
                    a = 0.3;
                    break;
                  case 'medium':
                    a = 0.6;
                    break;
                  default:
                    a = 1;
                    break;
                }
                heat.push(
                  [el.geolocation.coordinates[1], el.geolocation.coordinates[0], a],
                );
              });
              this.addMap();
            }).then(() => {
              window.$('#tab').DataTable();
            })
            .catch((err) => {
              this.loading = false;
              if (err) {
                this.error = true;
              } else {
                this.error = false;
              }
            });
    },
  },
};
</script>

<style scoped>
  #heatmap {
    height: 90vh;
  }
</style>
