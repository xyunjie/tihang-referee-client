import { createApp } from "vue";
import App from "./App.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'uno.css';
import router from './router';
import pinia from './store';
const app = createApp(App);

app.use(Antd)
app.use(router);
app.use(pinia);

app.mount('#app');
