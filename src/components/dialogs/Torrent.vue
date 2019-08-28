<template>
  <v-layout row wrap class="torrentInfo">
    <v-flex xs12 class="item">
      <label for>名称</label>
      <span>{{torrent.name}}</span>
    </v-flex>
    <v-flex xs12 class="item">
      <label for>保存地址</label>
      <span>{{torrent.save_path}}</span>
    </v-flex>
    <v-flex xs12>
      <v-subheader>传输</v-subheader>
    </v-flex>
    <v-flex xs4 class="item">
      <label for>分类</label>
      <span>{{torrent.category}}</span>
    </v-flex>

    <v-flex xs4 class="item">
      <label for>状态</label>
      <span>{{torrent.state | torrentStatus}}</span>
    </v-flex>
    <v-flex xs4 class="item">
      <label for>总大小</label>
      <span>{{torrent.total_size | formatSize}}</span>
    </v-flex>
    <v-flex xs4 class="item">
      <label for>添加时间</label>
      <span>{{torrent.added_on | formatTimestamp}}</span>
    </v-flex>
    <v-flex xs4 class="item">
      <label for>完成时间</label>
      <span>{{torrent.completion_on | formatTimestamp}}</span>
    </v-flex>
    <v-flex xs4 class="item">
      <label for>剩余时间</label>
      <span>{{torrent.eta | formatDuration({dayLimit: 100}) }}</span>
    </v-flex>

    <v-flex xs4 class="item">
      <label for>自动管理</label>
      <span>{{torrent.auto_tmm | boolean}}</span>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { api } from "../../Api";
import Taskable from "@/mixins/taskable";

export default Vue.extend({
  mixins: [Taskable],

  props: {
    torrent: Object
  },
  data() {
    return {};
  },
  filters: {},
  methods: {},
  async created() {},
  watch: {}
});
</script>
<style lang="scss" scoped>
.torrentInfo {
  padding-top: 20px;
  .item {
    label {
      &::after {
        content: "：";
      }
    }
  }
}
</style>
