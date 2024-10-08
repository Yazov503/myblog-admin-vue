<template>
  <div class="blog-management">
    <el-card class="box-card">
      <div class="search-banner">
        <el-input v-model="queryText" placeholder="搜索博客" @input="handleSearch" @keyup.enter="handleSearch"
          style="width: 200px;" />
        <el-input v-model="queryUserId" placeholder="按用户ID" @input="handleSearch" @keyup.enter="handleSearch"
          style="width: 100px;" />
        <el-date-picker v-model="queryCreateTime" type="daterange" range-separator=":" start-placeholder="开始日期"
          end-placeholder="结束日期" @change="handleSearch" style="width: 250px;" />
        <div class="tag-selector">
          <div v-for="(tag) in displayTags" :key="tag.id" class="tag-item"
            :class="{ selected: selectedTags.includes(tag.id) }" @click="toggleTag(tag.id)">
            {{ tag.tagName }}
          </div>
          <button v-if="showExpandButton" @click="toggleTagVisibility" class="expand-button">
            <svg class="icon" aria-hidden="true" v-if="expanded">
              <use xlink:href="#icon-zhankai-copy"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-if="!expanded">
              <use xlink:href="#icon-zhankai"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="sortedBlogs" @sort-change="handleSortChange">
          <el-table-column prop="id" label="ID" sortable="custom" width="auto" />
          <el-table-column prop="title" label="标题" sortable="custom" width="auto" />
          <el-table-column prop="userId" label="用户ID" sortable="custom" width="auto" min-width="100px" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="auto" />
          <el-table-column prop="updateTime" label="更新时间" sortable="custom" width="auto" />
          <el-table-column label="标签" width="auto">
            <template slot-scope="scope">
              <div>
                <span v-for="(tagName) in scope.row.tagNames" :key="tagName" class="blog-tag"
                  :style="{ backgroundColor: getTagColor(tagName) }">
                  <span>{{ tagName }}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button @click="handleDetail(scope.row)" type="primary" size="small">详情</el-button>
              <el-button @click="handleDrawback(scope.row)" type="danger" size="small">退回</el-button>
              <el-button @click="handleDelete(scope.row.id)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination background layout="prev, pager, next" :total="totalBlogs" :page-size="pageSize"
        @current-change="handlePageChange" class="el-pagination" />
    </el-card>

    <!-- <el-dialog title="博客详情" :visible.sync="dialogVisible" width="50%">
      <el-form :model="currentBlog">
        <el-form-item label="标题">
          <div>{{ currentBlog.title }}</div>
        </el-form-item>
        <el-form-item label="内容">
          <div v-html="currentBlog.content"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="博客详情" :visible.sync="dialogVisible" style="margin-top: 0;">
      <blog-detail :blogId="currentBlog.id"></blog-detail>
    </el-dialog>
  </div>
</template>

<script>
import { getBlogsByPage, deleteBlog, drawbackBlog } from '@/api/blog';
import { getTags } from '@/api/tag';
import BlogDetail from '@/components/BlogDetail.vue';

export default {
  components: { BlogDetail },
  data() {
    return {
      blogs: [],
      totalBlogs: 0,
      dialogVisible: false,
      currentBlog: {
        id: null,
        title: '',
        content: '',
        tagNames: [], // 初始化 tagNames
      },
      pageNum: 1,
      pageSize: 10,
      queryText: '',
      queryCreateTime: [],
      queryUserId: null,
      sortField: 'createTime',
      sortOrder: 'descending',
      tagColors: ['#defcf9', '#cadefc', '#ffc7c7', '#ffe2e2', "#abedd8", "#dcedc1"], // 标签颜色
      tagColorMap: {},
      tags: [],
      selectedTags: [],
      expanded: false,
    };
  },
  computed: {
    sortedBlogs() {
      return this.blogs.slice().sort((a, b) => {
        const fieldA = a[this.sortField];
        const fieldB = b[this.sortField];
        if (this.sortOrder === 'ascending') {
          return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
        } else {
          return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
        }
      });
    },
    displayTags() {
      const selectedTags = this.tags.filter(tag => this.selectedTags.includes(tag.id));
      const unselectedTags = this.tags.filter(tag => !this.selectedTags.includes(tag.id));
      const sortedTags = [...selectedTags, ...unselectedTags];
      return this.expanded ? sortedTags : sortedTags.slice(0, 5);
    },
    showExpandButton() {
      return this.tags.length > 5;
    }
  },
  created() {
    this.fetchTags();
    this.fetchBlogs();
  },
  methods: {
    async fetchBlogs() {
      try {
        await getBlogsByPage({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          queryText: this.queryText,
          queryTags: this.selectedTags,
          userId: this.queryUserId,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
          createTimeStart: this.queryCreateTime && this.queryCreateTime.length > 0 ? this.queryCreateTime[0] : null,
          createTimeEnd: this.queryCreateTime && this.queryCreateTime.length > 0 ? this.queryCreateTime[1] : null,
        }).then((response) => {
          this.totalBlogs = response.data.data.total;
          this.blogs = response.data.data.records;
        });
      } catch (error) {
        console.error('获取博客信息失败:', error);
      }
    },
    handleDetail(blog) {
      this.currentBlog = { ...blog };
      this.dialogVisible = true;
    },
    async handleDelete(blogId) {
      try {
        await deleteBlog(blogId)
          .then((response) => {
            if (response.data.code === 200) {
              this.$message.success('删除成功');
              this.fetchBlogs();
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('删除博客失败:', error);
            this.$message.error('删除博客失败');
          });
      } catch (error) {
        console.error('删除博客失败:', error);
      }
    },
    async handleDrawback(blog) {
      try {
        await drawbackBlog(blog)
          .then((response) => {
            if (response.data.code === 200) {
              this.$message.success('退回成功');
              this.fetchBlogs();
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.error('退回博客失败:', error);
            this.$message.error('退回博客失败');
          });
      } catch (error) {
        console.error('退回博客失败:', error);
      }
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.fetchBlogs();
    },
    handleSearch() {
      this.pageNum = 1;
      this.fetchBlogs();
    },
    handleSortChange({ prop, order }) {
      this.sortField = prop;
      this.sortOrder = order;
      this.fetchBlogs();
    },
    async fetchTags() {
      getTags().then(response => {
        if (response.data.code === 200) {
          this.tags = response.data.data;
          this.assignColorsToTags();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch(error => {
        this.$message.error('获取标签失败:', error);
      });
    },
    getTagColor(tagName) {
      return this.tagColorMap[tagName] || '#e0e0e0';
    },
    assignColorsToTags() {
      this.tags.forEach(tag => {
        if (!this.tagColorMap[tag.tagName]) {
          this.tagColorMap[tag.tagName] = this.getRandomColor();
        }
      });
    },
    getRandomColor() {
      return this.tagColors[Math.floor(Math.random() * this.tagColors.length)];
    },
    toggleTagVisibility() {
      this.expanded = !this.expanded;
    },
    toggleTag(tagId) {
      if (this.selectedTags.includes(tagId)) {
        this.selectedTags = this.selectedTags.filter(id => id !== tagId);
      } else {
        this.selectedTags.push(tagId);
      }
      this.pageNum = 1;
      this.fetchBlogs(this.pageNum);
    },
  }
};
</script>

<style lang="less" src="@/assets/css/BlogManagement.less" scoped></style>
