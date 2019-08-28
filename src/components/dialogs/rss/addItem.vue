<template>
    <v-dialog v-model="show" persistent :width="dialogWidth" :fullscreen="phoneLayout">
        <template v-slot:activator="{ on }">
            <v-btn flat class="small" v-on="on">
                <v-icon class="">mdi-{{name?'pencil':'plus'}}</v-icon>
                {{name?"":"新增站点"}}
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">{{isEdit?'编辑站点':'新增站点'}}</span>
            </v-card-title>
            <v-card-text>
                <v-form>

                    <v-text-field
                            v-model="data.name"
                            label="名称"
                            data-vv-name="名称"
                            :error-messages="errors.collect('名称')"
                            v-validate="'required'"
                            required
                    ></v-text-field>
                    <v-text-field
                            v-model="data.url"
                            label="URL"
                            data-vv-name="URL"
                            :error-messages="errors.collect('URL')"
                            :disabled="isEdit"
                            v-validate="'required'"
                            required
                    ></v-text-field>


                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn :disabled="!valid"
                       color="success"
                       @click="validate">
                    保存
                </v-btn>

                <v-btn @click="closeDialog">取消</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script lang="ts">
    import _ from "lodash";
    import Vue from "vue";
    import {api} from "@/Api";
    import {mapActions, mapGetters, mapState, mapMutations} from "vuex";

    export default Vue.extend({

        components: {},
        data() {
            return {
                show: false,
                valid: true,
                isEdit: !!this.url,
                data: {
                    name: this.name || "",
                    url: this.url || ""
                },
            };
        },
        props: {
            name: String,
            url: String
        },

        computed: {
            ...mapState('rss',{
                items: state => {
                    return _.get(state, "items", {});
                },
                rules: state => _.get(state, "rules", {})
            }),
            phoneLayout() {
                return this.$vuetify.breakpoint.xsOnly;
            },
            dialogWidth() {
                return this.phoneLayout ? "100%" : "80%";
            }
        },
        methods: {
            ...mapActions('rss',["addItem", "renameItem"]),
            validate() {
                this.$validator.validateAll().then((valid) => {
                    if(valid){
                        return this.isEdit?this.renameItem({name:this.name,newName:this.data.name}):
                            this.addItem(this.data)
                    }
                    throw '验证错误'
                }).then(()=>{
                    this.closeDialog()
                });
            },
            closeDialog() {
                this.show = false
            }
        }
    });
</script>

<style lang="scss" scoped>
    .button {
        min-width: 0;
    }
</style>
