<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-input style="display: none;"></el-input>
        <el-form-item label="角色名称">
          <el-input v-model="searchData.roleName" placeholder="角色名称" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <div class="fl">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div  class="tools-bar">
      <el-button  type="success" icon="el-icon-plus" size="small" @click="dialogFormVisible = true;">新增角色</el-button>
    </div>
    <div>
      <el-table
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作权限"
          prop="erpMemberPermissions"
          :formatter="permListFormatter">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEditRoleName(scope.$index, scope.row)">修改角色名</el-button>
            <el-button  type="text" size="small" @click="handlePower(scope.$index, scope.row)">授权</el-button>
            <el-button  type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :current-page.sync="pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="80%">
      <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="120px">
        <el-form-item v-if="dialogTitle !== '角色授权'" label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogTitle !== '角色授权'" label="角色代码" label-width="120px">
            <el-input v-model="roleForm.roleCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle !== '角色授权'" label="状态" label-width="120px">
            <el-select v-model="roleForm.status" placeholder="请选择状态">
                <el-option label="停用" value='0'></el-option>
                <el-option label="启用" value='1'></el-option>
            </el-select>
        </el-form-item>

        <el-form-item v-if="dialogTitle=='新增角色并授权' || dialogTitle=='角色授权'" label="权限">
          <el-tabs type="border-card">
            <template v-for="(role, key) in roleTree">
  <el-tab-pane :key="key" :label="role.permissionName">
    <el-tree
      :data="role.erpMemberPermissions"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultTreeProps"
    >
    </el-tree>
  </el-tab-pane>
</template>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" @click="onEditSubmit()" v-if="dialogTitle=='修改角色名称'">保存</el-button>
        <el-button type="info" @click="onEditRoleSubmit" v-if="dialogTitle=='角色授权'">保存</el-button>
        <el-button type="primary" @click="onAddSubmit" v-if="dialogTitle=='新增角色并授权'">立即创建</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="form.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色代码" label-width="120px">
                <el-input v-model="form.roleCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" label-width="120px">
                <el-select v-model="form.status" placeholder="请选择状态">
                    <el-option label="停用" value="0"></el-option>
                    <el-option label="启用" value="1"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAdd()">确 定</el-button>
        </div>
    </el-dialog>

  </el-card>
</template>

<script>
import { getRoleList, getAllPermissiion } from '@/api/permission'
export default {
    data() {
        return {
            form: {
                roleName: '',
                status: '',
                roleCode: ''
            },
            dialogFormVisible: false,
            dialogSize: 'large',
            totalRecord: 0,
            pageSize: 10,
            pageNumber: 1,
            dialogVisible: false,
            dialogTitle: '新增角色并授权',
            defaultTreeProps: {
                children: 'erpMemberPermissions',
                label: 'permissionName'
            },
            rules: {
                roleName: [
                    {
                        required: true,
                        message: '角色名称不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            searchData: {
                roleName: ''
            },
            roleForm: {
                id: '',
                roleName: '',
                permissions: '',
                roleCode: '',
                roleType: '',
                status: ''
            },
            roleTree: [],
            tableData: []
        }
    },
    created() {
        this.loadData()
        this.onSearch()
    },
    methods: {
        doAdd() {
            if (
                !this.form.roleName ||
                !this.form.status ||
                !this.form.roleCode
            ) {
                this.$message.error('请填充信息后再提交!')
                return
            }
            var formData = new FormData()
            formData.append('roleName', this.form.roleName)
            formData.append('status', this.form.status)
            formData.append('roleCode', this.form.roleCode)
        },
        getTreeIndexByRootRoleId(id) {
            let index
            const len = this.roleTree.length
            for (index = 0; index < len; index++) {
                if (this.roleTree[index].id === id) {
                    return index
                }
            }
        },
        getRootRoleIdByRoleId(id) {
            for (let i = 0; i < this.roleTree.length; i++) {
                const roles = this.roleTree[i]
                let hasRole = this.getRole(roles.erpMemberPermissions, id)
                if (hasRole) {
                    return roles.id
                }
            }
        },
        getRole(roles, id) {
            let hasRole
            if (!roles) {
                return
            }
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i]
                if (role.id === id) {
                    hasRole = true
                    break
                } else if (role.erpMemberPermissions) {
                    hasRole = this.getRole(role.erpMemberPermissions, id)
                    if (hasRole) {
                        break
                    }
                }
            }
            return hasRole
        },
        isLeaf(id) {
            let isLeaf
            for (let i = 0; i < this.roleTree.length; i++) {
                const roles = this.roleTree[i]
                this.isLeafByRoleId(roles, id, () => {
                    isLeaf = true
                })
                if (isLeaf) {
                    return true
                }
            }
        },
        isLeafByRoleId(roles, id, fn) {
            if (roles.id === id) {
                if (roles.judge) {
                    fn()
                }
                if (!roles.erpMemberPermissions && roles.parentId !== 0) {
                    fn()
                }
            } else if (roles.erpMemberPermissions) {
                roles.erpMemberPermissions.map(role => {
                    this.isLeafByRoleId(role, id, fn)
                })
            }
        },
        loadData() {
            getAllPermissiion().then(res => {
                this.roleTree = res
                this.roleTree.forEach((item, index) => {
                    if (item.erpMemberPermissions) {
                        item.erpMemberPermissions.forEach(
                            (items, indexs) => {
                                if (item.erpMemberPermissions[indexs] && item.erpMemberPermissions[indexs].erpMemberPermissions && item.erpMemberPermissions[indexs].erpMemberPermissions.length === 0) {
                                    this.roleTree[index].erpMemberPermissions[indexs].judge = true
                                }
                            }
                        )
                    }
                })
            })
        },
        onDialogClose() {
            //   this.$refs.roleForm.resetFields();
            //   if(this.$refs.tree) {
            //     for(let tree of this.$refs.tree) {
            //       tree.setCheckedKeys([]);
            //     }
            //   }
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.onSearch()
        },
        handleCurrentChange(val) {
            this.onSearch({ pageNumber: val })
        },
        handleReset() {
            this.searchData = {
                roleName: ''
            }
            this.onSearch()
        },
        onSearch({ pageNumber = 1 } = {}) {
            getRoleList()
                .then(res => {
                    this.tableData = res || []
                })
        },
        permListFormatter(row, column, cellValue) {
            let str = []
            for (let item of cellValue) {
                str.push(item.permissionName)
            }
            return str.join('，')
        },
        handleDelete(index, row) {
            this.$confirm('确认删除该角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {})
        },
        handlePower(index, row) {
            this.dialogSize = 'large'
            const keys = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
            this.roleForm.id = row.id
            row.erpMemberPermissions.map(role => {
                let id, rootRoleId, treeIndex
                if (this.isLeaf(role.id)) {
                    id = role.id
                    rootRoleId = this.getRootRoleIdByRoleId(id)
                    treeIndex = this.getTreeIndexByRootRoleId(rootRoleId)
                    keys[treeIndex].push(id)
                }
            })
            //   console.log(keys)
            setTimeout(() => {
                const trees = this.$refs.tree
                trees.map((tree, index) => {
                    tree.setCheckedKeys(keys[index])
                })
            })
            this.dialogVisible = true
            this.dialogTitle = '角色授权'
        },
        handleEditRoleName(index, row) {
            this.dialogSize = 'tiny'
            for (let x of Object.keys(this.roleForm)) {
                this.roleForm[x] = row[x]
            }
            this.roleForm.status = String(this.roleForm.status)
            this.dialogVisible = true
            this.dialogTitle = '修改角色名称'
        },
        onAddSubmit() {
            this.getPermissions()
            let permissions = this.roleForm.permissions
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    if (!permissions) {
                        this.$message({
                            showClose: true,
                            message: '请选择权限',
                            type: 'warning'
                        })
                        return false
                    }
                }
            })
        },
        onEditSubmit() {
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    var formData = new URLSearchParams()
                    formData.append('roleName', this.roleForm.roleName)
                    formData.append('id', this.roleForm.id)
                    formData.append('roleCode', this.roleForm.roleCode)
                    formData.append('status', this.roleForm.status)
                }
            })
        },
        onEditRoleSubmit() {
            this.getPermissions()
            let permissions = this.roleForm.permissions
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    if (!permissions) {
                        this.$message({
                            showClose: true,
                            message: '请选择权限',
                            type: 'warning'
                        })
                        return
                    }
                    var formData = new URLSearchParams()
                    this.roleForm.permissions.split(',').forEach(element => {
                        formData.append('permissionIds', element)
                    })
                }
            })
        },
        getPermissions() {
            let set = new Set()
            for (let tree of this.$refs.tree) {
                // 对选中的节点进行处理
                let nodes = tree.getCheckedNodes()
                for (let node of nodes) {
                    let { id, parentId } = node
                    set.add(id)
                    set.add(parentId)
                }
                // 对半选中状态的节点进行处理
                let nodesDOM = tree.$el.querySelectorAll('.el-tree-node')
                let nodesVue = [].map.call(nodesDOM, node => node.__vue__)
                for (let node of nodesVue.filter(
                    item => item.indeterminate === true
                )) {
                    let { id, parentId } = {
                        id: node.$options.propsData.node.data.id,
                        parentId: node.$options.propsData.node.data.parentId
                    }
                    set.add(id)
                    set.add(parentId)
                }
            }

            this.roleForm.permissions = [...set].join(',')
        }
    }
}
</script>

<style>
.fr{
    float:right;
}
.fl{
    float:left;
}
.search-bar{
    overflow: hidden;
}
.tools-bar{
    margin-bottom:20px;
}
</style>
