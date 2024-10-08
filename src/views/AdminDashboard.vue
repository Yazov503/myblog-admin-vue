<template>
  <div id="admin-dashboard">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <el-menu :default-active="activeMenu" @select="handleSelect" class="el-menu-vertical-demo">
          <el-menu-item index="1" class="title">
            <i class="el-icon-menu"></i>
            <span slot="title">仪表盘</span>
          </el-menu-item>
          <el-menu-item index="2" class="title">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span style="color: #fff;">博客管理</span>
            </template>
            <el-menu-item index="3-1" class="title">文章管理</el-menu-item>
            <el-menu-item index="3-2" class="title">文章审核</el-menu-item>
            <el-menu-item index="3-3" class="title">标签管理</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span style="color: #fff;">敏感词管理</span>
            </template>
            <el-menu-item index="4-1" class="title">黑名单</el-menu-item>
            <el-menu-item index="4-2" class="title">白名单</el-menu-item>
          </el-submenu>
          <el-menu-item index="5" class="title">
            <i class="el-icon-bell"></i>
            <span slot="title">公告管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>管理员</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="user-info">
            <el-dropdown>
              <span class="el-dropdown-link">
                管理员 <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人资料</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <div v-if="currentPage === '1'">
            <statistics-dashboard></statistics-dashboard>
          </div>
          <div v-else-if="currentPage === '2'">
            <user-management></user-management>
          </div>
          <div v-else-if="currentPage === '3'">
            <p>这里是博客管理的内容。</p>
          </div>
          <div v-else-if="currentPage === '3-1'">
            <blog-management></blog-management>
          </div>
          <div v-else-if="currentPage === '3-2'">
            <blog-review></blog-review>
          </div>
          <div v-else-if="currentPage === '3-3'">
            <tag-management></tag-management>
          </div>
          <div v-else-if="currentPage === '4-1'">
            <blacklist-management></blacklist-management>
          </div>
          <div v-else-if="currentPage === '4-2'">
            <whitelist-management></whitelist-management>
          </div>
          <div v-else-if="currentPage === '5'">
            <bulletin-management></bulletin-management>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import UserManagement from '@/components/UserManagement.vue';
import BlogManagement from '@/components/BlogManagement.vue';
import TagManagement from '@/components/TagManagement.vue';
import BlogReview from '@/components/BlogReview.vue';
import StatisticsDashboard from '@/components/StatisticsDashboard.vue';
import BulletinManagement from '@/components/BulletinManagement.vue';
import BlacklistManagement from '@/components/BlacklistManagement';
import WhitelistManagement from '@/components/WhitelistManagement';

export default {
  name: 'AdminDashboard',
  components: {
    UserManagement,
    BlogManagement,
    TagManagement,
    BlogReview,
    StatisticsDashboard,
    BulletinManagement,
    BlacklistManagement,
    WhitelistManagement,
  },
  data() {
    return {
      activeMenu: '1',
      currentPage: '1',
    };
  },
  methods: {
    handleSelect(key) {
      this.activeMenu = key;
      this.currentPage = key;
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/admin/login');
    },
  },
  computed: {
    currentPageTitle() {
      switch (this.currentPage) {
        case '1':
          return '仪表盘';
        case '2':
          return '用户管理';
        case '3':
          return '博客管理';
        case '3-1':
          return '文章管理';
        case '3-2':
          return '文章审核';
        case '3-3':
          return '标签管理';
        case '4-1':
          return '黑名单';
        case '4-2':
          return '白名单';
        case '5':
          return '公告管理';
        default:
          return '未知页面';
      }
    },
  },
};
</script>

<style lang="less" src="@/assets/css/AdminDashboard.less" scoped></style>
