<template>
  <div class="bulletin-management">
    <el-card class="box-card">
      <el-button type="primary" @click="handleAdd" style="margin-right: 10px;">添加公告</el-button>

      <el-input v-model="queryText" placeholder="搜索公告" @input="handleSearch" @keyup.enter="handleSearch"
        class="search-input" />

      <el-button type="default" @click="handleRefresh" class="refresh-button">
        <i class="el-icon-refresh"></i>
      </el-button>

      <div class="table-container">
        <el-table :data="sortedBulletins" @sort-change="handleSortChange">
          <el-table-column prop="id" label="ID" sortable="custom" min-width="30px" />
          <el-table-column prop="content" label="内容" min-width="100px" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="150px" />
          <el-table-column prop="updateTime" label="更新时间" sortable="custom" min-width="150px" />
          <el-table-column label="操作" min-width="150px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row.id)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination background layout="prev, pager, next" :total="totalBulletins" :page-size="pageSize"
        @current-change="handlePageChange" class="el-pagination" />
    </el-card>

    <el-dialog title="编辑公告" :visible.sync="dialogVisible">
      <el-form :model="currentBulletin">
        <el-form-item label="content">
          <el-input v-model="currentBulletin.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBulletin">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createOrUpdateBulletin,
  getBulletinsByPage,
  deleteBulletinById
} from '@/api/admin';

export default {
  data() {
    return {
      bulletins: [],
      totalBulletins: 0,
      dialogVisible: false,
      currentBulletin: {

      },
      pageNum: 1,
      pageSize: 10,
      userId: '',
      queryText: '',
      sortField: 'createTime',
      sortOrder: 'descending',
      muteDay: 0
    };
  },
  computed: {
    sortedBulletins() {
      return this.bulletins.slice().sort((a, b) => {
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
    this.fetchBulletins();
  },
  methods: {
    async fetchBulletins() {
      try {
        await getBulletinsByPage({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          queryText: this.queryText,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
        }).then((response) => {
          this.totalBulletins = response.data.data.total;
          this.bulletins = response.data.data.records;
        });
      } catch (error) {
        console.error('获取公告信息失败:', error);
      }
    },
    handleEdit(bulletin) {
      this.currentBulletin = { ...bulletin };
      this.dialogVisible = true;
    },
    async handleSaveBulletin() {
      try {
        await createOrUpdateBulletin(this.currentBulletin)
          .then((response) => {
            if (response.data.code == 200) {
              this.dialogVisible = false;
              this.fetchBulletins();
              this.$message.success('信息保存成功!');
            } else {
              this.$message.error(response.data.msg);
            }
          }).catch(() => {
            this.$message.error('信息保存失败!');
          });
      } catch (error) {
        console.error('更新公告信息失败:', error);
      }
    },
    async handleDelete(bulletinId) {
      try {
        await deleteBulletinById(bulletinId);
        this.fetchBulletins();
      } catch (error) {
        console.error('删除公告失败:', error);
      }
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.fetchBulletins();
    },
    handleSearch() {
      this.pageNum = 1;
      this.fetchBulletins();
    },
    handleSortChange({ prop, order }) {
      this.sortField = prop;
      this.sortOrder = order;
      this.fetchBulletins();
    },
    handleAdd() {
      this.currentBulletin = {
        id: null,
        content: '',
      };
      this.dialogVisible = true;
    },
    handleRefresh() {
      this.fetchBulletins()
    },
  }
};
</script>

<style lang="less" src="@/assets/css/BulletinManagement.less" scoped></style>
