<template>

  <v-app id="inspire">
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon>
          <v-icon icon="mdi-menu"/>
        </v-app-bar-nav-icon>
        <v-app-bar-title>Skipper</v-app-bar-title>

        <v-menu open-on-click>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" variant="tonal" v-bind="props" class="ml-5">Maps</v-btn>
          </template>
          <v-list>
            <v-list-item :active="basemap===1" @click="setBaseMap(1)">
              <v-list-item-title>OSM</v-list-item-title>
            </v-list-item>
            <v-list-item :active="basemap===2" @click="setBaseMap(2)">
              <v-list-item-title>Topo</v-list-item-title>
            </v-list-item>
            <v-list-item :active="basemap===3" @click="setBaseMap(3)">
              <v-list-item-title>Outdoor V2</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-divider></v-divider>
            </v-list-item>
            <v-list-item :active="openseamap" @click="openseamap=!openseamap">
              <v-list-item-title>Openseamap</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

    </v-app-bar>

    <ol-map style="height: 100%" class="pt-16">
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

      <ol-tile-layer v-if="basemap===3">
        <ol-source-xyz
            url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=VtOrxp94ttepmvokSpNS"
            crossOrigin="anonymous"
        />
      </ol-tile-layer>

      <ol-tile-layer v-if="openseamap">
        <ol-source-osm :url="openseamapurl"/>
      </ol-tile-layer>

      <ol-mouseposition-control :coordinateFormat="toStringHDMS"></ol-mouseposition-control>
      <ol-zoomslider-control/>
      <ol-rotate-control></ol-rotate-control>
      <ol-interaction-link/>
      <ol-scaleline-control :bar=true style="left: 200px !important;"></ol-scaleline-control>

      <ol-overviewmap-control :collapsed="false">
        <ol-tile-layer>
          <ol-source-osm/>
        </ol-tile-layer>
      </ol-overviewmap-control>

      <v-card style="position: absolute; right: 20px; top: 100px; z-index: 10">
        <v-list lines="one">
          <v-list-item subtitle="Position">
            Lat: <span class="text-right">{{ degreesToStringHDMS('NS', position[0], 1)}}</span><br>Lon: {{ degreesToStringHDMS('EW', position[1], 1) }}
          </v-list-item>
          <v-list-item subtitle="Accuracy">{{ new Intl.NumberFormat().format(accuracy) }}</v-list-item>
          <v-list-item subtitle="Speed">{{ new Intl.NumberFormat().format(speed) }}</v-list-item>
          <v-list-item subtitle="Heading">{{ new Intl.NumberFormat().format(heading) }}</v-list-item>
        </v-list>
      </v-card>

      <ol-geolocation :projection="projection" @change:position="geoLocChange">
        <template>
          <ol-vector-layer :zIndex="2">
            <ol-source-vector>
              <ol-feature ref="positionFeature">
                <ol-geom-point :coordinates="position"></ol-geom-point>
                <ol-style>
                  <ol-style-icon :src="navigationIcon" :scale="1"></ol-style-icon>
                </ol-style>
              </ol-feature>
            </ol-source-vector>
          </ol-vector-layer>
        </template>
      </ol-geolocation>

    </ol-map>
  </v-app>
</template>

<script setup>
import {ref} from "vue";
import {toStringHDMS, degreesToStringHDMS} from 'ol/coordinate';
import View from "ol/View";
import navigationIcon from "@/assets/navigation.png";

const mapTilerKey = "VtOrxp94ttepmvokSpNS";

const center = ref([40, 40]);
const projection = ref("EPSG:4326");
const zoom = ref(8);
const rotation = ref(0);
const position = ref([]);
const accuracy = ref(0);
const heading = ref(0);
const speed = ref(0);

const view = ref(new View());

const currentCenter = ref(center.value);
const currentZoom = ref(zoom.value);
const currentRotation = ref(rotation.value);
const currentResolution = ref(0);

const basemap = ref(1);
const openseamapurl = ref("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png");
const topomapurl = ref("https://a.tile.opentopomap.org/{z}/{x}/{y}.png")
const openseamap = ref(false);

const geoLocChange = (event) => {
  position.value = event.target.getPosition();
  accuracy.value = event.target.getAccuracy();
  heading.value = event.target.getHeading();
  speed.value = event.target.getSpeed();

  console.log("Location:", event, position.value);
  view.value?.setCenter(event.target?.getPosition());
};

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
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>