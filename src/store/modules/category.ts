import {api} from '@/Api';
import _ from 'lodash';

export default {
    namespaced: true,

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
