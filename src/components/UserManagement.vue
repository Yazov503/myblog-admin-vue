<template>
  <div class="user-management">
    <el-card class="box-card">
      <el-input v-model="queryText" placeholder="搜索用户" @input="handleSearch" @keyup.enter="handleSearch"
        class="search-input" />

      <div class="table-container">
        <el-table :data="sortedUsers" @sort-change="handleSortChange">
          <el-table-column prop="id" label="ID" sortable="custom" min-width="30px" />
          <el-table-column prop="avatar" label="头像" class="avatar-column" min-width="80px">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" alt="avatar" class="avatar">
            </template>
          </el-table-column>
          <el-table-column prop="email" label="Email" sortable="custom" width="auto" min-width="150px" />
          <el-table-column prop="username" label="用户名" sortable="custom" width="auto" />
          <el-table-column prop="sex" label="性别" width="50px">
            <template slot-scope="scope">
              {{ sexLabels[scope.row.sex] }}
            </template>
          </el-table-column>
          <el-table-column prop="isMuted" label="状态" width="50px">
            <template slot-scope="scope">
              <div v-if="scope.row.isMuted">
                禁言
              </div>
              <div v-else>
                正常
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="150px" />
          <el-table-column prop="updateTime" label="更新时间" sortable="custom" width="150px" />
          <el-table-column label="操作" min-width="150px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button @click="handleCancelMute(scope.row.id)" type="primary" size="small" v-if="scope.row.isMuted">
                解禁
              </el-button>
              <el-button @click="handleShowMute(scope.row)" type="danger" size="small" v-else>
                禁言
              </el-button>
              <el-button @click="handleDelete(scope.row.id)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination background layout="prev, pager, next" :total="totalUsers" :page-size="pageSize"
        @current-change="handlePageChange" class="el-pagination" />
    </el-card>

    <el-dialog title="编辑用户" :visible.sync="dialogVisible">
      <el-form :model="currentUser">
        <el-form-item label="Email">
          <el-input v-model="currentUser.email"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="currentUser.username"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="currentUser.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="禁言用户" :visible.sync="muteDialogVisible">
      <div class="mute-day-input-wrapper">
        <el-input v-model.number="muteDay" placeholder="请输入禁言天数" type="number" min="0" class="mute-day-input">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="muteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMute">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cancelMute, mute } from '@/api/admin';
import {
  updateUserinfo,
  getUsersByPage,
  deleteUserById
} from '@/api/user';

export default {
  data() {
    return {
      users: [],
      totalUsers: 0,
      dialogVisible: false,
      muteDialogVisible: false,
      currentUser: {
        id: null,
        email: '',
        username: '',
        avatar: '',
        sex: 2
      },
      pageNum: 1,
      pageSize: 10,
      queryText: '',
      sexLabels: {
        0: '男',
        1: '女',
        2: '未知'
      },
      sortField: 'createTime',
      sortOrder: 'descending',
      muteDay: 0
    };
  },
  computed: {
    sortedUsers() {
      return this.users.slice().sort((a, b) => {
        const fieldA = a[this.sortField];
        const fieldB = b[this.sortField];
        if (this.sortOrder === 'ascending') {
          return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
        } else {
          return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
        }
      });
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        await getUsersByPage({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          queryText: this.queryText,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
        }).then((response) => {
          this.totalUsers = response.data.data.total;
          this.users = response.data.data.records;
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    handleEdit(user) {
      this.currentUser = { ...user };
      this.dialogVisible = true;
    },
    async handleSaveUser() {
      try {
        await updateUserinfo(this.currentUser)
          .then((response) => {
            if (response.data.code == 200) {
              this.dialogVisible = false;
              this.fetchUsers();
              this.$message.success('信息保存成功!');
            } else {
              this.$message.error(response.data.msg);
            }
          }).catch(() => {
            this.$message.error('信息保存失败!');
          });
      } catch (error) {
        console.error('更新用户信息失败:', error);
      }
    },
    async handleDelete(userId) {
      try {
        await deleteUserById(userId);
        this.fetchUsers();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    },
    async handleShowMute(user) {
      this.currentUser = user
      this.muteDay = 0
      this.muteDialogVisible = true;
    },
    async handleMute() {
      if (this.muteDay <= 0) return;
      mute({
        userId: this.currentUser.id,
        muteDay: this.muteDay
      })
        .then((response) => {
          if (response.data.code == 200) {
            this.$message.success('禁言成功')
            this.muteDialogVisible = false
            this.fetchUsers()
          } else {
            this.$message.error(response.data.msg)
          }
        })
    },
    async handleCancelMute(userId) {
      cancelMute(userId)
        .then((response) => {
          if (response.data.code == 200) {
            this.$message.success('解禁成功')
            this.fetchUsers()
          } else {
            this.$message.error(response.data.msg)
          }
        })
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.fetchUsers();
    },
    handleSearch() {
      this.pageNum = 1;
      this.fetchUsers();
    },
    handleSortChange({ prop, order }) {
      this.sortField = prop;
      this.sortOrder = order;
      this.fetchUsers();
    }
  }
};
</script>

<style lang="less" src="@/assets/css/UserManagement.less" scoped></style>
