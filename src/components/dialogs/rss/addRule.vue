<template>
    <v-dialog v-model="show" persistent :width="dialogWidth" :fullscreen="phoneLayout">
        <template v-slot:activator="{ on }">
            <v-btn flat class="small" v-on="on">
                <v-icon >mdi-{{name?'pencil':'plus'}}</v-icon>
                {{name?"":"新增规则"}}
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">{{isEdit?'编辑规则':'新增规则'}}</span>
            </v-card-title>
            <v-card-text>
                <v-form>

                    <v-text-field
                            v-model="ruleName"
                            label="名称"
                            data-vv-name="名称"
                            :disabled="isEdit"
                            :error-messages="errors.collect('名称')"
                            v-validate="'required'"
                            required
                    ></v-text-field>


                    <v-checkbox
                            v-model="data.enabled"
                            label="是否开启"
                            type="checkbox"
                            data-vv-name="是否开启"
                    ></v-checkbox>
                    <v-text-field
                            v-model.number="data.ignoreDays"
                            type="number"
                            label="忽略天数"
                    ></v-text-field>

                    <v-text-field
                            v-model="data.mustContain"
                            label="必须包含"
                    ></v-text-field>

                    <v-text-field
                            v-model="data.mustNotContain"
                            label="不能包含"
                    ></v-text-field>


                    <v-checkbox
                            v-model="data.useRegex"
                            label="开启正则"
                            type="checkbox"
                    ></v-checkbox>
                    <v-checkbox
                            v-model="data.addPaused"
                            label="添加后暂停"
                            type="checkbox"
                    ></v-checkbox>

                    <v-combobox
                            label="分类"
                            v-model="data.assignedCategory"
                            prepend-icon="mdi-folder"
                            clearable
                            hide-no-data
                            :items="categories"
                    />
                    <v-text-field
                            v-model="data.savePath"
                            label="保存路径"
                    ></v-text-field>
                    <v-select
                            v-model="data.affectedFeeds"
                            :items="items"
                            chips
                            multiple
                            label="数据源"
                    ></v-select>

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
                isEdit: !!this.name,
                ruleName: this.name,
                data: {
                    ..._.get(this,'rule',{})
                }
            };
        },
        props: {
            name: String,
            rule: Object,
        },

        computed: {
            ...mapState('rss',{
                items: state => {
                    const items = _.get(state,"items",{});
                    return _.map(items,(item,key)=>{
                        return {
                            text:key,
                            value:item.url
                        }
                    });
                },
                rules: state => _.get(state, "rules", {}),

            }),
            ...mapState({
                prefs: (state: any) => state.preferences,
                categories(state, getters) {
                    return getters.allCategories.map(c=>c.key)
                },
            }),
            phoneLayout() {
                return this.$vuetify.breakpoint.xsOnly;
            },
            dialogWidth() {
                return this.phoneLayout ? "100%" : "80%";
            },

        },
        methods: {
            ...mapActions(["setRule", "renameRule"]),

            validate() {
                this.$validator.validateAll().then((valid) => {
                    if(valid){
                        // console.log({
                        //     name:this.ruleName,
                        //     rule:this.data
                        // });
                        return this.setRule({
                            name:this.ruleName,
                            rule:this.data
                        })
                    }
                    throw '验证错误'
                }).then(()=>{
                    this.closeDialog()
                });
            },
            closeDialog() {
                // this.data={};
                this.show = false
            }
        }
    });
</script>

<style lang="scss" scoped>
    .button {
        min-width: 0;
        padding-left: 10px;
    }
</style>
