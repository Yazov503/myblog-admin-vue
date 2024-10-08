<template>
  <div class="login-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="login-title">管理员登录</span>
      </div>
      <div class="login-form">
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-user"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%;" type="primary" @click="handleLogin" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { adminLogin } from '@/api/admin';


export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: ''
      },
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      adminLogin({
        username: this.loginForm.username,
        password: this.loginForm.password,
      }).then((response) => {
        console.log(response)
        if (response.data.code == 200) {
          localStorage.setItem("token", response.data.data['token'])
          this.$router.push('/admin/dashboard');
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch(() => {
        this.$message.error('登录失败');
      });
    }
  }
}
</script>

<style scoped>
.login-page {
  background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-title {
  font-size: 20px;
}

.box-card {
  width: 375px;
}
</style>
