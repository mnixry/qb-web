<template>
    <v-list dense expand>
        <template v-for="item in items">

            <v-list-group
                    v-if="item.children"
                    :key="item.text"
                    v-model="item.model"
                    :prepend-icon="item.model ? item.icon : item['icon-alt']"
                    append-icon
            >
                <template v-slot:activator>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
                <v-list-tile
                        v-for="(child, i) in item.children"
                        :key="i"
                        @click="item.click ? item.click(child.value) : null"
                >
                    <v-list-tile-action v-if="child.icon">
                        <v-icon>{{ child.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
            <template v-else-if="item.filterGroups">
                <filter-group v-for="(child, i) in item.filterGroups" :key="i" :group="child"/>
            </template>
            <v-list-tile v-else :key="item.text" @click="item.click ? item.click() : null">
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
    </v-list>
</template>

<script lang="ts">
    import _ from "lodash";
    import Vue from "vue";
    import FilterGroup from "./drawer/FilterGroup.vue";
    import {api} from "../Api";
    import {mapState, mapMutations, mapGetters} from "vuex";
    import {formatSize} from "../filters";
    import {SiteMap, StateType, AllStateTypes} from "../consts";

    const stateList = [
        {
            title: "下载中",
            state: StateType.Downloading,
            icon: "download"
        },
        {
            title: "做种中",
            state: StateType.Seeding,
            icon: "upload"
        },
        {
            title: "已完成",
            state: StateType.Completed,
            icon: "check"
        },
        {
            title: "已恢复",
            state: StateType.Resumed,
            icon: "play"
        },
        {
            title: "已暂停",
            state: StateType.Paused,
            icon: "pause"
        },
        {
            title: "活动中",
            state: StateType.Active,
            icon: "filter"
        },
        {
            title: "非活动",
            state: StateType.Inactive,
            icon: "filter-outline"
        },
        {
            title: "错误",
            state: StateType.Errored,
            icon: "alert"
        }
    ];

    export default {
        components: {
            FilterGroup
        },

        props: {
            value: Object
        },

        data() {
            return {
                basicItems: null,
                endItems: null
            };
        },

        created() {
            this.endItems = [
                {icon: "mdi-settings", text: "设置", click: () => this.updateOptions("showSetting", true)},
                {
                    icon: "mdi-delta",
                    text: "日志",
                    click: () => this.updateOptions("showLogs", true)
                },
                {
                    icon: "mdi-rss",
                    text: "RSS",
                    click: () => this.updateOptions("showRss", true)
                },
                {icon: "mdi-history", text: "切换至原生UI", click: this.switchUi},
            ];
        },

        computed: {
            ...mapGetters([
                "isDataReady",
                "allTorrents",
                "torrentGroupBySite",
                "torrentGroupByState"
            ]),
            ...mapGetters("tag", [
                "torrentGroupByTag",
                "allTags"
            ]),
            ...mapGetters("category", [
                "allCategories",
                "torrentGroupByCategory",
            ]),
            items() {
                if (!this.isDataReady) {
                    return this.endItems;
                }

                const filterGroups = [];
                const totalSize = formatSize(_.sumBy(this.allTorrents, "size"));

                const states = stateList.map(item => {
                    let value = this.torrentGroupByState[item.state];
                    if (_.isUndefined(value)) {
                        value = [];
                    }
                    const size = formatSize(_.sumBy(value, "size"));
                    const title = item.title + ` (${value.length})`;
                    const append = `[${size}]`;
                    return {icon: "mdi-" + item.icon, title, key: item.state, append};
                });
                filterGroups.push({
                    icon: "mdi-menu-up",
                    "icon-alt": "mdi-menu-down",
                    title: "状态",
                    model: true,
                    select: "state",
                    children: [
                        {
                            icon: "mdi-filter-remove",
                            title: `所有 (${this.allTorrents.length})`,
                            key: null,
                            append: `[${totalSize}]`
                        },
                        ...states
                    ]
                });

                const categories: any[] = [
                    {
                        key: "",
                        name: "未分类"
                    }
                ]
                    .concat(this.allCategories)
                    .map(category => {
                        let value = this.torrentGroupByCategory[category.key];
                        if (_.isUndefined(value)) {
                            value = [];
                        }
                        const size = formatSize(_.sumBy(value, "size"));
                        const title = category.name + ` (${value.length})`;
                        const append = `[${size}]`;
                        return {icon: "mdi-folder-open", title, key: category.key, savePath: category.savePath, append};
                    });
                filterGroups.push({
                    icon: "mdi-menu-up",
                    "icon-alt": "mdi-menu-down",
                    title: "分类",
                    model: !this.$vuetify.breakpoint.xsOnly,
                    select: "category",
                    action: [{
                        title: "添加分类",
                        show: () => true,
                        action: async (item) => {
                            let res = await this.$dialog.form({
                                title: "添加分类",
                                forms: [{
                                    key: "name",
                                    name: "分类名称"

                                }, {
                                    key: "path",
                                    name: "保存路径"
                                }]
                            });
                            if (res) {
                                this.$store.dispatch("category/createCategory", res);
                            }
                        },
                    }, {
                        title: "编辑分类",
                        show: ({key}) => !!key,
                        action: async (item) => {
                            let res = await this.$dialog.prompt({
                                text: `请输入分类 ${item.key} 保存地址`,
                                title: "编辑分类",
                                value: item.savePath
                            });
                            if (res) {
                                this.$store.dispatch("category/editCategory", {
                                    name: item.key,
                                    path: res
                                });
                            }
                        },
                    }, {
                        title: "删除分类",
                        show: ({key}) => !!key,
                        action: (item) => {
                            this.$dialog.confirm({
                                text: `确定删除 ${item.key} ?`,
                                title: "删除分类",
                                actions: {
                                    false: "取消",
                                    true: {
                                        color: "red",
                                        text: "确定",
                                        handle: () => {
                                            this.$store.dispatch("category/removeCategories", {
                                                name: item.key
                                            });
                                        }
                                    }
                                }
                            });

                        }
                    }],
                    children: categories
                });

                const tags: any[] = _.map(["", ...this.allTags], tag => {
                    let value = this.torrentGroupByTag[tag];
                    if (_.isUndefined(value)) {
                        value = [];
                    }
                    const size = formatSize(_.sumBy(value, "size"));
                    const title = `${tag ? tag : "无标签"} (${value.length})`;
                    const append = `[${size}]`;
                    return {icon: "mdi-tag", title, key: tag, append};
                });

                filterGroups.push({
                    icon: "mdi-menu-up",
                    "icon-alt": "mdi-menu-down",
                    title: "标签",
                    model: !this.$vuetify.breakpoint.xsOnly,
                    select: "tag",
                    action: [{
                        title: "添加标签",
                        show: ({key}) => !key,
                        action: async (item) => {
                            this.$dialog.form({
                                title: "添加标签",
                                forms: [{
                                    key: "tags",
                                    name: "标签名称"
                                }]
                            }).then(r => {
                                r && this.$store.dispatch("tag/createTags", r);
                            })
                        },
                    }, {
                        title: "删除标签",
                        show: ({key}) => !!key,
                        action: (item) => {
                            this.$dialog.confirm({
                                text: `确定删除 ${item.key} ?`,
                                title: "删除标签",
                            }).then(r => {
                                r && this.$store.dispatch("tag/deleteTags", {
                                    tags: [item.key]
                                });
                            });

                        }
                    }],
                    children: [
                        {
                            icon: "mdi-tag",
                            title: `所有 (${this.allTorrents.length})`,
                            key: null,
                            append: `[${totalSize}]`
                        },
                        ...tags
                    ]
                });
                const sites: any[] = _.sortBy(
                    Object.entries(this.torrentGroupBySite).map(([key, value]: any[]) => {
                        const size = formatSize(_.sumBy(value, "size"));
                        const site = (SiteMap as any)[key];
                        const title =
                            (site ? site.name : key ? key : "Others") + ` (${value.length})`;
                        const icon = _.defaultTo(site ? site.icon : null, "mdi-server");
                        const append = `[${size}]`;
                        return {icon, title, key, append};
                    }),
                    "title"
                );
                filterGroups.push({
                    icon: "mdi-menu-up",
                    "icon-alt": "mdi-menu-down",
                    title: "站点",
                    model: false,
                    select: "site",
                    children: sites
                });

                return _.concat([{filterGroups}], this.endItems);
            }
        },

        methods: {
            async switchUi() {
                await api.switchToOldUi();

                location.reload(true);
            },
            updateOptions(key: string, value: any) {
                this.$emit("input", Object.assign({}, this.value, {[key]: value}));
            }
        }
    };
</script>

<style lang="scss" scoped>
    .v-list__tile__action {
        padding-left: 6px;
    }
</style>
