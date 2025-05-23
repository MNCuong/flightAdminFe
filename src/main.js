import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';
import { createI18n } from 'vue-i18n'
import i18n from '../i18n'

const app = createApp(App);
app.use(router);
app.use(i18n)
app.use(PerfectScrollbar);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(Maska);
app.use(VueApexCharts);
app.use(VCalendar, {});
app.use(vuetify).mount('#app');
