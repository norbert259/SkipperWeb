import './assets/main.css'

import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css"

import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";

import App from './App.vue'

const vuetify = createVuetify({
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
            fa,
        },
    },
    components,
    directives,
})

const app = createApp(App)

app.use(OpenLayersMap /*, options */);
app.use(vuetify)

app.mount("#app");

