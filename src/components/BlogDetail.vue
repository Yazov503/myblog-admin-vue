<template>
  <div>
    <div class="blog-detail-container">
      <div class="blog-detail-content">
        <h1 class="blog-title">{{ blog.title }}</h1>
        <div class="blog-meta">
          <span @click="goToPersonalPage(blog.userId)" class="jump-to-personal">
            <img :src="blog.avatar" alt="Author Avatar" class="author-avatar" />{{ blog.username }}
          </span>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-liulanshu"></use>
            </svg>
            {{ blog.browseNum }}
          </span>
          <span :class="{ liked: blog.liked }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianzanshu" v-if="!blog.liked"></use>
              <use xlink:href="#icon-dianzanshu-pink-copy" v-if="blog.liked"></use>
            </svg>
            {{ blog.likeNum }}
          </span>
          <span :class="{ collected: blog.collected }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang" v-if="!blog.collected"></use>
              <use xlink:href="#icon-shoucang-copy" v-if="blog.collected"></use>
            </svg>
            {{ blog.collectNum }}
          </span>
        </div>
        <div class="blog-tags">
          <svg class="icon" aria-hidden="true" style="margin-right: 10px">
            <use xlink:href="#icon-biaoqian_o"></use>
          </svg>
          <span v-for="tag in blog.tagNames" :key="tag" class="blog-tag">
            {{ tag }}
          </span>
        </div>
        <div class="blog-content" v-html="blog.content" @click="handleImageClick" v-viewer></div>
      </div>

      <!-- 评论区 -->
      <div class="comment-section">
        <div class="comments-display">
          <h3>查看评论<span style="color: #737373;font-size: 0.7em;margin-left: 10px;">共 {{ total }} 条</span></h3>
          <ul v-if="comments.length > 0">
            <!-- 评论部分 -->
            <li v-for="(comment) in comments" :key="comment.id" class="comment-item">
              <img :src="comment.avatar" alt="Comment Avatar" class="comment-avatar" />
              <div class="comment-content">
                <p><strong v-if="comment.username" @click="goToPersonalPage(comment.userId)" class="jump-to-personal">
                    {{ comment.username }}</strong>
                  <strong v-else>用户已注销</strong>
                </p>
                <p v-html="comment.content" @click="handleImageClick" v-viewer></p>
                <div class="comment-meta">
                  <p class="comment-time">{{ formatTime(comment.createTime) }}</p>
                  <div class="comment-like-num">
                    <svg class="icon" aria-hidden="true" v-if="!comment.liked">
                      <use xlink:href="#icon-dianzanshu"></use>
                    </svg>
                    <p v-if="!comment.liked">{{ comment.likeNum }}</p>
                    <svg class="icon" aria-hidden="true" v-if="comment.liked">
                      <use xlink:href="#icon-dianzanshu-pink-copy"></use>
                    </svg>
                    <p style="color: rgb(255, 125, 147);" v-if="comment.liked">{{ comment.likeNum }}</p>
                  </div>
                  <!-- 删除评论按钮 -->
                  <el-button slot="reference" class="delete-button" @click="deleteComment(comment.id)">
                    <svg class="icon" aria-hidden="true" style="width: 20px;">
                      <use xlink:href="#icon-shanchu"></use>
                    </svg>
                  </el-button>
                </div>
                <!-- 回复部分 -->
                <ul v-if="comment.replies && comment.replies.length > 0" class="replies">
                  <li v-for="(reply) in visibleReplies(comment.id, comment.replies)" :key="reply.id">
                    <p v-if="reply.parentId === 0">
                      <span class="username">{{ reply.username }}:</span>
                      <span class="reply-content">{{ reply.content }}</span>
                    </p>
                    <p v-else>
                      <span class="username"><span @click="goToPersonalPage(reply.userId)" class="jump-to-personal">{{
                        reply.username }}</span>
                        回复 <span @click="goToPersonalPage(reply.repliedUserId)" class="jump-to-personal">{{
                          reply.repliedUsername }}</span>:</span>
                      <span class="reply-content">{{ reply.content }}</span>
                    </p>
                    <div class="reply-meta">
                      <p>{{ formatTime(reply.createTime) }}</p>
                      <div class="reply-like-num">
                        <svg class="icon" aria-hidden="true" v-if="!reply.liked">
                          <use xlink:href="#icon-dianzanshu"></use>
                        </svg>
                        <p v-if="!reply.liked">{{ reply.likeNum }}</p>
                        <svg class="icon" aria-hidden="true" v-if="reply.liked">
                          <use xlink:href="#icon-dianzanshu-pink-copy"></use>
                        </svg>
                        <p style="color: rgb(255, 125, 147);" v-if="reply.liked">{{ reply.likeNum }}</p>
                      </div>
                      <!-- 删除回复按钮 -->
                      <el-button slot="reference" class="delete-button" @click="deleteReply(reply.id)">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-shanchu"></use>
                        </svg>
                      </el-button>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <p v-else>暂无评论</p>
          <el-pagination v-if="total > pageSize" background layout="prev, pager, next" :current-page="pageNum"
            :page-size="pageSize" :total="total" @current-change="handlePageChange" class="pagination" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";

import { getBlogById } from "@/api/blog";
import { deleteComment, getCommentsByPage } from "@/api/comment";
import { deleteReply } from "@/api/reply";


export default {
  components: {
  },
  props: {
    blogId: {
    },
  },
  data() {
    return {
      blog: {},
      comments: [],
      isExpanded: {},
      pageNum: 1,
      pageSize: 5,
      total: 0,
    };
  },
  created() {
    this.fetchBlogDetail();
  },
  methods: {
    fetchBlogDetail() {
      getBlogById(this.blogId)
        .then((response) => {
          if (response.data.code === 200) {
            this.blog = response.data.data;
            this.fetchComments();
          }
        })
        .catch((error) => {
          console.error("Error fetching blog detail:", error);
        });
    },
    handleImageClick(event) {
      if (event.target.tagName === "IMG") {
        this.showImageModal(event.target.src);
      }
    },
    showImageModal(src) {
      this.modalImageSrc = src;
      this.isImageModalVisible = true;
    },
    closeImageModal() {
      this.isImageModalVisible = false;
      this.modalImageSrc = "";
    },
    fetchComments() {
      getCommentsByPage({
        blogId: this.blog.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.data.code === 200) {
            this.comments = response.data.data.records;
            this.total = response.data.data.total;
          } else {
            this.$message.error(response.data.msg || "获取评论失败");
          }
        })
        .catch((error) => {
          this.$message.error("获取评论失败");
          console.error("获取评论失败:", error);
        });
    },
    formatTime(createTime) {
      const now = new Date();
      const commentTime = new Date(createTime);
      const diffInSeconds = Math.floor((now - commentTime) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);

      if (diffInSeconds < 60) {
        return `${diffInSeconds}秒前`;
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
      } else if (diffInHours < 24) {
        return `${diffInHours}小时前`;
      } else {
        return createTime; // 直接显示完整时间
      }
    },
    visibleReplies(commentId, replies) {
      return replies.slice(0, this.isExpanded[commentId] ? replies.length : 2);
    },
    toggleExpand(commentId) {
      this.$set(this.isExpanded, commentId, !this.isExpanded[commentId]);
    },
    goToPersonalPage(userId) {
      const routeUrl = this.$router.resolve('/user/' + userId)
      window.open(routeUrl.href, '_blank')
    },
    handlePageChange(newPage) {
      this.pageNum = newPage;
      this.fetchComments(); // 切换页面时重新获取评论
    },
    deleteComment(commentId) {
      this.$confirm('确定删除此评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteComment(commentId)
          .then((response) => {
            if (response.data.code == 200) {
              this.$message.success('评论已删除');
              this.fetchComments();
            } else {
              this.$message.error(response.data.msg);
            }
          }).catch(() => {
            this.$message.error('删除失败');
          });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 删除回复的方法
    deleteReply(replyId) {
      this.$confirm('确定删除此回复吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteReply(replyId)
          .then((response) => {
            if (response.data.code === 200) {
              this.$message.success('回复已删除');
              this.fetchComments();
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            console.error('删除回复失败:', error);
          });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
  },
  watch: {
    blogId(newBlogId) {
      if (newBlogId) {
        this.fetchBlogDetail()
      }
    }
  }
};
</script>

<style lang="less" src="@/assets/css/BlogDetail.less" scoped></style>
