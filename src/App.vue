<template>
    <v-app ref="app">
        <v-navigation-drawer
                width="250"
                app
                :clipped="$vuetify.breakpoint.lgAndUp"
                v-model="drawer"
                class="drawer">
            <drawer v-model="drawerOptions"/>
            <template v-if="phoneLayout">
                <v-spacer/>
                <v-divider/>
                <v-expansion-panel class="drawer-footer" :value="1">
                    <v-expansion-panel-content lazy expand :value="[true]" @input="drawerFooterOpen">
                        <template v-slot:header>
                            <v-layout align-center>
                                <v-icon class="footer-icon shrink">mdi-information-outline</v-icon>
                                <span class="footer-title">状态信息</span>
                            </v-layout>
                        </template>
                        <app-footer phone-layout/>
                    </v-expansion-panel-content>
                    <div ref="end"/>
                </v-expansion-panel>
            </template>
        </v-navigation-drawer>
        <v-btn
                fab
                bottom
                color="primary"
                fixed
                left
                small
                @click="drawer = !drawer"
                class="btn-menu"
                :class="{'with-footer': $vuetify.breakpoint.smAndUp}"
        >
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-content>
            <torrents/>
        </v-content>

        <add-form v-if="preferences" :url="pasteUrl" @input="pasteUrl = null"/>
        <login-form v-if="needAuth" v-model="needAuth"/>
        <logs-dialog v-if="drawerOptions.showLogs" v-model="drawerOptions.showLogs"/>
        <Rss-Dialog v-if="drawerOptions.showRss" v-model="drawerOptions.showRss"/>
        <setting-Dialog v-if="drawerOptions.showSetting" v-model="drawerOptions.showSetting"/>

        <v-footer app height="auto" class="elevation-4" v-if="$vuetify.breakpoint.smAndUp">
            <app-footer/>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
    import Vue from "vue";
    import AddForm from "./components/AddForm.vue";
    import Drawer from "./components/Drawer.vue";
    import LoginForm from "./components/LoginForm.vue";
    import Torrents from "./components/Torrents.vue";
    import AppFooter from "./components/Footer.vue";
    import LogsDialog from "./components/dialogs/LogsDialog.vue";
    import RssDialog from "./components/dialogs/Rss.vue";
    import SettingDialog from "./components/dialogs/Setting.vue";
    import {mapActions, mapGetters, mapState, mapMutations} from "vuex";
    import {sleep} from "./utils";

    let appWrapEl = null;

    export default Vue.extend({
        name: "app",
        components: {
            AddForm,
            Drawer,
            LoginForm,
            Torrents,
            AppFooter,
            LogsDialog,
            RssDialog,
            SettingDialog,
        },
        data() {
            return {
                needAuth: false,
                drawer: true,
                drawerOptions: {
                    showLogs: false,
                    showRss: false,
                    showSetting: false,
                },
                pasteUrl: null,
                task: 0
            };
        },
        async created() {
            await this.getInitData();
            appWrapEl = this.$refs.app.$el.querySelector(".application--wrap");
            appWrapEl.addEventListener("paste", this.onPaste);
        },
        beforeDestroy() {
            if (this.task) {
                clearTimeout(this.task);
            }
            appWrapEl.removeEventListener("paste", this.onPaste);
        },
        computed: {
            ...mapState(["mainData", "rid", "preferences"]),
            ...mapGetters(["config"]),
            phoneLayout() {
                return this.$vuetify.breakpoint.xsOnly;
            }
        },
        methods: {
            ...mapActions(["getPreferences", "getAllData"]),
            async getInitData() {
                try {
                    await this.getMainData();
                } catch (e) {
                    if (e.response.status === 403) {
                        this.needAuth = true;
                    }

                    return;
                }
                await this.getPreferences();
            },
            async getMainData() {
                await this.getAllData();
                this.task = setTimeout(this.getMainData, this.config.updateInterval);
            },
            async drawerFooterOpen(v: boolean) {
                if (!v) {
                    return;
                }
                await sleep(350);

                this.$refs.end.scrollIntoView({
                    behavior: "smooth"
                });
            },
            onPaste(e: ClipboardEvent) {
                const text = e.clipboardData.getData("text");
                if (text) {
                    this.pasteUrl = text;
                }
            }
        },
        watch: {
            async needAuth(v) {
                if (!v) {
                    await this.getInitData();
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
    .drawer {
        display: flex;
        flex-direction: column;

        .drawer-footer {
            box-shadow: none;

            ::v-deep .v-expansion-panel__header {
                padding: 12px;
            }

            .footer-icon {
                font-size: 22px;
                margin-left: 10px;
                margin-right: 28px;
            }

            .footer-title {
                font-size: 13px;
                font-weight: 500;
            }
        }
    }
</style>
<style lang="scss">
    .small.v-btn {
        padding: 0 2px;
        min-width: 0;
        margin: 0 2px;
    }

    .v-list__tile__action {
        padding-right: 5px;
        min-width: 0;
    }

    .v-dialog {
        .v-card {
            max-height: 90vh;
            display: flex;
            flex-direction: column;

            .v-card__title, .v-card__actions {
                flex: none;
            }

            .v-card__text {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow-y: auto;

                .v-window {
                    flex: 1;
                    overflow-y: auto;

                    .v-list__tile {
                        padding: 0;

                        .v-list__tile__content {
                            &.label {
                                flex: none;
                            }

                            flex: 1;
                        }
                    }
                }
            }
        }
    }

    .v-btn.with-footer {
        margin-bottom: 36px;
    }

    .v-navigation-drawer .v-list {
        padding: 0;
    }
</style>
