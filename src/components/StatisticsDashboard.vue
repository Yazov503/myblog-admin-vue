<template>
  <el-card class="statistics-dashboard">
    <div slot="header" class="clearfix">
      <span>统计数据</span>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12">
        <blog-count-chart></blog-count-chart>
      </el-col>
      <el-col :xs="24" :sm="12">
        <comment-count-chart></comment-count-chart>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import BlogCountChart from './statisticsCharts/BlogCountChart.vue';
import CommentCountChart from './statisticsCharts/CommentCountChart.vue';

export default {
  name: 'StatisticsDashboard',
  components: {
    BlogCountChart,
    CommentCountChart
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.statistics-dashboard {
  margin: 20px;
}

.el-row {
  margin-top: 20px;
}

.el-col {
  padding: 10px;
}
</style>
