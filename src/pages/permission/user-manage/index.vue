<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-input style="display: none;"></el-input>
        <el-form-item label="登录名称">
          <el-input v-model="searchData.loginName" placeholder="登录名称" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <div class="fl">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增用户'">新增用户</el-button>
    </div>
    <div>
      <el-table
        v-loading.body="tableLoading"
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
          prop="status"
          label="停用/启用"
          align="center"
          min-width="100">
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.status=='1'" color="#13CE66">启用</el-tag>
            <el-tag v-if="scope.row.status=='0'" color="#FF4949">停用</el-tag> -->
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text=""
              inactive-text=""
              @change="handleStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="name"
          label="真实姓名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          width="130">
        </el-table-column>
        <el-table-column
          prop="roleList"
          :formatter="roleFormatter"
          min-width="210"
          label="权限">
        </el-table-column>
        <el-table-column
          prop="address"
          min-width="200"
          label="联系地址">
        </el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱"
          width="250">
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          label="最后登录时间"
          :formatter="toDateTime"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="170">
          <template slot-scope="scope">
  <div>
    <el-button
      type="text"
      size="small"
      @click="handleEdit(scope.$index, scope.row)"
    >编辑</el-button>
    <el-button
      type="text"
      size="small"
      @click="handleResetPwd(scope.$index, scope.row)"
    >重置密码</el-button>
  </div>
</template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="80px">
        <el-form-item label="登录名" prop="loginName">
          <template v-if="dialogTitle=='修改用户信息'">{{dataForm.loginName}}</template>
          <el-input v-else v-model="dataForm.loginName" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleIds">
          <el-select v-model="dataForm.tempRoleIds" multiple placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
              <el-input v-model="dataForm.name" placeholder="真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="dataForm.mobile" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="dataForm.address" placeholder="联系地址"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="dataForm.email" placeholder="电子邮箱"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" @click="onDialogSubmit()" v-if="dialogTitle=='修改用户信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { getUserList } from '@/api/permission'
import moment from 'moment'
export default {
    data() {
        return {
            totalRecord: 0,
            pageSize: 10,
            tableLoading: false,
            dialogVisible: false,
            dialogTitle: '新增用户',
            roles: [
                {
                    id: 1,
                    roleName: '超级管理员'
                },
                {
                    id: 2,
                    roleName: '普通用户'
                }
            ],
            defaultTreeProps: {
                children: 'childPermList',
                label: 'permissionName'
            },
            rules: {
                loginName: [
                    {
                        required: true,
                        message: '登录名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 50,
                        message: '登录名长度在 1 到 50 个字符',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '真实姓名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '真实姓名长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '联系电话不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13|15|18|14|17)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur, change'
                    }
                ]
            },
            searchData: {
                loginName: ''
            },
            dataForm: {
                id: '',
                loginName: '',
                tempRoleIds: [],
                roleIds: '',
                name: '',
                mobile: '',
                address: '',
                email: ''
            },
            tableData: []
        }
    },
    created() {
        this.initList()
    },
    methods: {
        async initList() {
            const data = await getUserList()
            this.tableData = data
        },
        handleStatus(row) {},
        statusFormat(row, column, cellValue) {
            return { '0': '停用', '1': '启用' }[cellValue] || ''
        },
        onDialogClose() {
            this.dataForm.tempRoleIds = []
            this.$refs.dataForm.resetFields()
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
                loginName: ''
            }
            this.onSearch()
        },
        onSearch({ pageNumber = 1 } = {}) {},
        toDateTime(row, column, cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                : ''
        },
        roleFormatter(row, column, cellValue) {
            let result = []
            if (typeof row.erpMemberRoles === 'object' && row.erpMemberRoles.length > 0) {
                for (let item of row.erpMemberRoles) {
                    result.push(item.roleName)
                }
            }
            return result.join('，')
        },
        handleChangeStatus(index, row) {},
        handleResetPwd(index, row) {
            this.$confirm('确认重置该用户的登录密码？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {})
        },
        handleEdit(index, row) {
            this.dialogVisible = true
            this.dialogTitle = '修改用户信息'
            this.dataForm.tempRoleIds = []
            for (let x of Object.keys(this.dataForm)) {
                if (
                    x === 'tempRoleIds' &&
                    typeof row.roleList === 'object' &&
                    row.roleList.length > 0
                ) {
                    for (let item of row.roleList) {
                        this.dataForm.tempRoleIds.push(item.id)
                    }
                } else {
                    this.dataForm[x] = row[x]
                }
            }
        },
        onDialogSubmit() {}
    }
}
</script>

<style lang="scss">
.fr{
    float:right;
}
.fl{
    float:left;
}
.search-bar{
    overflow: hidden;
}
</style>

<style>
.tools-bar{
  margin-bottom:20px;
}
</style>
