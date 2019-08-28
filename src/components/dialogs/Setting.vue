<template>
    <v-dialog :value="true" @input="closeDialog" :width="dialogWidth" :fullscreen="phoneLayout">
        <v-card class="">
            <v-card-title class="headline grey lighten-4">
                <v-icon class="mr-2">mdi-settings</v-icon>
                <span>设置</span>
            </v-card-title>
            <v-card-text class="settings_card">
                <v-tabs v-model="mTab">
                    <v-tab href="#download">下载</v-tab>
                    <v-tab href="#connect">连接</v-tab>
                    <v-tab href="#speed">速度</v-tab>
                    <v-tab href="#bittorrent">BitTorrent</v-tab>
                    <!--                    <v-tab href="#web">Web用户界面</v-tab>-->
                    <!--                    <v-tab href="#advanced">高级</v-tab>-->
                </v-tabs>
                <v-tabs-items :value="mTab" touchless>
                    <v-tab-item value="download">
                        <v-container fluid grid-list-lg>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            当添加种子时
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex>
                                                    <v-checkbox
                                                            hide-details
                                                            v-model="create_subfolder_enabled"
                                                            label="创建多文件子目录"
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="start_paused_enabled"
                                                            label="不要自动开始下载"
                                                            type="checkbox"
                                                            hide-details
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="auto_delete_mode"
                                                            label="完成后删除 .torrent 文件"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="preallocate_all"
                                                            label="为所有文件预分配磁盘空间"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="incomplete_files_ext"
                                                            label="为不完整的文件添加扩展名 .!qB"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            保存管理
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex>
                                                    <v-switch
                                                            v-model="auto_tmm_enabled"
                                                            hide-details
                                                            label="默认自动管理种子"
                                                    ></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-select
                                                            v-model="torrent_changed_tmm_enabled"
                                                            :items="[{text:'重新定位Torrent',value:true},{text:'切换Torrent到手动模式',value:false}]"
                                                            hide-details
                                                            label="当Torrent分类修改时"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex>
                                                    <v-select
                                                            v-model="save_path_changed_tmm_enabled"
                                                            :items="[{text:'重新定位Torrent',value:true},{text:'切换Torrent到手动模式',value:false}]"
                                                            hide-details
                                                            label="当默认保存路径修改时"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex>
                                                    <v-select
                                                            v-model="category_changed_tmm_enabled"
                                                            :items="[{text:'重新定位Torrent',value:true},{text:'切换Torrent到手动模式',value:false}]"
                                                            hide-details
                                                            label="当分类保存路径修改时"
                                                    ></v-select>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="save_path"
                                                            label="默认保存路径"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex shrink>
                                                    <v-checkbox
                                                            v-model="temp_path_enabled"
                                                            label="保存未完成的torrents到"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="temp_path"
                                                            :disabled="!temp_path_enabled"
                                                            label="临时保存路径"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="export_dir"
                                                            label="复制 .torrent 文件到"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="export_dir_fin"
                                                            label="复制下载完成的 .torrent 文件到"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                        </v-container>
                    </v-tab-item>
                    <v-tab-item value="connect">
                        <v-container fluid grid-list-lg>

                            <v-layout>
                                <v-flex>
                                    <v-select
                                            v-model="bittorrent_protocol"
                                            :items="[{text:'TCP 和 μTP',value:0},{text:'TCP',value:1},{text:'μTP',value:2}]"
                                            hide-details
                                            label="启用的协议"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            监听端口
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="listen_port"
                                                            type="number"
                                                            label="用于传入连接的端口"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="upnp"
                                                            label="使用我的路由器的 UPnP / NAT-PMP 端口转发"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="random_port"
                                                            label="在每次启动时使用不同的端口"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            监听端口
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-text-field
                                                            :prepend-icon="max_connec ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                                                            label="全局最大连接数"
                                                            @click:prepend="changeStatus('max_connec',500)"
                                                            v-model="max_connec"
                                                            :readonly="!max_connec"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            :prepend-icon="max_connec_per_torrent ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                                                            label="每 torrent 最大连接数"
                                                            @click:prepend="changeStatus('max_connec_per_torrent',100)"
                                                            v-model="max_connec_per_torrent"
                                                            :readonly="!max_connec_per_torrent"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            :prepend-icon="max_uploads ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                                                            label="全局最大上传线程数"
                                                            @click:prepend="changeStatus('max_uploads',8)"
                                                            v-model="max_uploads"
                                                            :readonly="!max_uploads"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            :prepend-icon="max_uploads_per_torrent ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                                                            label="每 torrent 上传线程最大值"
                                                            @click:prepend="changeStatus('max_uploads_per_torrent',4)"
                                                            v-model="max_uploads_per_torrent"
                                                            :readonly="!max_uploads_per_torrent"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            代理服务器
                                        </v-card-title>
                                        <v-card-text>

                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-select
                                                            v-model="proxy_type"
                                                            :items="[{text:'无',value:0},{text:'socks4',value:5},{text:'socks5',value:2},{text:'http',value:1}]"
                                                            hide-details
                                                            label="类型"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="proxy_ip"
                                                            :disabled="proxy_type===0"
                                                            label="主机"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="proxy_port"
                                                            type="number"
                                                            :disabled="proxy_type===0"
                                                            label="端口"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="proxy_peer_connections"
                                                            label="使用代理服务器进行连接"
                                                            :disabled="proxy_type===0"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="proxy_torrents_only"
                                                            label="只对 torrents 使用代理"
                                                            :disabled="proxy_type===0"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex shrink>
                                                    <v-checkbox
                                                            v-model="proxy_auth_enabled"
                                                            label="验证"
                                                            :disabled="proxy_type===0"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="proxy_username"
                                                            :disabled="!proxy_auth_enabled"
                                                            label="用户名"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="proxy_password"
                                                            :disabled="!proxy_auth_enabled"
                                                            label="密码"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>

                                            <v-checkbox
                                                    v-model="ip_filter_enabled"
                                                    label="IP过滤"
                                                    hide-details
                                                    type="checkbox"
                                            ></v-checkbox>
                                        </v-card-title>
                                        <v-card-text>

                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex>
                                                    <v-text-field
                                                            v-model="ip_filter_path"
                                                            :disabled="!ip_filter_enabled"
                                                            label="过滤规则路径 (.dat, .p2p, .p2b)"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="ip_filter_trackers"
                                                            :disabled="!ip_filter_enabled"
                                                            label="匹配 trackers"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>

                                                <v-flex>

                                                    <v-textarea
                                                            v-model="banned_IPs"
                                                            :disabled="!ip_filter_enabled"
                                                            label="手动屏蔽 IP 地址"
                                                    ></v-textarea>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                        </v-container>

                    </v-tab-item>
                    <v-tab-item value="speed">
                        <v-container fluid grid-list-lg>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            全局速度限制
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="up_limit"
                                                            type="number"
                                                            suffix="KiB/s"
                                                            label="上传"
                                                    ></v-text-field>

                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="dl_limit"
                                                            type="number"
                                                            label="下载"
                                                            suffix="KiB/s"
                                                    ></v-text-field>

                                                </v-flex>
                                            </v-layout>
                                            <p>0 为无限制</p>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            备用速度限制
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout row>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="alt_up_limit"
                                                            type="number"
                                                            suffix="KiB/s"
                                                            label="上传"
                                                    ></v-text-field>

                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="alt_dl_limit"
                                                            type="number"
                                                            label="下载"
                                                            suffix="KiB/s"
                                                    ></v-text-field>

                                                </v-flex>
                                            </v-layout>
                                            <p>0 为无限制</p>
                                            <v-layout>
                                                <v-flex>
                                                    <v-card>
                                                        <v-card-title>
                                                            <v-checkbox
                                                                    v-model="scheduler_enabled"
                                                                    label="计划备用速度限制的启用时间"
                                                                    hide-details
                                                                    type="checkbox"
                                                            ></v-checkbox>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-layout row>
                                                                <v-flex>
                                                                    <v-text-field
                                                                            v-model="schedule_from"
                                                                            mask="##:##"
                                                                            return-masked-value
                                                                            :disabled="!scheduler_enabled"
                                                                            label="从"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                                <v-flex>
                                                                    <v-text-field
                                                                            label="到"
                                                                            v-model="schedule_to"
                                                                            :disabled="!scheduler_enabled"
                                                                            return-masked-value
                                                                            mask="##:##"
                                                                    ></v-text-field>

                                                                </v-flex>
                                                            </v-layout>
                                                            <v-layout>
                                                                <v-flex>
                                                                    <v-select
                                                                            v-model="bittorrent_protocol"
                                                                            :disabled="!scheduler_enabled"
                                                                            :items="['每天','工作日','周末','周一','周二','周三','周四','周五','周六','周日'].map((t,i)=>({text:t,value:i}))"
                                                                            hide-details
                                                                            label="时间"
                                                                    ></v-select>

                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-flex>

                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            设置速度限制
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="limit_utp_rate"
                                                            label="对 µTP 协议进行速度限制"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="limit_tcp_overhead"
                                                            label="对传送总开销进行速度限制"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="limit_lan_peers"
                                                            label="限制本地用户带宽"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                        </v-container>


                    </v-tab-item>
                    <v-tab-item value="bittorrent">
                        <v-container fluid grid-list-sm>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            隐私
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="dht"
                                                            label="启用 DHT（分散网络）以获取更多资源"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="pex"
                                                            label="启用用户交换（PeX）以获取更多资源"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="lsd"
                                                            label="启用本地资源搜索以获取更多资源"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-select
                                                            v-model="encryption"
                                                            :items="['允许加密','强制加密','禁止加密'].map((t,i)=>({text:t,value:i}))"
                                                            hide-details
                                                            label="加密模式"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex>
                                                    <v-checkbox
                                                            v-model="anonymous_mode"
                                                            label="启用匿名模式"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>

                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            <v-checkbox
                                                    v-model="queueing_enabled"
                                                    label="Torrent 排队"
                                                    hide-details
                                                    type="checkbox"
                                            ></v-checkbox>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="max_active_downloads"
                                                            :disabled="!queueing_enabled"
                                                            type="number"
                                                            label="最大活动的下载数"
                                                    ></v-text-field>

                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="max_active_uploads"
                                                            :disabled="!queueing_enabled"
                                                            type="number"
                                                            label="最大活动的上传数"
                                                    ></v-text-field>

                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model="max_active_torrents"
                                                            :disabled="!queueing_enabled"
                                                            type="number"
                                                            label="最大活动的 torrents 数"
                                                    ></v-text-field>

                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-card>
                                                        <v-card-title>
                                                            <v-checkbox
                                                                    v-model="dont_count_slow_torrents"
                                                                    label="慢速 torrent 不计入限制内"
                                                                    :disabled="!queueing_enabled"
                                                                    hide-details
                                                                    type="checkbox"
                                                            ></v-checkbox>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-layout row>
                                                                <v-flex>
                                                                    <v-text-field
                                                                            v-model="slow_torrent_dl_rate_threshold"
                                                                            :disabled="!dont_count_slow_torrents"
                                                                            type="number"
                                                                            suffix="KiB/s"
                                                                            label="下载速度阈值"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                                <v-flex>
                                                                    <v-text-field
                                                                            v-model="slow_torrent_ul_rate_threshold"
                                                                            type="number"
                                                                            :disabled="!dont_count_slow_torrents"
                                                                            suffix="KiB/s"
                                                                            label="上传速度阈值"
                                                                    ></v-text-field>

                                                                </v-flex>
                                                                <v-flex>
                                                                    <v-text-field
                                                                            v-model="slow_torrent_inactive_timer"
                                                                            type="number"
                                                                            :disabled="!dont_count_slow_torrents"
                                                                            suffix="秒"
                                                                            label="种子不活动时间"
                                                                    ></v-text-field>

                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-flex>

                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            分享率限制
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex shrink>
                                                    <v-checkbox
                                                            v-model="max_ratio_enabled"
                                                            label="分享 torrents 直至达到比率"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            :disabled="!max_ratio_enabled"
                                                            v-model.number="max_ratio"
                                                    ></v-text-field>
                                                </v-flex>

                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">

                                                <v-flex shrink>
                                                    <v-checkbox
                                                            v-model="max_seeding_time_enabled"
                                                            label="分享 torrents 直至达到做种时间限制"
                                                            hide-details
                                                            type="checkbox"
                                                    ></v-checkbox>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field
                                                            v-model.number="max_seeding_time"
                                                            :disabled="!max_seeding_time_enabled"
                                                            suffix="分钟"
                                                    ></v-text-field>
                                                </v-flex>

                                            </v-layout>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>
                                                    <v-select
                                                            v-model="max_ratio_act"
                                                            :items="['暂停','删除','开启超级种子模式'].map((t,i)=>({text:t,value:i}))"
                                                            :disabled="!max_ratio_enabled&&!max_seeding_time_enabled"
                                                            hide-details
                                                            label="然后"
                                                    ></v-select>
                                                </v-flex>

                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                            <v-layout>
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            <v-checkbox
                                                    v-model="add_trackers_enabled"
                                                    label="自动添加以下 trackers 到新的 torrents"
                                                    hide-details
                                                    type="checkbox"
                                            ></v-checkbox>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout :column="this.$vuetify.breakpoint.smAndDown">
                                                <v-flex>

                                                    <v-textarea
                                                            :disabled="!add_trackers_enabled"
                                                            v-model="add_trackers"
                                                    ></v-textarea>

                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>

                                </v-flex>

                            </v-layout>
                        </v-container>

                    </v-tab-item>

                    <v-tab-item value="web">

                    </v-tab-item>
                    <v-tab-item value="advanced">

                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn flat @click="submit">保存</v-btn>
                <v-btn flat @click="closeDialog">关闭</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import _ from "lodash";
    import Vue from "vue";
    import {mapActions, mapGetters, mapState, mapMutations} from "vuex";
    import {buildFormComputed, time_padding} from "@/utils";

    export default Vue.extend({
        components: {},

        props: {
            // value: Array,
            tab: String
        },
        data() {
            return {
                mTab: null,
                schedule_from_time: "",
                schedule_to_time: "",
            };
        },
        async created() {
            this.mTab = this.tab;
        },
        computed: {
            schedule_from: {
                set(val) {
                    const time = val.split(":");
                    if (time.length > 1) {
                        this.schedule_from_hour = parseInt(time[0]);
                        this.schedule_from_min = parseInt(time[1]);
                    }
                    this.schedule_from_time = val;
                },
                get() {
                    return this.schedule_from_time || `${time_padding(this.schedule_from_hour)}:${time_padding(this.schedule_from_min)}`;
                }
            },
            schedule_to: {
                set(val) {
                    const time = val.split(":");
                    if (time.length > 1) {
                        this.schedule_to_hour = parseInt(time[0]);
                        this.schedule_to_min = parseInt(time[1]);
                    }
                    this.schedule_to_time = val;
                },
                get() {
                    return this.schedule_to_time || `${time_padding(this.schedule_to_hour)}:${time_padding(this.schedule_to_min)}`;
                }
            },
            ...buildFormComputed({
                parent: "preferences",
                // prefix: "p",
                keys: [
                    "add_trackers",
                    "add_trackers_enabled",
                    {
                        path: "alt_dl_limit",
                        trans: "1024"
                    },
                    {
                        path: "alt_up_limit",
                        trans: "1024"
                    },
                    "alternative_webui_enabled",
                    "alternative_webui_path",
                    "announce_ip",
                    "announce_to_all_tiers",
                    "announce_to_all_trackers",
                    "anonymous_mode",
                    "async_io_threads",
                    "auto_delete_mode",
                    "auto_tmm_enabled",
                    "autorun_enabled",
                    "autorun_program",
                    "banned_IPs",
                    "bittorrent_protocol",
                    "bypass_auth_subnet_whitelist",
                    "bypass_auth_subnet_whitelist_enabled",
                    "bypass_local_auth",
                    "category_changed_tmm_enabled",
                    "checking_memory_use",
                    "create_subfolder_enabled",
                    "current_interface_address",
                    "current_network_interface",
                    "dht",
                    "disk_cache",
                    "disk_cache_ttl",
                    {
                        path: "dl_limit",
                        trans: "1024"
                    },
                    "dont_count_slow_torrents",
                    "dyndns_domain",
                    "dyndns_enabled",
                    "dyndns_password",
                    "dyndns_service",
                    "dyndns_username",
                    "embedded_tracker_port",
                    "enable_coalesce_read_write",
                    "enable_embedded_tracker",
                    "enable_multi_connections_from_same_ip",
                    "enable_os_cache",
                    "enable_super_seeding",
                    "enable_upload_suggestions",
                    "encryption",
                    "export_dir",
                    "export_dir_fin",
                    "file_pool_size",
                    "incomplete_files_ext",
                    "ip_filter_enabled",
                    "ip_filter_path",
                    "ip_filter_trackers",
                    "limit_lan_peers",
                    "limit_tcp_overhead",
                    "limit_utp_rate",
                    "listen_on_ipv6_address",
                    "listen_port",
                    "locale",
                    "lsd",
                    "mail_notification_auth_enabled",
                    "mail_notification_email",
                    "mail_notification_enabled",
                    "mail_notification_password",
                    "mail_notification_sender",
                    "mail_notification_smtp",
                    "mail_notification_ssl_enabled",
                    "mail_notification_username",
                    "max_active_downloads",
                    "max_active_torrents",
                    "max_active_uploads",
                    {
                        path: "max_connec",
                        trans: "enable"
                    }, {
                        path: "max_connec_per_torrent",
                        trans: "enable"
                    }, {
                        path: "max_uploads",
                        trans: "enable"
                    }, {
                        path: "max_uploads_per_torrent",
                        trans: "enable"
                    }, {
                        path: "max_seeding_time",
                        trans: "enable"
                    }, {
                        path: "max_ratio",
                        trans: "enable"
                    },
                    "max_ratio_act",
                    "max_ratio_enabled",
                    "max_seeding_time_enabled",
                    "outgoing_ports_max",
                    "outgoing_ports_min",
                    "pex",
                    "preallocate_all",
                    "proxy_auth_enabled",
                    "proxy_ip",
                    "proxy_password",
                    "proxy_peer_connections",
                    "proxy_port",
                    "proxy_torrents_only",
                    {
                        path: "proxy_type",
                        trans: {
                            set(val, {preferences: {proxy_auth_enabled = false} = {}}) {
                                return _.get({
                                    2: proxy_auth_enabled ? 4 : 2,
                                    1: proxy_auth_enabled ? 3 : 1
                                }, val, val);
                            },
                            get(val) {
                                return _.get({
                                    4: 2,
                                    3: 1
                                }, val, val);
                            }
                        }
                    },
                    "proxy_username",
                    "queueing_enabled",
                    "random_port",
                    "recheck_completed_torrents",
                    "resolve_peer_countries",
                    "save_path",
                    "save_path_changed_tmm_enabled",
                    "save_resume_data_interval",
                    "scan_dirs",
                    "schedule_from_hour",
                    "schedule_from_min",
                    "schedule_to_hour",
                    "schedule_to_min",
                    "scheduler_days",
                    "scheduler_enabled",
                    "send_buffer_low_watermark",
                    "send_buffer_watermark",
                    "send_buffer_watermark_factor",
                    "slow_torrent_dl_rate_threshold",
                    "slow_torrent_inactive_timer",
                    "slow_torrent_ul_rate_threshold",
                    "socket_backlog_size",
                    "start_paused_enabled",
                    "temp_path",
                    "temp_path_enabled",
                    "torrent_changed_tmm_enabled",
                    {
                        path: "up_limit",
                        trans: "1024"
                    },
                    "upload_choking_algorithm",
                    "upload_slots_behavior",
                    "upnp",
                    "use_https",
                    "utp_tcp_mixed_mode",
                    "web_ui_address",
                    "web_ui_clickjacking_protection_enabled",
                    "web_ui_csrf_protection_enabled",
                    "web_ui_domain_list",
                    "web_ui_host_header_validation_enabled",
                    "web_ui_https_cert_path",
                    "web_ui_https_key_path",
                    "web_ui_port",
                    "web_ui_session_timeout",
                    "web_ui_upnp",
                    "web_ui_username"
                ]
            }),
            phoneLayout() {
                return this.$vuetify.breakpoint.xsOnly;
            },
            dialogWidth() {
                return this.phoneLayout ? "100%" : "80%";
            }
        },

        methods: {
            ...mapActions(["setPreferences"]),
            changeStatus(key, def = 500) {
                this[key] = this[key] ? -1 : def;
            },
            submit() {
                return this.setPreferences()
                    .then(() => {
                        this.$dialog.message.success("保存成功", {
                            position: "top",
                        });
                        this.closeDialog();
                    });

            },
            closeDialog() {
                this.$emit("input", false);
            }
        },
        watch: {

            proxy_auth_enabled(val) {
                this.proxy_type = _.get({
                    1: val ? 3 : 1,
                    2: val ? 4 : 2,
                    3: val ? 3 : 1,
                    4: val ? 4 : 2,
                }, this.proxy_type, this.proxy_type);
            },
            mTab(v) {
                this.$emit("change", v);
            }
        }
    });
</script>

<style lang="scss" scoped>


    .settings_card {
        padding: 10px 0;
        margin: 0;

        .v-subheader {
            font-size: 18px;
            margin-bottom: 10px;
            color: #000000;

            .v-input {
                padding-left: 0;
            }

            ::v-deep .v-label {
                color: #000000;
            }
        }

        .v-card {
            .v-card__title {
                padding-bottom: 0;
                font-size: 18px;

                .v-input {
                    margin: 0;
                    padding: 0;
                }

                ::v-deep .v-label {
                    color: #000000;
                    font-size: 18px;
                }
            }

            .v-card__text {
                padding-top: 0;
            }
        }

        .v-input {
            padding: 15px 20px 0;
            margin: 0;

            ::v-deep .v-input__slot {
                margin-bottom: 5px;
            }
        }
    }

    .v-dialog--fullscreen {

    }
</style>
