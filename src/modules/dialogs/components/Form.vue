<template>
    <div>
        <DialogCard
                :title="title"
                :actions="actions"
                :handle="handleClick"
                ref="card"
        >

            <template v-for="(item,index) in items">
                <v-text-field
                        :key="item.key"
                        :ref="item.key"
                        v-if="item.type === 'input'"
                        v-model="formValues[item.key]"
                        :label="item.name"
                />
            </template>
        </DialogCard>
    </div>
</template>

<script>

    import Confirmable from 'vuedl/src/mixins/confirmable'
    import DialogCard from './DialogCard.vue'

    export default {
        components: {
            DialogCard
        },
        layout: 'default',
        mixins: [Confirmable],
        props: {
            value: String,
            forms: Array
        },
        computed: {
            items() {
                return _.map(this.forms, (item) => {
                    return {
                        type: 'input',
                        ...item
                    }
                })
            }
        },
        data() {
            return {
                formValues: _.reduce(this.forms, (result, item) => {
                    return {
                        ...result,
                        [item.key]: item.value
                    }
                }, {})
            }
        },
        mounted() {
            setTimeout(() => {
                const ref = _.get(this.items, [0, 'key']);
                ref && this.$refs[ref][0].focus()
            }, 100)
        },
        methods: {
            handleClick(res, action) {
                this.$emit('submit', action.key ? this.formValues : action.key)
                return false
            }
        }
    }
</script>
