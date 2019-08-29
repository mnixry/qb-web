import {api} from '@/Api';
import _ from 'lodash';

export default {
    namespaced: true,

    getters:{
        allCategories(state,getters,rootState,rootGetters) {
            if (!rootState.mainData) {
                return [];
            }

            const categories = _.map(rootState.mainData.categories, (value, key) => {
                return _.merge({}, value, {key});
            });
            return _.sortBy(categories, 'name');
        },
        torrentGroupByCategory(state, getters,rootState,rootGetters) {
            return _.groupBy(rootGetters.allTorrents, torrent => torrent.category);
        },
    },
    actions: {
        async createCategory({dispatch}, {path, name}: { path?: string, name: string }) {
            const items = await api.action('torrents/createCategory', {
                category: name,
                savePath: path,
            });
            // dispatch('getAllData', null, {root: true});
        },
        async editCategory({dispatch}, {path, name}: { path: string, name: string }) {
            const items = await api.action('torrents/editCategory', {
                category: name,
                savePath: path,
            });
            // dispatch('getAllData', null, {root: true});
        },
        async removeCategories({dispatch}, {name}: { name: any }) {
            if (_.isArray(name)) {
                name = name.join('\n');
            }
            const items = await api.action('torrents/removeCategories', {
                categories: name,
            });
            // dispatch('getAllData', null, {root: true});
        },


    },


};
