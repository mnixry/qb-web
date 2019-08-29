import {api} from '@/Api';
import _ from 'lodash';

const transHashes = function(hashes: any) {
    if (_.isArray(hashes)) {
        hashes = hashes.join('|');
    }
    return hashes;
};
const transTags = function(tags: any) {
    if (_.isArray(tags)) {
        tags = tags.join(',');
    }
    return tags;
};
export default {
    namespaced: true,

    getters: {
        allTags(state, getters, rootState) {
            return _.get(rootState, 'mainData.tags', []);
        },
        torrentGroupByTag(state, getters, rootState, rootGetters) {
            return _.reduce(rootGetters.allTorrents, (result: object, torrent: any) => {
                _.map(torrent.tags.split(','), key => {
                    key = _.trim(key);
                    result[key] = result[key] || [];
                    result[key].push(torrent);
                });
                return result;
            }, {});
        },
    },
    actions: {
        async createTags({dispatch}, {tags}: { tags: string }) {
            tags = transTags(tags);
            const items = await api.action('torrents/createTags', {
                tags,
            });
        },
        async addTags({dispatch}, {hashes, tags}: { hashes?: any, tags: string }) {
            tags = transTags(tags);
            hashes = transHashes(hashes);
            const items = await api.action('torrents/addTags', {
                hashes,
                tags,
            });
        },
        async removeTags({dispatch}, {hashes, tags}: { hashes?: any, tags: string }) {
            tags = transTags(tags);
            hashes = transHashes(hashes);
            const items = await api.action('torrents/removeTags', {
                hashes,
                tags,
            });
        },
        async deleteTags({dispatch}, {tags}: { tags: any }) {
            tags = transTags(tags);
            const items = await api.action('torrents/deleteTags', {
                tags,
            });
        },


    },
};
