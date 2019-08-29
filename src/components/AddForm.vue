<template>
    <div>
        <v-btn
                fab
                bottom
                color="primary"
                fixed
                right
                small
                @click="open"
                class="btn-add"
                :class="{'with-footer': $vuetify.breakpoint.smAndUp}"
        >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-dialog :value="dialog" persistent width="50em">
            <v-card>
                <v-card-title
                        class="headline grey lighten-4"
                >
                    <v-icon class="mr-2">mdi-plus</v-icon>
                    <span>添加种子</span>
                </v-card-title>
                <v-card-text>
                    <v-form
                            v-model="valid"
                            ref="form"
                    >
                        <v-container pa-0 v-bind="{ [`grid-list-${$vuetify.breakpoint.name}`]: true }">
                            <v-layout wrap>
                                <v-flex
                                        xs12
                                        ref="fileZone"
                                >
                                    <div
                                            v-show="files.length"
                                            class="files grey lighten-4 align-center justify-space-between subheading font-weight-medium pl-2"
                                            @click="selectFiles"
                                    >
                                        <input ref="file" type="file" multiple class="d-none" @change="onFilesChanged">
                                        <span v-if="files.length == 1">已选择文件: {{ files[0].name }}</span>
                                        <span v-else>选择了 {{ files.length }} 个文件.</span>
                                        <v-btn icon @click.stop="files = []">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </div>
                                    <v-textarea
                                            v-show="!files.length"
                                            label="链接"
                                            hint="一行一个链接"
                                            :placeholder="'将种子拖放到此,或者选择种子.'"
                                            prepend-icon="mdi-link"
                                            append-outer-icon="mdi-attachment"
                                            :rules="[v => (!!files.length || !!v || '链接为必填项')]"
                                            :rows="$vuetify.breakpoint.xsOnly ? 1 : 3"
                                            required
                                            autofocus
                                            :value="params.urls"
                                            @input="setParams('urls', $event)"
                                            @click:append-outer="selectFiles"
                                    />
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                            prepend-icon="mdi-folder"
                                            label="下载路径"
                                            :value="params.savepath"
                                            @input="setParams('savepath', $event)"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-combobox
                                            label="分类"
                                            prepend-icon="mdi-folder"
                                            clearable
                                            hide-no-data
                                            :items="categories"
                                            :input-value="params.category"
                                            @input="setParams('category', $event)"
                                    />
                                </v-flex>
                                <v-flex>
                                    <v-checkbox
                                            v-model="autoStart"
                                            label="开始下载"
                                            prepend-icon="mdi-play-pause"
                                    />
                                </v-flex>
                                <v-flex>
                                    <v-checkbox
                                            label="自动管理"
                                            :input-value="!!params.useAutoTMM"
                                            @change="setParams('useAutoTMM', $event)"
                                            prepend-icon="mdi-brightness-auto"
                                    />
                                </v-flex>
                                <v-flex>
                                    <v-checkbox
                                            prepend-icon="mdi-progress-check"
                                            label="跳过hash检查"
                                            :input-value="!!params.skip_checking"
                                            @change="setParams('skip_checking', $event)"
                                    />
                                </v-flex>
                                <v-flex>
                                    <v-checkbox
                                            prepend-icon="mdi-folder"
                                            label="创建文件夹"
                                            :value="!!params.root_folder"
                                            @change="setParams('root_folder', $event)"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                    <v-alert
                            type="warning"
                            :value="error"
                            v-text="error"
                    />
                </v-card-text>
                <v-card-actions>
                    <!-- <v-btn flat>More</v-btn> -->
                    <v-spacer/>
                    <v-btn flat @click="close">取消</v-btn>
                    <v-btn
                            flat
                            @click="submit"
                            color="primary"
                            :disabled="!valid"
                            :loading="submitting"
                    >
                        添加
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import _ from "lodash";
    import Vue from "vue";
    import {mapState,mapGetters} from "vuex";
    import {api} from "../Api";

    const defaultParams = {
        urls: null,
        category: null,
        paused: false,
        useAutoTMM: true,
        skip_checking: false,
        root_folder: false,
        savepath: "",
    };

    export default Vue.extend({
        props: {
            url: String,
        },

        data() {
            return {
                // dialog: false,
                valid: false,
                files: [],
                userParams: {},
                error: null,
                submitting: false,
            };
        },
        computed: {
            ...mapState({
                dialog: state => {
                    return _.get(state, "dialogs.add.open");
                },
                initParams: state => {
                    return _.get(state, "dialogs.add.params", {});
                },
                prefs: (state: any) => state.preferences,

            }),
            ...mapState('category',{
                categories(state, getters) {
                    return getters.allCategories.map(c=>c.key)
                },
            }),
            params() {
                const perf = {
                    paused: this.prefs.start_paused_enabled,
                    savepath: this.prefs.save_path,
                    root_folder: !!this.prefs.create_subfolder_enabled
                };
                return Object.assign({}, defaultParams, perf, this.initParams, this.userParams);
            },
            autoStart: {
                get(): boolean {
                    return !this.params.paused;
                },
                set(value: boolean) {
                    const paused = !value;
                    const tmp = defaultParams.paused === paused ? null : paused;
                    this.setParams("paused", tmp);
                },
            },
        },
        mounted() {
            this.userParams = this.initParams;
            this.$refs.fileZone.addEventListener("drop", this.onDrop, true);
        },
        beforeDestroy() {
            this.$refs.fileZone.removeEventListener("drop", this.onDrop, true);
        },

        methods: {
            open(params = {}) {
                this.$store.commit("dialogAction", {key: "add", value: true, params});
            },
            close() {
                this.userParams={};
                this.files = [];
                this.$store.commit("dialogAction", {key: "add", value: false});
            },
            setParams(key: string, value: any) {
                if (_.isNil(value)) {
                    Vue.delete(this.userParams, key);
                } else {

                    Vue.set(this.userParams, key, value);
                }
            },
            async submit() {
                if (this.submitting) {
                    return;
                }
                let params = this.params;

                this.submitting = true;
                this.error = null;
                let files;
                if (this.files.length) {
                    files = this.files;
                    Vue.delete(params, "urls");
                } else {
                    files = null;
                }

                try {
                    const resp = await api.addTorrents(params, files);

                    if (resp !== "Ok.") {
                        this.error = resp;
                    }
                } catch (e) {
                    this.error = e.message;
                }

                this.submitting = false;

                if (this.error) {
                    return;
                }

                this.close();

                // Vue.delete(this.userParams, 'urls');

                this.$refs.form.resetValidation();
            },
            selectFiles() {
                this.$refs.file.click();
            },
            onFilesChanged() {
                this.files = this.$refs.file.files;
            },
            onDrop(e: DragEvent) {
                const transfer = e.dataTransfer!;
                const files = transfer.files;
                if (!files.length) {
                    return;
                }

                e.preventDefault();
                this.files = files;
            },
        },

        watch: {
            url(v) {
                if (!v) {
                    return;
                }

                if (!this.dialog) {
                    // Vue.set(this.userParams, "urls", v);
                    this.open({urls: v});
                }

                this.$emit("input", null);
            },
            files(v) {
                this.$refs.form.validate();
            },
        },
    });
</script>

<style lang="scss" scoped>


    .files {
        display: flex;
        height: 3em;

        border: 1px dashed;
        border-color: grey !important;
        border-radius: 2px;
    }
</style>
