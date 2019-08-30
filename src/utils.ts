import _ from 'lodash';
import {StateType} from './consts';

const dlState = ['downloading', 'metaDL', 'stalledDL', 'checkingDL', 'pausedDL', 'queuedDL', 'forceDL', 'allocating'];
const upState = ['uploading', 'stalledUP', 'checkingUP', 'queuedUP', 'forceUP'];
const completeState = ['uploading', 'stalledUP', 'checkingUP', 'pausedUP', 'queuedUP', 'forceUP'];
const activeState = ['metaDL', 'downloading', 'forceDL', 'uploading', 'forcedUP', 'moving'];
const errorState = ['error', 'missingFiles'];

export function torrentIsState(type: StateType, state: string) {
    let result;
    switch (type) {
        case StateType.Downloading: {
            result = dlState.includes(state);
            break;
        }
        case StateType.Seeding: {
            result = upState.includes(state);
            break;
        }
        case StateType.Completed: {
            result = completeState.includes(state);
            break;
        }
        case StateType.Resumed:
        case StateType.Paused: {
            const paused = state.startsWith('paused');
            result = type === StateType.Paused ? paused : !paused;
            break;
        }
        case StateType.Active:
        case StateType.Inactive: {
            const active = activeState.includes(state);
            result = type === StateType.Active ? active : !active;
            break;
        }
        case StateType.Errored: {
            result = errorState.includes(state);
            break;
        }
    }

    return result;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function codeToFlag(code: string) {
    const magicNumber = 0x1F1A5;

    code = code.toUpperCase();
    const codePoints = [...code].map((c) => magicNumber + c.charCodeAt(0));
    const char = String.fromCodePoint(...codePoints);
    const url = 'https://cdn.jsdelivr.net/npm/twemoji/2/svg/' +
        `${codePoints[0].toString(16)}-${codePoints[1].toString(16)}.svg`;

    return {
        char,
        url,
    };
}

export const isWindows = navigator.userAgent.includes('Windows');

const defTrans = {
    enable: {
        set(val) {
            return _.isNaN(val) ? -1 : val;
        },
        get(val) {
            return val < 0 ? '' : val;
        },
    },
    '1024': {
        set(val) {
            return val * 1024;
        },
        get(val) {
            return val / 1024;
        },
    },
};

export function getDiff(old, obj) {
    let allkeys = _.union(_.keys(old), _.keys(obj));
    return _.reduce(allkeys, function (result, key) {
        if ( !_.isEqual(obj[key], old[key]) ) {
            result[key] = obj[key]
        }
        return result;
    }, {});
}
// tslint:disable-next-line:max-line-length
export function buildFormComputed({keys, parent = '', prefix = ''}: { keys: object, parent?: string, prefix?: string }): object {
    return _.reduce(keys, (result, path: any, key) => {
        let config: {
            path?: string,
            key?: string,
            trans?: any;
        } = {};
        if (_.isObject(path)) {
            config = path;
            path = config.path;
        }
        if (_.isNumber(key)) {
            key = path;
        }
        if (config.key) {
            key = config.key;
        }
        if (_.isString(config.trans)) {
            config.trans = _.get(defTrans, config.trans);
        }
        result[`${prefix ? `${prefix}_` : ''}${key}`] = {
            get() {
                const trans = _.get(config, 'trans.get', (val) => val);
                return trans(_.get(this.$store.state, [parent, path]), this.$store.state);
            },
            set(val) {
                // tslint:disable-next-line:no-shadowed-variable
                const trans = _.get(config, 'trans.set', (val) => val);
                this.$store.commit('updateState', {key: [parent, path], val: trans(val, this.$store.state)});
            },
        };
        return result;
    }, {});


}

export function time_padding(val) {
    let ret = val.toString();
    if (ret.length == 1) {
        ret = '0' + ret;
    }
    return ret;
};


