// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.common with an alias.
import Vue from 'vue';
import setupAxiosInterceptors from './config/axios-interceptor';
import App from './App';
import router from './router';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {Modal} from 'bootstrap-vue/es/components';
import * as config from './shared/config';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

setupAxiosInterceptors(() => console.log('Unauthorized!'));

const i18n = config.initI18N(Vue);
const store = config.initVueXStore(Vue);
config.initVueApp(Vue);
config.initBootstrapVue(Vue);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Modal);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    router,
    i18n,
    store
});
