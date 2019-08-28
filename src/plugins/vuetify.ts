import Vue from 'vue';
// tslint:disable-next-line
import Vuetify from 'vuetify';
import 'vuetify/src/stylus/main.styl';
import zhHans from 'vuetify/es5/locale/zh-Hans';
Vue.use(Vuetify, {
  iconfont: 'mdi',
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  }
});
