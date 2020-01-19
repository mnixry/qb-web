<template>
  <v-container fluid v-class:phone-layout="$vuetify.breakpoint.xsOnly">
    <v-layout column v-show="hasSelected" class="toolbar">
      <v-toolbar flat dense color="white" height="56px">
        <v-checkbox
          class="shrink menu-check"
          :input-value="hasSelected"
          :indeterminate="!hasSelectedAll"
          primary
          hide-details
          @click.stop="selectedRows = []"
        ></v-checkbox>
        <v-btn icon @click="confirmDelete" title="删除">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="resumeTorrents" title="恢复">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon @click="pauseTorrents" title="暂停">
          <v-icon>mdi-pause</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn
          icon
          @click="showInfo()"
          title="信息"
          v-if="selectedRows.length <= 4"
        >
          <v-icon>mdi-alert-circle</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="分类">
              <v-icon>mdi-folder-open</v-icon>
            </v-btn>
          </template>
          <v-list class="category-actions">
            <v-subheader @click.stop>设置分类</v-subheader>
            <v-list-tile
              v-for="(item, i) in allCategories"
              :key="i"
              @click="setTorrentsCategory(item.key)"
            >
              <v-list-tile-action>
                <v-icon>mdi-folder-open</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile @click="setTorrentsCategory('')">
              <v-list-tile-action>
                <v-icon>mdi-folder-remove</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>重置</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu offset-y :max-height="500">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="标签">
              <v-icon>mdi-tag</v-icon>
            </v-btn>
          </template>
          <v-list class="tag-actions">
            <v-subheader @click.stop="addTorrentsTag"
              ><v-btn flat>新增标签</v-btn></v-subheader
            >
            <v-divider />
            <v-list-tile
              v-for="(item, i) in allTags"
              :key="i"
              @click="setTorrentsTag(item)"
            >
              <v-list-tile-action>
                <v-icon>mdi-folder-open</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile @click="removeTorrentsTag()">
              <v-list-tile-action>
                <v-icon>mdi-folder-remove</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>重置</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="设置自动管理">
              <v-icon>mdi-brightness-auto</v-icon>
            </v-btn>
          </template>
          <v-list class="auto-actions">
            <v-subheader @click.stop>设置自动管理</v-subheader>
            <v-list-tile
              v-for="(item, i) in [true, false]"
              :key="i"
              @click="setTorrentsAutomatic(item)"
            >
              <v-list-tile-action>
                <v-icon>mdi-{{ item ? "check" : "window-close" }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{
                  item ? "开启" : "关闭"
                }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-divider vertical inset />

        <v-btn icon @click="setLocation" title="修改保存路径">
          <v-icon>mdi-folder-edit-outline</v-icon>
        </v-btn>
        <v-btn icon @click="editTrackers" title="批量修改tracker">
          <v-icon>mdi-server</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="reannounceTorrents" title="强制更新tracker">
          <v-icon>mdi-bullhorn</v-icon>
        </v-btn>
        <v-btn icon @click="recheckTorrents" title="强制检查hash">
          <v-icon>mdi-backup-restore</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
    </v-layout>

    <v-layout column>
      <v-data-table
        :headers="headers"
        :items="torrents"
        item-key="hash"
        :hide-actions="torrents.length <= pagination.rowsPerPage"
        v-class:hide-headers="hasSelected"
        select-all
        :pagination.sync="pagination"
        v-model="selectedRows"
        class="table"
      >
        <template v-slot:items="row">
          <td>
            <v-checkbox v-model="row.selected" hide-details />
          </td>
          <td
            :title="row.item.name"
            :class="['icon-label', { auto_tmm: row.item.auto_tmm }]"
            @dblclick.prevent="showInfo(row.item)"
          >
            <v-icon :color="row.item.state | stateColor">{{
              row.item.state | stateIcon
            }}</v-icon>
            {{ row.item.name }}
          </td>
          <td>{{ row.item.size | formatSize }}</td>
          <td>
            {{ row.item.progress | progress }}
          </td>
          <td>{{ row.item.state | torrentStatus }}</td>
          <td>{{ row.item.num_seeds }}/{{ row.item.num_complete }}</td>
          <td>{{ row.item.num_leechs }}/{{ row.item.num_incomplete }}</td>
          <td>{{ row.item.dlspeed | formatNetworkSpeed }}</td>
          <td>{{ row.item.upspeed | formatNetworkSpeed }}</td>
          <td>{{ row.item.uploaded | formatSize }}</td>
          <td>{{ row.item.category }}</td>
          <td>{{ row.item.eta | formatDuration({ dayLimit: 100 }) }}</td>
          <td>{{ row.item.ratio.toFixed(2) }}</td>
          <td>
            <span :title="row.item.added_on | formatTimestamp">{{
              row.item.added_on | formatTimestamp
            }}</span>
          </td>
          <td>
            <span :title="row.item.completion_on | formatTimestamp">{{
              row.item.completion_on | formatTimestamp
            }}</span>
          </td>
        </template>
      </v-data-table>
    </v-layout>

    <confirm-delete-dialog v-if="toDelete.length" v-model="toDelete" />
    <info-dialog
      v-if="toShowInfo.length"
      v-model="toShowInfo"
      :tab="infoTab"
      @change="infoTab = $event"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog.vue";
import InfoDialog from "./dialogs/InfoDialog.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import _ from "lodash";
import { api } from "../Api";
import { formatSize, formatDuration } from "../filters";
import { torrentIsState } from "../utils";
import { StateType } from "../consts";

function getStateInfo(state: string) {
  let icon;
  switch (state) {
    case "metaDL":
    case "allocating":
    case "downloading":
    case "forcedDL":
      icon = {
        icon: "download",
        color: "info"
      };
      break;
    case "uploading":
    case "forcedUP":
      icon = {
        icon: "upload",
        color: "info"
      };
      break;
    case "stalledDL":
      icon = {
        icon: "download",
        color: null
      };
      break;
    case "stalledUP":
      icon = {
        icon: "upload",
        color: null
      };
      break;
    case "pausedDL":
      icon = {
        icon: "pause",
        color: "warning"
      };
      break;
    case "pausedUP":
      icon = {
        icon: "check",
        color: null
      };
      break;
    case "queuedDL":
    case "queuedUP":
      icon = {
        icon: "timer-sand",
        color: "info"
      };
      break;
    case "checkingDL":
    case "checkingUP":
    case "queuedForChecking":
    case "checkingResumeData":
    case "moving":
      icon = {
        icon: "backup-restore",
        color: "info"
      };
      break;
    case "error":
    case "unknown":
    case "missingFiles":
      icon = {
        icon: "alert",
        color: "error"
      };
      break;
    default:
      throw state;
      break;
  }

  return icon;
}

export default Vue.extend({
  name: "torrents",

  components: {
    ConfirmDeleteDialog,
    InfoDialog
  },

  data() {
    const headers = [
      { text: "名称", value: "name", width: "auto", class: "th-name" },
      { text: "大小", value: "size", width: "54px" },
      { text: "进度", value: "progress" },
      { text: "状态", value: "state" },
      { text: "做种", value: "num_complete" },
      { text: "下载", value: "num_incomplete" },
      { text: "下载速度", value: "dlspeed" },
      { text: "上传速度", value: "upspeed" },
      { text: "已上传", value: "uploaded" },
      { text: "分类", value: "category" },
      { text: "剩余时间", value: "eta" },
      { text: "分享率", value: "ratio" },
      { text: "添加时间", value: "added_on" },
      { text: "完成时间", value: "completion_on" }
    ];

    return {
      headers,
      selectedRows: [],
      toDelete: [],
      toShowInfo: [],
      infoTab: null,
      pagination: null
    };
  },

  created() {
    this.pagination = this.$store.getters.config.pagination;
  },

  computed: {
    ...mapGetters([
      "isDataReady",
      "allTorrents",
      "torrentGroupBySite",
      "torrentGroupByState"
    ]),
    ...mapGetters("category", ["allCategories", "torrentGroupByCategory"]),
    ...mapState({
      prefs: (state: any) => state.preferences,
      filter(state, getters) {
        return getters.config.filter;
      }
    }),

    ...mapGetters("tag", ["allTags", "torrentGroupByTag"]),
    hasSelected() {
      return this.selectedRows.length;
    },
    selectedHashes() {
      return this.selectedRows.map(_.property("hash"));
    },
    torrents() {
      if (!this.isDataReady) {
        return [];
      }
      let list = this.allTorrents;
      if (this.filter.site !== null) {
        list = _.intersection(list, this.torrentGroupBySite[this.filter.site]);
      }
      if (this.filter.category !== null) {
        list = _.intersection(
          list,
          this.torrentGroupByCategory[this.filter.category]
        );
      }
      if (this.filter.state !== null) {
        list = _.intersection(
          list,
          this.torrentGroupByState[this.filter.state]
        );
      }
      if (this.filter.tag !== null) {
        list = _.intersection(list, this.torrentGroupByTag[this.filter.tag]);
      }

      return list;
    },
    hasSelectedAll() {
      return (
        this.hasSelected &&
        this.selectedRows.length ===
          Math.min(this.torrents.length, this.pagination.rowsPerPage)
      );
    }
  },

  filters: {
    progressColorClass(progress: number) {
      const color = progress >= 0.5 ? "white" : "black";
      return color + "--text";
    },
    formatNetworkSpeed(speed: number) {
      if (speed === 0) {
        return null;
      }

      return formatSize(speed) + "/s";
    },
    stateIcon(state: string) {
      const item = getStateInfo(state);
      return "mdi-" + item.icon;
    },
    stateColor(state: string, isProgress?: boolean) {
      const item = getStateInfo(state);
      if (!isProgress) {
        return item.color;
      }

      return item.color || "#0008";
    }
  },

  methods: {
    ...mapMutations(["updateConfig"]),
    ...mapActions("tag", ["addTags", "removeTags"]),
    confirmDelete() {
      this.toDelete = this.selectedRows;
    },
    showInfo(row?: any) {
      this.toShowInfo = row ? [row] : this.selectedRows;
    },
    async resumeTorrents() {
      await api.resumeTorrents(this.selectedHashes);
    },
    async setLocation() {
      const save_path = _.get(
        this.selectedRows,
        [0, "save_path"],
        this.prefs.save_path
      );
      this.$dialog
        .prompt({
          text: `请输入保存路径`,
          title: "修改保存路径",
          value: save_path
        })
        .then(res => {
          res &&
            api.action("torrents/setLocation", {
              hashes: this.selectedHashes,
              location: res
            });
        });
    },
    async editTrackers() {
      const selectedRows = this.selectedRows;
      this.$dialog
        .form({
          title: "批量修改tracker",
          forms: [
            {
              key: "reg",
              name: "需要替换的部分(支持正则)"
            },
            {
              key: "to",
              name: "替换为"
            }
          ]
        })
        .then(async res => {
          if (res) {
            let replaceAll;
            if (res.reg && /^https?/.test(res.reg)) {
              replaceAll = true;
            }
            const regex = new RegExp(replaceAll ? ".*" : res.reg);
            const items = _.chain(selectedRows)
              .map(({ tracker, hash, name }) => {
                const newUrl = !replaceAll
                  ? tracker.replace(regex, res.to || "")
                  : res.to;
                return newUrl === tracker
                  ? null
                  : {
                      name,
                      hash,
                      origUrl: replaceAll ? res.reg : tracker,
                      newUrl
                    };
              })
              .compact()
              .value();
            if (items.length) {
              const isChange = await this.$dialog.confirm({
                title: `共有${items.length}个符合条件的种子`,
                text: `<p>${items
                  .map((item, index) => `${index + 1}. ${item.name}`)
                  .join("</p><p>")}</p>`,
                width: 500,
                waitForResult: true
              });
              const result = (isChange ? items : []).reduce(
                async (promise, item) => {
                  await promise;
                  const { hash, origUrl, newUrl } = item;
                  return api
                    .action("torrents/editTracker", {
                      hash,
                      origUrl,
                      newUrl
                    })
                    .then(data => data)
                    .catch(err => {
                      return err;
                    });
                },
                Promise.resolve()
              );
            }
          }
        });
    },
    async pauseTorrents() {
      await api.pauseTorrents(this.selectedHashes);
    },
    async reannounceTorrents() {
      await api.reannounceTorrents(this.selectedHashes);
    },
    async recheckTorrents() {
      this.$dialog.confirm({
        text: `确定重新检查?`,
        title: "重新检查",
      }).then(r => {
        if(r){
          return api.recheckTorrents(this.selectedHashes)
        }
      })
    },
    async setTorrentsCategory(category: string) {
      await api.setTorrentsCategory(this.selectedHashes, category);
    },
    async addTorrentsTag() {
      this.$dialog
        .form({
          title: "添加标签",
          forms: [
            {
              key: "tags",
              name: "标签名称"
            }
          ]
        })
        .then(r => {
          r && this.addTags({ hashes: this.selectedHashes, tags: r.tags });
        });
    },
    async setTorrentsTag(tag: string) {
      await this.addTags({ hashes: this.selectedHashes, tags: [tag] });
    },
    async removeTorrentsTag(tag: string) {
      await this.removeTags({ hashes: this.selectedHashes, tags: [tag] });
    },
    async setTorrentsAutomatic(enable: boolean) {
      await api.setTorrentsAutomatic(this.selectedHashes, enable);
      this.selectedRows = [];
    }
  },

  watch: {
    pagination: {
      handler() {
        this.updateConfig({
          key: "pagination",
          value: this.pagination
        });
      },
      deep: true
    }
  }
});
</script>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  padding-left: 8px;
  overflow-x: auto;
}

.container {
  padding: 0 0 80px;
  height: calc(100vh - 40px); // footer + toobar = 100px
  overflow-y: scroll;

  &.phone-layout {
    height: 100vh; // toobar = 56px
  }
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
}

.category-actions .v-list__tile__action {
  min-width: 40px;
}

.menu-check {
  padding: 0;
}

.icon-label {
  display: flex;
  align-items: center;

  &.auto_tmm {
    color: #1b3d69;
  }
}

::v-deep .v-datatable thead th,
.v-datatable tbody td {
  padding: 0 2px !important;
  width: auto;
  height: auto;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:first-child {
    padding: 0 0 0 8px !important;
  }

  &:last-child {
    padding-right: 8px !important;
  }
}

::v-deep .v-datatable {
  // table-layout: fixed;
}

::v-deep.hide-headers .v-datatable thead {
  display: none;
}

::v-deep .v-datatable thead th.th-name {
  // max-width: 100px;
}
</style>
