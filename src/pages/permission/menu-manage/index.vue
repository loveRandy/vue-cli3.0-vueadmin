
<template lang="html">
<el-card class="box-card">
  <div>
    <div style="margin-bottom:10px;">
      <el-button type="success" icon="el-icon-plus" size="small" @click="handleNewCategory(1,0)">新增菜单</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      highlight-current-row
      border
      size="small">
      <el-table-column
        label="分类名称"
        align="left"
      >
        <template slot-scope="scope">
          <a :style="`margin-left: ${(scope.row.categoryLevel - 1) * 20}px`" class="category-row">
            <i class="block-icon" v-if="scope.row.categoryLevel<3" :class="[expandData[scope.row.id] ? 'el-icon-minus' : 'el-icon-plus']" @click="toggleExpend(scope.row)"></i>
            <span v-if="scope.row.categoryLevel>=3" style="margin-left: 20px"></span>
            <span class="category-name">{{scope.row.categoryLevel}}&emsp;{{ scope.row.permissionName }}
              <i class="el-icon-edit" @click="showEdit(scope.row)"></i>
            </span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="350"
      >
        <template slot-scope="scope">
  <div>
    <el-button
      size="small"
      v-if="scope.row.permissionLevel<3"
      @click="handleNewCategory(scope.row.permissionLevel+1,scope.row.id)"
    >添加子分类</el-button>
  </div>
</template>
      </el-table-column>
    </el-table>
    <!-- 编辑类目弹窗 -->
    <el-dialog
      title="编辑类目"
      :visible.sync="visible"
      width="30%">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="24" >
            <el-form-item label="权限名称">
              <el-input v-model="editBuild.permissionName"></el-input>
            </el-form-item>
            <el-form-item label="权限代码">
              <el-input :disabled="true" v-model="editBuild.permissionCode"></el-input>
            </el-form-item>
            <el-form-item label="模块名">
              <el-input v-model="editBuild.module"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增类目弹窗 -->
    <el-dialog
      title="新增类目"
      :visible.sync="newVisible"
      width="50%">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="24" >
            <el-form-item label="权限名称">
              <el-input v-model="firstBuild.permissionName"></el-input>
            </el-form-item>
            <el-form-item label="权限代码">
              <el-input v-model="firstBuild.permissionCode"></el-input>
            </el-form-item>
            <el-form-item label="模块名">
              <el-input v-model="firstBuild.module"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelNewCategory">取 消</el-button>
        <el-button type="primary" @click="setNewCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</el-card>
</template>

<script>
import { getFirstLevel, getNextLevel } from '@/api/permission'
export default {
    name: 'coolefyCategory',
    data() {
        return {
            firstBuild: {
                permissionName: '',
                module: '',
                permissionCode: ''
            },
            editBuild: {
                permissionName: '',
                module: '',
                permissionCode: ''
            },
            loading: false,
            visible: false,
            newVisible: false,
            secondVisible: false,
            thirdVisible: false,
            totalRecord: 100,
            checked: false,
            indeterminate: false,
            data: [],
            list: [],
            expandData: {},
            checkedData: {},
            indeterminateData: {},
            searchData: {
                pageSize: 10,
                pageNumber: 1,
                operateType: '',
                startDate: '',
                endDate: ''
            },
            currentRow: '',
            form: {
                parentId: '',
                id: '',
                cnCategoryName: '',
                sort: '',
                categoryImg: ''
            },
            cnCategoryName: '',
            cnCategoryNameTwo: '',
            levelOne: {},

            // 新建类目
            newCategoryType: '',
            parentId: 0,
            isContact: false,
            dialogVisible: false,
            putawayName: '',
            putawayCategoryId: '',
            categoryData: { categoryId: '', categoryTreePath: '' },
            categoryList: [], // 所有类目
            pageNumber: 1,
            notPutVisible: false,
            webCategoryId: '',
            webPutaway: [],
            notBelongWeb: [],
            newPutawayWeb: [],
            putawayCategoryName: '',
            // 翻译
            isTranslate: false,
            translateVisible: false,
            translateCncnCategoryName: '',
            formLabelWidth: '100px',

            isEdit: true,
            webArr: []
        }
    },
    mounted() {
        this.search()
    },
    methods: {
        handleNewCategory(type, id) {
            this.newVisible = true
            this.newCategoryType = type
            if (id) {
                this.parentId = id
            } else {
                this.parentId = 0
            }
        },
        setNewCategory() {
            // 新增类目
            var formData = new URLSearchParams()
            for (var key in this.firstBuild) {
                if (!this.firstBuild[key]) {
                    this.$message.error('请补充完数据后再操作')
                    return
                }
                formData.append(key, this.firstBuild[key])
            }
            if (this.newCategoryType === 1) {
                formData.append('parentId', this.parentId)
                formData.append('resourceLevel', 1)
                formData.append('permissionLevel', 1)
            } else if (this.newCategoryType === 2) {
                formData.append('parentId', this.parentId)
                formData.append('resourceLevel', 2)
                formData.append('permissionLevel', 2)
            } else if (this.newCategoryType === 3) {
                formData.append('parentId', this.parentId)
                formData.append('resourceLevel', 3)
                formData.append('permissionLevel', 3)
            }
        },
        cancelNewCategory() {
            this.newVisible = false
            this.newCategory = this.initCategory
        },
        handleSelectTwo(item) {
            this.form.parentId = item.id
        },
        handleSelect(item) {
            this.form.parentId = item.id
            this.cnCategoryNameTwo = ''
            this.levelOne = item
        },

        update() {
            var formData = new URLSearchParams()
            for (var key in this.editBuild) {
                if (!this.editBuild[key]) {
                    this.$message.error('请补充完数据后再操作')
                    return
                }
                formData.append(key, this.editBuild[key])
            }
            formData.append('parentId', this.currentRow.parentId)
            formData.append('id', this.currentRow.id)
            formData.append('resourceLevel', this.currentRow.permissionLevel)
            formData.append('permissionLevel', this.currentRow.permissionLevel)
        },
        showEdit(row) {
            this.visible = true
            this.editBuild = {
                permissionName: row.permissionName,
                module: row.module,
                permissionCode: row.permissionCode
            }
            this.currentRow = row
        },
        search() {
            getFirstLevel().then(res => {
                let data = res || []
                data = data.map(item => {
                    item.childList = []
                    item.isLoadChild = false
                    item.cnCategoryName = item.permissionName
                    item.categoryLevel = item.resourceLevel
                    return item
                })
                this.data = data
                this.list = data
            })
        },
        findSourceDataById(id, list) {
            const len = list.length
            for (let i = 0; i < len; i += 1) {
                const item = list[i]
                if (item.id === id) {
                    return item
                }
                if (item.childList) {
                    const ret = this.findSourceDataById(id, item.childList)
                    if (ret) {
                        return ret
                    }
                }
            }
        },
        toggleExpend(d) {
            let { data } = this
            if (!d.isLoadChild) {
                getNextLevel(d.id).then(r => {
                    r.forEach((item, index) => {
                        item.cnCategoryName = item.permissionName
                        item.categoryLevel = item.resourceLevel
                    })
                    const childList = r || []
                    this.expandData[d.id] = true
                    d.isLoadChild = true
                    d.childList = childList
                    this.list = this.makeFlatData(data)
                })
            } else {
                this.expandData[d.id] = !this.expandData[d.id]
                this.list = this.makeFlatData(data)
            }
        },
        makeFlatData(list, level = 0) {
            const len = list.length
            let data = []
            let i = 0

            for (; i < len; i += 1) {
                const item = list[i]
                data.push(item)
                if (item.childList && this.expandData[item.id]) {
                    const childList = this.makeFlatData(
                        item.childList,
                        level + 1
                    )
                    data = data.concat(childList)
                }
            }
            return data
        },
        back() {
            this.isContact = false
            this.webArr = []
            this.webPutaway = []
            this.webCategoryId = ''
        }
    }
}
</script>
<style lang="scss" scoped>
.block-icon {
    border: 1px solid #1ab394;
    border-radius: 2px;
    color: #1ab394;
    display: inline-block;
    height: 14px;
    line-height: 14px;
    text-align: center;
    vertical-align: middle;
    width: 14px;
}
.category-row {
    display: inline-block;
    width: 100%;
    i.el-icon-edit {
        color: #1ab394;
        display: none;
        margin-left: 20px;
        font-size: 16px;
    }
    &:hover {
        i {
            display: inline-block;
        }
    }
}

.putaway-header {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
}
.el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.header-title {
    margin-bottom: 10px;
    color: #606266;
}

.not-belong-Web {
    min-height: 450px;
}
.category-item {
    display: inline-block;
    min-width: 220px;
    vertical-align: top;
    .title {
        text-align: center;
        font-size: 16px;
        line-height: 35px;
    }
    .content {
        width: 100%;
        border: 1px solid #888;
        height: 750px;
        box-sizing: border-box;
        overflow-y: hidden;
        padding: 10px 0;
        border-radius: 3px;
    }
}
.category-list {
    border: 1px solid #ccc;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    width: 200px;
    display: inline-block;
    margin: 0 5px;
    font-size: 0;
    li {
        padding: 5px;
        width: 100%;
        font-size: 14px;
        box-sizing: border-box;
        cursor: pointer;
        i {
            float: right;
        }
        &.active {
            background: #58b7ff;
            color: #fff !important;
        }
    }
}
.colorBlue {
    color: #58b7ff;
}
.translate-item {
    margin-bottom: 10px;
    .left {
        display: inline-block;
        margin-right: 10px;
        width: 80px;
        text-align: right;
    }
    .right {
        display: inline-block;
    }
    .category-word {
        display: inline-block;
        margin-right: 10px;
    }
}
</style>
<style>
.bgc-yellow input {
    background-color: #fff000;
}
</style>
