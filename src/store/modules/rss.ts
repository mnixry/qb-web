import {api} from '@/Api';
import dayjs from 'dayjs';
import _ from 'lodash';

export default {
    namespaced: true,
    state: {
        items: {},
        rules: [],
    },
    mutations: {
        getRssItemsSuccess(state, {items = {}}: { items: object }) {
            state.items = _.reduce(items, (result, item: { articles: object[], name }, key) => {
                if (item.articles && item.articles.length) {
                    item.articles = _.orderBy(item.articles, (item: { date: number }) => {
                        return dayjs(item.date).valueOf();

                    }, ['desc']);
                }
                item.name = key;
                return {
                    ...result,
                    [key]: item,
                };
            }, {});
        },
        getAllRulesSuccess(state, payload = {rules: {}}) {
            state.rules = _.map(payload.rules, (item: object, name) => ({
                ...item,
                name
            }));
        },
    },
    actions: {
        async addItem({dispatch}, payload = {url: '', name: ''}) {
            const items = await api.actionRss('addFeed', {
                url: payload.url,
                path: payload.name
            });
            dispatch('getAllItems');
        },
        async removeItem({dispatch}, payload = {name: ''}) {
            const items = await api.actionRss('removeItem', {
                path: payload.name
            });
            dispatch('getAllItems');
        },
        async renameItem({dispatch}, payload = {name: '', newName: ''}) {
            const items = await api.actionRss('moveItem', {
                itemPath: payload.name,
                destPath: payload.newName
            });
            dispatch('getAllItems');
        },
        async getAllItems({commit}) {
            const items = await api.actionRss('items', {
                withData: true,
            });
            return commit('getRssItemsSuccess', {items});
        },
        async refreshItem({dispatch}, payload = {name: ''}) {
            const items = await api.actionRss('refreshItem', {
                itemPath: payload.name,
            });
            return dispatch('getAllItems');
        },
        async setRule({dispatch}, payload = {name: '', rule: {}}) {
            const items = await api.actionRss('setRule', {
                ruleName: payload.name,
                ruleDef: JSON.stringify(payload.rule),
            });
            dispatch('getAllRules');
        },
        async renameRull({dispatch}, payload = {name: '', newName: ''}) {
            const items = await api.actionRss('renameRull', {
                ruleName: payload.name,
                newRuleName: payload.newName
            });
            dispatch('getAllRules');
        },
        async removeRule({dispatch}, payload = {name: ''}) {
            const items = await api.actionRss('removeRule', {
                ruleName: payload.name
            });
            dispatch('getAllRules');
        },
        async getAllRules({commit}) {
            const rules = await api.actionRss('rules');
            commit('getAllRulesSuccess', {rules});
        }
    },

};
