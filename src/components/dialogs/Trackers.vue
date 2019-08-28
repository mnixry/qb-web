<template>
  <v-data-table
    :headers="headers"
    :items="trackers"
    :hide-actions="true"
  >
    <template v-slot:items="row">
      <td>{{ row.item.tier }}</td>
      <td>{{ row.item.url }}</td>
      <td>{{ row.item.status | formatTrackerStatus }}</td>
      <td>{{ row.item.num_peers | formatTrackerNum }}</td>
      <td>{{ row.item.num_seeds | formatTrackerNum }}</td>
      <td>{{ row.item.num_leeches | formatTrackerNum }}</td>
      <td>{{ row.item.num_downloaded | formatTrackerNum }}</td>
      <td>{{ row.item.msg }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '../../Api';
import Taskable from '@/mixins/taskable';

export default Vue.extend({
  mixins: [Taskable],

  props: {
    hash: String,
    isActive: Boolean,
  },
  data() {
    const headers = [
      { text: '#', value: 'tier' },
      { text: 'URL', value: 'url' },
      { text: '状态', value: 'status' },
      { text: '节点数', value: 'num_peers' },
      { text: '做种', value: 'num_seeds' },
      { text: '吸血者', value: 'num_leeches' },
      { text: '已下载', value: 'num_downloaded' },
      { text: '信息', value: 'msg' },
    ];

    return {
      headers,
      trackers: [],
    };
  },
  filters: {
    formatTrackerStatus(status: number) {
      const map = [
        '已关闭',
        '未连接',
        '工作',
        '更新中',
        '未工作',
      ];

      return map[status];
    },
    formatTrackerNum(num: number) {
      if (num === -1) {
        return 'N/A';
      }

      return num.toString();
    },
  },
  methods: {
    async getTracker() {
      this.trackers = await api.getTorrentTracker(this.hash);
      if (!this.isActive || this.destroy) {
        return;
      }

      this.task = setTimeout(this.getTracker, 5000);
    },
  },
  async created() {
    if (this.isActive) {
      await this.getTracker();
    }
  },
  watch: {
    async isActive(v) {
      if (v) {
        await this.getTracker();
      } else {
        this.cancelTask();
      }
    }
  },
});
</script>
