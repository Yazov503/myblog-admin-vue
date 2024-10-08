import Vue from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, DataZoomComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';
import theme from '@/assets/echarts/theme.json'

Vue.prototype.$echarts = echarts

echarts.registerTheme('default',theme)

Vue.component('v-chart', VChart);
// 注册 ECharts 组件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, DataZoomComponent]);