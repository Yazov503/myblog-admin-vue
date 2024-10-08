<template>
  <div class="author-info">
    <h1>作者信息</h1>
    <p><strong>姓名:</strong> 张三</p>
    <p><strong>职业:</strong> 软件工程师</p>
    <p><strong>邮箱:</strong> zhangsan@example.com</p>
    <p><strong>简介:</strong> 我是一个热爱编程的开发者，致力于构建高效、美观的应用程序。</p>
  </div>
</template>

<script>
export default {
  name: 'AuthorInfo',
};
</script>

<style scoped>
.author-info {
  padding: 20px;
}

.author-info h1 {
  margin-bottom: 20px;
}

.author-info p {
  font-size: 16px;
  line-height: 1.6;
}
</style>
