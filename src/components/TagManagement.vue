<template>
  <div class="tag-management">
    <el-card class="box-card">
      <el-button type="primary" @click="handleAdd" style="margin-right: 10px;">添加标签</el-button>
      
      <el-input v-model="queryText" placeholder="搜索标签" @input="handleSearch" @keyup.enter="handleSearch"
        class="search-input" />

      <div class="table-container">
        <el-table :data="sortedTags" @sort-change="handleSortChange">
          <el-table-column prop="id" label="ID" sortable="custom" width="auto" />
          <el-table-column prop="tagName" label="标签名" sortable="custom" width="auto" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="auto" />
          <el-table-column prop="updateTime" label="更新时间" sortable="custom" width="auto" />
          <el-table-column label="操作" width="auto">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row.id)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination background layout="prev, pager, next" :total="totalTags" :page-size="pageSize"
        @current-change="handlePageChange" class="el-pagination" />
    </el-card>

    <el-dialog title="编辑用户" :visible.sync="dialogVisible">
      <el-form :model="currentTag">
        <el-form-item label="标签名">
          <el-input v-model="currentTag.tagName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTag">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTagsByPage,
  createOrUpdateTag,
  deleteTag,
} from '@/api/tag';

export default {
  data() {
    return {
      tags: [],
      totalTags: 0,
      dialogVisible: false,
      currentTag: {
        id: null,
        tagName: '',
      },
      pageNum: 1,
      pageSize: 10,
      queryText: '',
      sortField: 'createTime',
      sortOrder: 'descending',
    };
  },
  computed: {
    sortedTags() {
      return this.tags.slice().sort((a, b) => {
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
    this.fetchTags();
  },
  methods: {
    async fetchTags() {
      try {
        await getTagsByPage({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          queryText: this.queryText,
        }).then((response) => {
          this.totalTags = response.data.data.total;
          this.tags = response.data.data.records;
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    handleEdit(tag) {
      this.currentTag = { ...tag };
      this.dialogVisible = true;
    },
    async handleSaveTag() {
      try {
        await createOrUpdateTag(this.currentTag)
          .then((response) => {
            if (response.data.code == 200) {
              this.dialogVisible = false;
              this.fetchTags();
              this.$message.success('信息保存成功!');
            } else {
              this.$message.error(response.data.msg);
            }
          }).catch(() => {
            this.$message.error('信息保存失败!');
          });
      } catch (error) {
        console.error('更新标签信息失败:', error);
      }
    },
    async handleDelete(tagId) {
      try {
        await deleteTag(tagId)
          .then((response) => {
            if (response.data.code == 200) {
              this.$message.success('删除成功');
              this.fetchTags();
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('删除标签失败:', error);
          });
        this.fetchTags();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    },
    handleAdd() {
      this.currentTag = {
        id: null,
        tagName: '',
      };
      this.dialogVisible = true;
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.fetchTags();
    },
    handleSearch() {
      this.pageNum = 1;
      this.fetchTags();
    },
    handleSortChange({ prop, order }) {
      this.sortField = prop;
      this.sortOrder = order;
      this.fetchTags();
    }
  }
};
</script>

<style lang="less" src="@/assets/css/TagManagement.less" scoped></style>
