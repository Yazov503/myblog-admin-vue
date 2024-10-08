<template>
  <div class="chart-container">
    <div class="selector">
      <el-date-picker v-model="selectedYear" type="year" placeholder="选择年份" @change="fetchChartData" :clearable="false" />
    </div>
    <div class="chart" ref="charts" style="width: 100%; min-height: 300px;" />
  </div>
</template>

<script>
import { getCommentCount } from '@/api/common';

export default {
  name: 'StatisticsDashboard',
  data() {
    return {
      selectedYear: new Date(new Date().getFullYear(), 0, 1),
      zoomThreshold: 30,
      originalData: null,
      isZoomedIn: false,
      chartInstance: null,
    };
  },
  methods: {
    fetchChartData(date) {
      const year = date.getFullYear();
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      getCommentCount({ startDate, endDate })
        .then(response => {
          this.originalData = response.data.data;
          this.initChart(this.originalData, year);
        })
        .catch(error => {
          console.error('Failed to fetch chart data:', error);
        });
    },

    initChart(data, year) {
      const monthData = this.getMonthData(data);
      this.chartInstance = this.$echarts.init(this.$refs.charts,'default');
      this.chartInstance.setOption(this.getChartOptions(monthData, year));

      this.chartInstance.on('dataZoom', (event) => {
        this.handleZoom(event, data, monthData);
      });

      window.addEventListener("resize", () => {
        this.chartInstance.resize();
      });
    },

    getChartOptions(data, year) {
      return {
        title: {
          text: `评论统计 - ${year}`,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: Object.keys(data),
        },
        yAxis: {
          type: 'value',
        },
        dataZoom: [
          {
            type: 'inside',
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            start: 0,
            end: 100,
          },
          {
            type: 'slider',
          },
        ],
        series: [
          {
            data: Object.values(data),
            type: 'line',
            smooth: true,
          },
        ],
      };
    },

    handleZoom(event, dayData, monthData) {
      const zoomRange = event.batch?(event.batch[0].end - event.batch[0].start):(event.end - event.start);

      if (zoomRange < this.zoomThreshold && !this.isZoomedIn) {
        this.chartInstance.setOption({
          xAxis: {
            data: Object.keys(dayData),
          },
          series: [
            {
              data: Object.values(dayData),
            },
          ],
        });
        this.isZoomedIn = true;
      }

      if (zoomRange >= this.zoomThreshold && this.isZoomedIn) {
        this.chartInstance.setOption({
          xAxis: {
            data: Object.keys(monthData),
          },
          series: [
            {
              data: Object.values(monthData),
            },
          ],
        });
        this.isZoomedIn = false;
      }
    },

    getMonthData(data) {
      const monthData = {};
      Object.keys(data).forEach(date => {
        const month = date.slice(0, 7);
        if (!monthData[month]) {
          monthData[month] = 0;
        }
        monthData[month] += data[date];
      });
      return monthData;
    },
  },
  created() {
    this.fetchChartData(new Date());
  },
};
</script>

<style scoped>
.chart-container {
  margin-bottom: 20px;
}

.selector {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.selector>* {
  margin-right: 20px;
}
</style>
