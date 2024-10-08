<template>
  <div class="blackWord-management">
    <el-card class="box-card">
      <el-button type="primary" @click="handleAdd" style="margin-right: 10px;">添加单词</el-button>
      
      <el-input v-model="queryText" placeholder="搜索标签" @input="handleSearch" @keyup.enter="handleSearch"
        class="search-input" />

      <div class="table-container">
        <el-table :data="sortedBlackWords" @sort-change="handleSortChange">
          <el-table-column prop="id" label="ID" sortable="custom" width="auto" />
          <el-table-column prop="word" label="内容" sortable="custom" width="auto" />
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

      <el-pagination background layout="prev, pager, next" :total="totalBlackWords" :page-size="pageSize"
        @current-change="handlePageChange" class="el-pagination" />
    </el-card>

    <el-dialog title="编辑单词" :visible.sync="dialogVisible">
      <el-form :model="currentBlackWord">
        <el-form-item label="单词">
          <el-input v-model="currentBlackWord.word"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBlackWord">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlackWordsByPage,
  createOrUpdateSensitiveWord,
  deleteSensitiveword,
} from '@/api/sensitive-word.js';

export default {
  data() {
    return {
      blackWords: [],
      totalBlackWords: 0,
      dialogVisible: false,
      currentBlackWord: {
        id: null,
        word: '',
      },
      pageNum: 1,
      pageSize: 10,
      queryText: '',
      sortField: 'createTime',
      sortOrder: 'descending',
    };
  },
  computed: {
    sortedBlackWords() {
      return this.blackWords.slice().sort((a, b) => {
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
    this.fetchBlackWords();
  },
  methods: {
    async fetchBlackWords() {
      try {
        await getBlackWordsByPage({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          queryText: this.queryText,
        }).then((response) => {
          this.totalBlackWords = response.data.data.total;
          this.blackWords = response.data.data.records;
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    handleEdit(blackWord) {
      this.currentBlackWord = { ...blackWord };
      this.dialogVisible = true;
    },
    async handleSaveBlackWord() {
      try {
        await createOrUpdateSensitiveWord(this.currentBlackWord)
          .then((response) => {
            if (response.data.code == 200) {
              this.dialogVisible = false;
              this.fetchBlackWords();
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
    async handleDelete(blackWordId) {
      try {
        await deleteSensitiveword(blackWordId)
          .then((response) => {
            if (response.data.code == 200) {
              this.$message.success('删除成功');
              this.fetchBlackWords();
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('删除标签失败:', error);
          });
        this.fetchBlackWords();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    },
    handleAdd() {
      this.currentBlackWord = {
        id: null,
        word: '',
      };
      this.dialogVisible = true;
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.fetchBlackWords();
    },
    handleSearch() {
      this.pageNum = 1;
      this.fetchBlackWords();
    },
    handleSortChange({ prop, order }) {
      this.sortField = prop;
      this.sortOrder = order;
      this.fetchBlackWords();
    }
  }
};
</script>

<style lang="less" src="@/assets/css/BlacklistManagement.less" scoped></style>
