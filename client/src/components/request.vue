<template>
    <div id="request">
        <div class="request-path-editor__left">
            <el-row :gutter="20">
                <el-button type="primary" :plain="true" icon="plus" @click="sendRequest">{{ $t("ap.request.addbtn") }}</el-button>
                <el-button type="primary" :plain="true" icon="plus" @click="clearRequest">{{ $t("ap.request.clear") }}</el-button>
            </el-row>
            <codemirror v-model="request" :options="editorOption" ></codemirror>
        </div>
        <div class="request-path-editor__left">
            <el-input placeholder="重放请求地址" v-model="request_url">
                <template slot="prepend">重放请求地址</template>
            </el-input>
            <codemirror v-model="response" :options="responseOption" ></codemirror>
        </div>
    </div>

</template>
<script>
    import {codemirror} from 'vue-codemirror';
    import util from '../lib/util';
    import _ from 'lodash';
    import * as types from '../store/mutation-types';
    export default {
        data() {
            return {
                currentProject: {},     //当前项目对象
                newProjectName: '',     //新项目名称
                projects: [],           //项目列表
                request:"",
                response:"None",
                request_url: "",
                projectPaths: [],       //某项目下的规则列表
                addPathStatus: false,   //添加规则弹窗

                preEditPath: null,      //编辑前的路径，用于恢复
                pathId: null,           //正在编辑的路径id
                pathRequest: {          //正在编辑的请求
                    url: '/xxx/xxx',
                    method: 'GET'
                },
                pathResponse: {         //正在编辑的返回数据
                    status: '200',
                    headers: 'Content-Type:application/json;Access-Control-Allow-Origin:*;',
                    body: ''
                },

                editorOption: {         //返回的数据body
                    mode: 'message/http',
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: 'monokai',
                },
                responseOption: {
                    readOnly: "true",
                    mode: 'message/http',
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: 'monokai',
                }
            }
        },
        watch: {
            "$route": function () {
                this.$nextTick(()=>{
                    try{
                    var data = JSON.parse(this.$route.params.data);
                        var method = data.method;
                        var path = data.path;
                        this.request_url = data.host;
                        var header = '';
                        var body = data.reqBody;
                        for (var key in data.reqHeader) {
                            header += key +':' + data.reqHeader[key] + '\n';
                        }
                        this.request = method + ' ' + path + ' HTTP/1.1\n' + header + '\n' + body;
                    }catch (e) {
                        console.log(e);
                    }

                    // this.request = this.$route.params.data;
                })

            },
        },
        computed: {
            // multipleSelection() {
            //     return this.$store.state.mock_paths;
            // }
        },
        components: {
            codemirror
        },
        mounted() {
            const projs = this.$remoteApi.getMockProjects();
            this.projects = JSON.parse(projs);
        },
        methods: {
            addProject() {
                this.$router.push({
                    path: '/network',
                });
            },
            sendRequest(){
                var _ = this.$remoteApi.sendRequest(this.request_url,this.request,  (response)=> {
                    this.response = response;
                })|| '';
            },
            clearRequest(){
              this.request = '';
              this.request_url = '';
              this.response = '';
            },
            deleteProject(item) {
                this.$confirm(this.$t("ap.message.MSG_MOCK_CONFIRM_DEL"), {
                    type: 'warning'
                }).then(() => {
                    const idIndex  = _.findIndex(this.projects, {id: item.id});
                    this.projects.splice(idIndex, 1);
                    this.$remoteApi.saveMockProject(this.projects);
                    if (this.currentProject.id === item.id) {
                        this.currentProject = {};
                    }
                }, () => {});
            },
            switchProject(item) {
                const self = this;
                this.currentProject = item;
                this.$remoteApi.getProjectPaths(item.id).then((data) => {
                    self.projectPaths = JSON.parse(data);
                    console.log(self.projectPaths);
                }, () => {
                    console.log('no projcet data');
                    self.projectPaths = [];
                });
            },
            toAddPath() {
                this.addPathStatus = true;
                this.preEditPath = null;
                this.pathId = null;    //恢复
                this.pathRequest = {   //正在编辑的请求
                    url: '/xxx/xxx',
                    method: 'GET'
                };
                this.pathResponse = {  //正在编辑的返回数据
                    status: '200',
                    headers: 'Content-Type:application/json;Access-Control-Allow-Origin:*;',
                    body: ''
                };
            },
            savePath() {
                const self = this;
                //TODO 保存规则到某个项目，区分新增和修改
                if (this.projectPaths) {
                    if (!this.pathId) { //新增
                        let item = {
                            id: util.generateUUIDv4(),
                            request: _.clone(this.pathRequest),
                            response: _.clone(this.pathResponse)
                        };
                        this.projectPaths.push(item);
                    } else {
                        let idIndex = _.findIndex(this.projectPaths, {id: this.pathId});
                        let item = {
                            id: this.pathId,
                            request: _.clone(this.pathRequest),
                            response: _.clone(this.pathResponse)
                        };
                        this.$set(this.projectPaths, idIndex, item);
                    }
                    this.$remoteApi.saveProjectPaths(this.currentProject.id, this.projectPaths).then(() => {
                        self.$notify({
                            message: self.$t("ap.message.MSG_MOCK_SAVE_SUCCESS"),
                            duration: 1000
                        });
                        self.addPathStatus = false;
                    });
                }
            },
            cancelPath() {
                //恢复状态
                if (this.preEditPath) {
                    this.pathRequest = this.preEditPath.request;
                    this.pathResponse = this.preEditPath.response;
                }
                this.addPathStatus = false
            },
            handleEdit(index, row) {
                this.preEditPath = row;

                this.pathId = row.id;
                this.pathRequest = _.clone(row.request);
                this.pathResponse = _.clone(row.response);

                this.addPathStatus = true;
            },
            handleDelete(index, row) {
                const self = this;
                this.$confirm(self.$t("ap.message.MSG_MOCK_CONFIRM_DEL"), {
                    type: 'warning'
                }).then(() => {
                    const idIndex  = _.findIndex(this.projectPaths, {id: row.id});
                    this.projectPaths.splice(idIndex, 1);
                    this.$remoteApi.saveProjectPaths(this.currentProject.id, this.projectPaths).then(() => {
                        self.$notify({
                            message: self.$t("ap.message.MSG_MOCK_DEL_SUCCESS"),
                            duration: 1000
                        });
                    });

                });
            },
            handlePathChange(val) {
                //此处不能直接赋值val, 会变成引用element值，导致vuex报错
                this.$store.commit(types.SET_SELECTED_MOCKPATH, _.clone(val));
            }
        }
    }

</script>
<style lang="less">
    #request {
        display: -webkit-box;
        -webkit-box-flex: 1;
        -webkit-box-orient: horizontal;
        padding: 30px;
        margin-top: 60px;
        .request-project-list {
            margin-top: 20px;
        }
        .request-project-item {
            position: relative;
            text-align: center;
            border-top: 1px solid rgba(151, 168, 190, 0.17);
            &:first-child {
                border: none;
            }
            &:hover {
                i {
                    display: inline-block;
                }
            }
            i {
                display: none;
                position: absolute;
                right: 0;
                top: 40%;
            }
            &.is-active {
                color: #fff;
                background-color: #669999;
            }
        }
    }
    .request-project {
        width: 200px;
    }

    .request-path {
        -webkit-box-flex: 1;
        margin-left: 40px;
        h2 {
            color: #669999;
            margin-bottom: 27px;
            .el-icon-information {
                color: #ccc;
                font-size: 15px;
                vertical-align: 3px;
            }
        }
        .CodeMirror {
            height: 200px;
        }
    }
    .request-path-editor {
        display: -webkit-box;
        -webkit-box-orient: horizontal;
        h4 {
            padding: 10px 0;
        }
    }
    .request-path-editor__left, .mock-path-editor__right {
        width: 50%;
        -webkit-box-flex: 1;
        padding: 0 20px;
    }
    .request-path-editor__left {
        border-right: 1px solid #ccc;
    }
    .request-path__list {
        margin-top: 20px;
    }

    .CodeMirror {
        margin-top: 20px;
        border: 1px solid #eee;
        height: 500px;
    }
    /*.CodeMirror-scroll {*/
          /*height: auto;*/
          /*overflow-y: auto;*/
          /*overflow-x: auto;*/
      /*}*/
    .el-select .el-input {
        width: 130px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>