<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Skipper</a>
      <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
              class="navbar-toggler"
              data-bs-target="#navbarSupportedContent" data-bs-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a aria-expanded="false" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#"
               role="button">
              Maps
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" :class="{ active: basemap===1 }" @click="setBaseMap(1)">Openstreet Map</a></li>
              <li><a class="dropdown-item" :class="{ active: basemap===2 }" @click="setBaseMap(2)">Topo Map</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" :class="{ active: openseamap }" @click="openseamap=!openseamap">Openseamap</a></li>
            </ul>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input aria-label="Search" class="form-control me-2" placeholder="Search" type="search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>

  <ol-map style="height: 800px">
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