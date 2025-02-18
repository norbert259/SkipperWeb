<template>

  <v-app id="inspire">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon><v-icon icon="mdi-menu" /></v-app-bar-nav-icon>
        <v-app-bar-title>Skipper</v-app-bar-title>

        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" variant="tonal" v-bind="props" class="ml-5">Maps</v-btn>
          </template>
          <v-list>
            <v-list-item :active="basemap===1" @click="setBaseMap(1)">
              <v-list-item-title>OSM</v-list-item-title>
            </v-list-item>
            <v-list-item :active="basemap===2"  @click="setBaseMap(2)">
              <v-list-item-title>Topo</v-list-item-title>
            </v-list-item>
            <v-list-item><v-divider></v-divider></v-list-item>
            <v-list-item :active="openseamap" @click="openseamap=!openseamap">
              <v-list-item-title>Openseamap</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

    </v-app-bar>

    <ol-map style="height: 800px" class="mt-16">
      <ol-view
          ref="view"
          :center="center"
          :projection="projection"
          :rotation="rotation"
          :zoom="zoom"
          @change:center="centerChanged"
          @change:resolution="resolutionChanged"
          @change:rotation="rotationChanged"
      />

      <ol-tile-layer v-if="basemap===1">
        <ol-source-osm></ol-source-osm>
      </ol-tile-layer>

      <ol-tile-layer v-if="basemap===2">
        <ol-source-osm :url="topomapurl"></ol-source-osm>
      </ol-tile-layer>

      <ol-tile-layer v-if="openseamap">
        <ol-source-osm :url="openseamapurl"/>
      </ol-tile-layer>

      <ol-zoomslider-control />
      <ol-rotate-control></ol-rotate-control>
      <ol-interaction-link/>
      <ol-scaleline-control :bar=true></ol-scaleline-control>
      <ol-mouseposition-control/>

      <ol-overviewmap-control :collapsed="false">
        <ol-tile-layer>
          <ol-source-osm/>
        </ol-tile-layer>
      </ol-overviewmap-control>
    </ol-map>

    <form>
      <label for="zoom">Zoom:</label>
      <input id="zoom" v-model="zoom" type="number"/>
    </form>

    <ul>
      <li>center : {{ currentCenter }}</li>
      <li>resolution : {{ currentResolution }}</li>
      <li>zoom : {{ currentZoom }}</li>
      <li>rotation : {{ currentRotation }}</li>
    </ul>
  </v-app>
</template>

<script setup>
import {ref} from "vue";

const center = ref([40, 40]);
const projection = ref("EPSG:4326");
const zoom = ref(8);
const rotation = ref(0);

const currentCenter = ref(center.value);
const currentZoom = ref(zoom.value);
const currentRotation = ref(rotation.value);
const currentResolution = ref(0);

const basemap = ref(1);
const openseamapurl = ref("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png");
const topomapurl = ref("https://a.tile.opentopomap.org/{z}/{x}/{y}.png")
const openseamap = ref(false);

function setBaseMap(i) {
  basemap.value = i;
}

function resolutionChanged(event) {
  currentResolution.value = event.target.getResolution();
  currentZoom.value = event.target.getZoom();
}

function centerChanged(event) {
  currentCenter.value = event.target.getCenter();
}

function rotationChanged(event) {
  currentRotation.value = event.target.getRotation();
}
</script>

<style scoped>
.ol-map {
  position: relative;
}

.ol-map-loading:after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 50%;
  border: 5px solid rgba(180, 180, 180, 0.6);
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>