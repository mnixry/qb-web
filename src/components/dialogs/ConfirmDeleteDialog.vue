<template>
  <v-dialog :value="true" @input="closeDialog" :fullscreen="phoneLayout" width="40em">
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-delete</v-icon>
        <span>删除</span>
      </v-card-title>
      <v-card-text>
         确认删除选中的任务？
        <ol class="torrents pt-4">
          <li v-for="(row, i) in torrents" :key="i">
            {{ row.name }}
          </li>
        </ol>

        <v-checkbox
          v-model="deleteFiles"
          prepend-icon="mdi-file-cancel"
          label="同时删除文件"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click="closeDialog">取消</v-btn>
        <v-btn
          @click="submit"
          color="warning"
          :disabled="submitting"
          :loading="submitting"
        >
          删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/Api';

export default Vue.extend({
  props: {
    value: Array,
  },
  data() {
    return {
      deleteFiles: true,
      submitting: false,
      torrents: [],
    };
  },
  created() {
    this.torrents = this.value;
  },
  computed: {
    phoneLayout() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  methods: {
    closeDialog() {
      this.$emit('input', []);
    },
    async submit() {
      if (this.submitting) {
        return;
      }

      this.submitting = true;

      const hashed = this.torrents.map((t: any) => t.hash);
      await api.deleteTorrents(hashed, this.deleteFiles);

      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.torrents {
  overflow: auto;
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
