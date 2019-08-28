<template>
    <v-dialog :value="true" @input="closeDialog" :width="dialogWidth" :fullscreen="phoneLayout">
        <v-card class="rss_card">
            <v-card-title class="headline grey lighten-4">
                <v-icon class="mr-2">mdi-rss</v-icon>
                <span>RSS</span>
            </v-card-title>
            <v-card-text class="rss_content">
                <v-tabs v-model="mTab">
                    <v-tab href="#items">站点</v-tab>
                    <v-tab href="#rules">规则</v-tab>
                    <v-tab href="#torrents">种子</v-tab>
                    <v-tab href="#setting">设置</v-tab>
                </v-tabs>
                <v-tabs-items :value="mTab" touchless>
                    <v-tab-item value="items">
                        <v-list class="list" dense>
                            <v-list-tile v-for="(item,name) in items" :key="item.uid">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ name }} ({{item.title}})</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ item.url }}</v-list-tile-sub-title>
                                </v-list-tile-content>

                                <v-list-tile-action>
                                    <div class="action">
                                        <ItemAction :name="name" :url="item.url"/>
                                        <v-btn class="small" flat @click="remove('removeItem',{name})">
                                            <v-icon class="">mdi-delete</v-icon>
                                        </v-btn>
                                        <v-btn class="small" flat @click="refreshItemAction({name})">
                                            <v-icon class="">mdi-refresh</v-icon>
                                        </v-btn>
                                    </div>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-tab-item>
                    <v-tab-item value="rules">
                        <v-container fluid grid-list-md>
                            <v-data-iterator
                                    class="rules"
                                    :items="rules"
                                    :total-items="rules.length"
                                    content-tag="v-layout"
                                    hide-actions
                                    row
                                    wrap
                            >
                                <template v-slot:item="props">
                                    <v-flex xs12 sm6 md4 lg3>
                                        <v-card>
                                            <v-card-title>
                                                <h4>{{ props.item.name }}</h4>
                                                <v-spacer/>
                                                <RuleAction :name="props.item.name" :rule="props.item"/>
                                                <v-btn flat @click="remove('removeRule',{name:props.item.name})"
                                                       class="small">
                                                    <v-icon class="">mdi-delete</v-icon>
                                                </v-btn>
                                            </v-card-title>
                                            <v-divider></v-divider>
                                            <v-list dense>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">开启:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.enabled |
                                                        boolean
                                                        }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">忽略天数:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.ignoreDays }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">必须包含:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.mustContain }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">不能包含:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.mustNotContain
                                                        }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">开启正则:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.useRegex |
                                                        boolean}}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">保存路径:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.savePath }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">分配分类:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{
                                                        props.item.assignedCategory}}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">添加后暂停:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.addPaused |
                                                        boolean}}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content class="label">最后捕获日期:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ props.item.lastMatch |
                                                        formatDate }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile class="feeds_list">
                                                    <v-list-tile-content class="label">包含数据源:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">
                                                        <div class="chip">
                                                            <v-chip small v-for="feed in props.item.affectedFeedsObj"
                                                                    :key="feed.name">
                                                                {{feed.name}}
                                                            </v-chip>
                                                        </div>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-card>
                                    </v-flex>
                                </template>
                            </v-data-iterator>
                        </v-container>
                    </v-tab-item>
                    <v-tab-item value="torrents">
                        <v-expansion-panel
                                v-model="torrentsPanel"
                                class="torrentsPanel"
                                expand
                        >
                            <v-expansion-panel-content
                                    v-for="(item,name) in items"
                                    :key="item.uid"
                            >
                                <template v-slot:header>
                                    <div class="title">{{ name }}({{item.title}})</div>
                                </template>

                                <v-list class="list" dense>
                                    <template v-for="(torrent,index) in item.articles">
                                        <v-list-tile :key="torrent.id">
                                            <v-list-tile-content>
                                                <v-list-tile-title>{{ torrent.title }}
                                                </v-list-tile-title>
                                                <v-list-tile-sub-title>
                                                    <div class="desc">
                                                        <span>[{{torrent.category}}]</span>
                                                        <span>日期:{{torrent.date | formatDate}}</span>
                                                        <span>已读:{{torrent.isRead | boolean}}</span>
                                                    </div>

                                                </v-list-tile-sub-title>
                                            </v-list-tile-content>

                                            <v-list-tile-action>
                                                <div class="action">
                                                    <v-btn flat class="small" target="_blank" :href="torrent.link">
                                                        详情
                                                    </v-btn>
                                                    <v-btn flat class="small" @click="addTorrent(torrent.torrentURL)">
                                                        下载
                                                    </v-btn>
                                                </div>

                                            </v-list-tile-action>
                                        </v-list-tile>
                                        <v-divider
                                                class="list_border"
                                                v-if="index + 1 < item.articles.length"
                                                :key="index"
                                        ></v-divider>
                                    </template>

                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-tab-item>
                    <v-tab-item value="setting">
                        <v-card flat>

                            <v-card-text>
                                <v-checkbox
                                        v-model="rss_processing_enabled"
                                        label="开启"
                                        type="checkbox"
                                ></v-checkbox>
                                <v-text-field
                                        v-model="rss_refresh_interval"
                                        type="number"
                                        suffix="分钟"
                                        label="刷新间隔"
                                ></v-text-field>
                                <v-checkbox
                                        v-model="rss_auto_downloading_enabled"
                                        label="开启自动下载"
                                        type="checkbox"
                                ></v-checkbox>
                                <v-text-field
                                        v-model="rss_max_articles_per_feed"
                                        type="number"
                                        suffix="个"
                                        label="种子抓取数量"
                                ></v-text-field>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <ItemAction v-if="mTab === 'items'"/>
                <RuleAction v-if="mTab === 'rules'"/>
                <v-btn color="success"
                       flat
                       v-if="mTab === 'setting'"
                       @click="saveSetting">
                    保存
                </v-btn>
                <v-btn flat @click="closeDialog">关闭</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import _ from "lodash";
    import Vue from "vue";
    import ItemAction from "./rss/addItem.vue";
    import RuleAction from "./rss/addRule.vue";
    import {mapActions, mapGetters, mapState, mapMutations} from "vuex";
    import {buildFormComputed} from "@/utils";

    const rssSettingKeys = [
        "rss_refresh_interval",
        "rss_max_articles_per_feed",
        "rss_processing_enabled",
        "rss_auto_downloading_enabled",
    ];
    export default Vue.extend({
        components: {
            ItemAction,
            RuleAction,
        },

        props: {
            // value: Array,
            tab: String
        },
        data() {
            return {
                mTab: null,
                torrentsPanel: [],

            };
        },
        async created() {
            this.mTab = this.tab;
            await this.getAllItems();
            await this.getAllRules();
            this.torrentsPanel = _.map(this.items, () => true);
        },
        computed: {
            ...mapState("rss", {
                items: state => {
                    return _.get(state, "items", {});
                },
                rules: state => {
                    const rules = _.get(state, "rules", []);
                    const items = _.get(state, "items", {});
                    return _.map(rules, rule => {
                        return {
                            ...rule,
                            affectedFeedsObj: _.map(rule.affectedFeeds, (url) => {
                                const item = _.find(items, {
                                    url
                                });
                                return {
                                    name: _.get(item, "name", "已删除"),
                                    url,
                                };
                            })
                        };
                    });
                }
            }),

            ...buildFormComputed({
                parent: "preferences",
                keys: rssSettingKeys,
            }),
            phoneLayout() {
                return this.$vuetify.breakpoint.xsOnly;
            },
            dialogWidth() {
                return this.phoneLayout ? "100%" : "80%";
            }
        },

        methods: {
            ...mapActions("rss", [
                "getAllItems",
                "removeItem",
                "refreshItem",
                "removeRule",
                "getAllRules"
            ]),
            ...mapActions(["setPreferences"]),
            saveSetting() {
                return this.setPreferences()
                    .then(() => {
                        this.$dialog.message.success("保存成功", {
                            position: "top",
                        });
                    });

            },
            refreshItemAction(...args) {
                this.refreshItem(...args)
                    .then(data => {
                        this.$dialog.message.success("刷新成功", {
                            position: "top",
                        });
                    });
            },
            remove(action, params) {
                this.$dialog.confirm({
                    text: "确认删除?",
                    title: "删除"
                }).then((confirm) => {
                    // debugger;
                    confirm && this[action](params);
                });
            },
            addTorrent(url) {
                this.$store.commit("dialogAction", {key: "add", value: true, params: {urls: [url]}});
            },
            closeDialog() {
                this.$emit("input", false);
            }
        },
        watch: {
            mTab(v) {
                this.$emit("change", v);
            }
        }
    });
</script>

<style lang="scss" scoped>
    ::v-deep .v-dialog {
    }

    .list {
        .action {
            display: flex;

            .v-btn {
                min-width: 0;

            }
        }
    }

    .torrentsPanel {
        .title {
            font-size: 28px;
        }

        .list {
            padding: 0 15px;

            .action {
                display: flex;
            }
        }

        .desc {
            display: flex;

            span {
                padding-right: 4px;
            }
        }

        .list_border {
            margin: 3px 0;
        }
    }

    .rules {
        display: block;

        ::v-deep .v-list__tile {
            height: 24px;
            padding: 0 10px !important;
        }

        ::v-deep .feeds_list {
            .v-list__tile {
                height: 60px;
            }

            .v-list__tile__content {
                flex: none;
            }

            .align-end {
                flex: 1;
                overflow: auto;
                justify-content: flex-start;
            }
        }

        .chip {
            display: flex;
            flex-wrap: wrap;
        }
    }

    .v-dialog--fullscreen {
        .v-card__text {
            padding-bottom: 52px;

        }

        .v-card__actions {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
</style>
