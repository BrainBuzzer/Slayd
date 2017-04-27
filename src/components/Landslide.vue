<template>
  <div class="ui grid">
    <div :class="{'ui page dimmer transition hidden': !loading, 'ui page dimmer transition active': loading}">
      <div class="ui text loader">Processing...</div>
    </div>
    <div class="six wide column">
      <div class="ui inverted segment" id="description">
        <h3>Details</h3>
        <div class="content">
          <table class="ui inverted striped table">
            <tr>
              <td>Date</td>
              <td>{{ data.date }}</td>
            </tr>
            <tr v-show="data.time">
              <td>Time</td>
              <td>{{ data.time }}</td>
            </tr>
            <tr v-show="data.nearest_places">
              <td>Nearest Places</td>
              <td>{{ data.nearest_places }}</td>
            </tr>
            <tr v-show="data.landslide_type">
              <td>Landslide Type</td>
              <td>{{ data.landslide_type }}</td>
            </tr>
            <tr v-show="data.countryname">
              <td>Country</td>
              <td>{{ data.countryname }}</td>
            </tr>
            <tr v-show="data.trigger">
              <td>Triggered By</td>
              <td>{{ data.trigger }}</td>
            </tr>
            <tr v-show="data.storm_name">
              <td>Storm Name</td>
              <td>{{ data.storm_name }}</td>
            </tr>
            <tr v-show="data.fatalities">
              <td>Fatalities</td>
              <td>{{ data.fatalities }}</td>
            </tr>
            <tr v-show="data.location_description">
              <td>Location Description</td>
              <td>{{ data.location_description }}</td>
            </tr>
            <tr v-show="data.injuries">
              <td>Injuries</td>
              <td>{{ data.injuries }}</td>
            </tr>
            <tr v-show="data.location_accuracy">
              <td>Location Accuracy</td>
              <td>{{ data.location_accuracy }}</td>
            </tr>
            <tr v-show="data.landslide_size">
              <td>Landslide Size</td>
              <td>{{ data.landslide_size }}</td>
            </tr>
            <tr v-show="data.time">
              <td>Time</td>
              <td>{{ data.time }}</td>
            </tr>
            <tr v-show="data.distance">
              <td>Distance</td>
              <td>{{ data.distance }}</td>
            </tr>
            <tr v-show="data.population">
              <td>Population</td>
              <td>{{ data.population }}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>{{ data.latitude }}, {{ data.longitude }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="ten wide column">
      <div id="map"></div>
    </div>
    <div class="row">
      <div class="sixteen wide column">
        <div class="ui segments">
          <div class="ui inverted clearing segment">
            <h3>Images</h3>
            <div class="ui inverted right floated button" v-on:click="toggle_image()">
              Add Data
            </div>
            <div v-if="this.loc_data">
              <div class="ui grid">
                <div v-for="image in loc_data.image" class="four wide column">
                  <img :src="image" class="ui medium bordered image">
                </div>
              </div>
            </div>
            <div v-else>
              Data not found.
            </div>
          </div>
          <div class="ui inverted segment" v-if="imageAdd">
            <h3>Add Image</h3>
            <div class="ui red inverted segment" v-if="imageAddError">
              Failed to add Image.
            </div>
            <div class="ui inverted input">
              <input type="url" id="image_url" required placeholder="Image URL">
            </div>
            <div class="ui inverted input">
              <input type="email" id="email_i" required placeholder="Link">
            </div>
            <div class="ui primary inverted button" v-on:click="addImage()">Add Image</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="sixteen wide column">
        <div class="ui segments">
          <div class="ui inverted clearing segment">
            <h3>Links</h3>
            <div class="ui inverted right floated button" v-on:click="toggle_links()">
              Add Data
            </div>
            <div v-if="this.loc_data">
              <ol>
                <li v-for="link in loc_data.links">
                  <a :href="link">{{ link }}</a><br>
                </li>
              </ol>
            </div>
            <div v-else>
              Data not found.
            </div>
          </div>
          <div class="ui inverted segment" v-if="linkAdd">
            <h3>Add Link</h3>
            <div class="ui red inverted segment" v-if="linkAddError">
              Failed to add Link.
            </div>
            <div class="ui inverted input">
              <input type="url" id="link" required placeholder="Link">
            </div>
            <div class="ui inverted input">
              <input type="email" id="email_l" required placeholder="E-mail">
            </div>
            <div class="ui inverted primary button" v-on:click="addLink()">Add Image</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="sixteen wide column">
        <div id="disqus_thread"></div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment';

  const PouchDB = window.PouchDB;
  PouchDB.plugin(require('pouchdb-upsert'));

  const db = new PouchDB('landslide');

  const L = window.L;
  export default {
    name: 'Landslide',
    data() {
      return {
        loading: true,
        data: 'Loading, please wait.',
        error: false,
        loc_data: null,
        imageAdd: false,
        imageAddError: false,
        linkAdd: false,
        linkAddError: false,
      };
    },
    created() {
      this.fetchData();
      this.fetchAl();
    },
    watch: {
      $route: 'fetchData',
    },
    methods: {
      addImage() {
        /* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["doc"] }] */
        if (document.getElementById('image_url') === '' || document.getElementById('email_i').value === '') {
          this.imageAddError = true;
        } else {
          db.upsert(this.data.id, (doc) => {
            if (doc.image) {
              doc.image.push(document.getElementById('image_url').value);
            } else {
              doc.image = [document.getElementById('image_url').value];
            }
            return doc;
          }).then(() => {
            this.imageAdd = false;
            this.loading = true;
            this.fetchData();
          }).catch(() => {
            this.imageAddError = true;
          });
        }
      },
      toggle_image() {
        if (this.imageAdd) {
          this.imageAdd = false;
        } else {
          this.imageAdd = true;
        }
      },
      addLink() {
        /* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["doc"] }] */
        if (document.getElementById('link') === '' || document.getElementById('email_l').value === '') {
          this.linkAddError = true;
        } else {
          db.upsert(this.data.id, (doc) => {
            if (doc.links) {
              doc.links.push(document.getElementById('link').value);
            } else {
              doc.links = [document.getElementById('link').value];
            }
            return doc;
          }).then(() => {
            this.linkAdd = false;
            this.loading = true;
            this.fetchData();
          }).catch(() => {
            this.linkAddError = true;
          });
        }
      },
      toggle_links() {
        if (this.linkAdd) {
          this.linkAdd = false;
        } else {
          this.linkAdd = true;
        }
      },
      addMap() {
        const latlng = L.latLng([this.data.latitude, this.data.longitude]);
        const mymap = L.map('map').setView(latlng, 7);
        L.tileLayer(
          'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRpdHlhZ2lyaSIsImEiOiJjaXdhbHc0NHAwMGsyMnprMmRzamwxbHo2In0.0YYn-IB5zuHkeMMSaBELzg', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
              'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.dark',
          }).addTo(mymap);
        L.marker(latlng).addTo(mymap)
          .bindPopup(`<b>${this.data.near}</b>`).openPopup();
        L.circle(latlng, 5000, {
          color: '#fc5f5f',
          fillColor: '#fc5f5f',
          fillOpacity: 0.5,
        }).addTo(mymap);
      },
      fetchData() {
        axios.get(`https://data.nasa.gov/resource/tfkf-kniw.json?$where=id==${this.$route.params.id}`)
          .then((data) => {
            this.loading = false;
            this.data = data.data[0];
            this.data.date = moment(data.data[0].date).format('DD MMM YYYY');
            this.addMap();
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
      fetchAl() {
        db.get(this.data.id).then((doc) => {
          this.loc_data = doc;
        }).catch(() => {
          this.loc_data = null;
        });
      },
    },
  };
      /* eslint-disable */


/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://landslide-1.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();

</script>

<style scoped>
  #map {
    height: 100vh;
  }

  #description {
    height: 100vh auto;
  }

</style>
