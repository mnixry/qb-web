import Vue from 'vue';
import './plugins/vuetify';
import store from './store/store';
import './filters';
import './directives';
import App from './App.vue';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@/assets/mdi.scss';

import VuetifyDialog from '@/modules/dialogs';
import 'vuetify-dialog/dist/vuetify-dialog.css';
import VeeValidate from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN';

import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

Vue.use(VueVirtualScroller);
Vue.use(VeeValidate, {
    locale: 'zh_CN',
    dictionary: {
        zh_CN
    }
});

Vue.config.productionTip = false;
Vue.use(VuetifyDialog);
new Vue({
    store,
    render: (h) => h(App),
}).$mount('#app');

