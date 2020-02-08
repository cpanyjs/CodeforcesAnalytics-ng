<template>
  <div ref="pie"></div>
</template>

<script>
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

export default {
  name: 'PieChart',
  props: {
    data: Object
  },
  data: () => ({}),
  methods: {
    renderChart() {
      const ds = new DataSet();
      const dv = ds.createView().source(this.data.submission);
      dv.transform({
        type: 'aggregate',
        fields: ['verdict'],
        operations: ['count'],
        as: ['value'],
        groupBy: ['verdict']
      });
      dv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'verdict',
        as: 'percent'
      });
      dv.transform({
        type: 'sort-by',
        fields: ['value'],
        order: 'DESC'
      });
      const chart = new Chart({
        container: this.$refs['pie'],
        forceFit: true,
        height: 500,
        padding: 'auto'
      });
      chart.source(dv);
      chart.tooltip({
        showTitle: false
      });
      chart.legend({
        position: 'right-center',
        offsetX: -100
      });
      chart.coord('theta', {
        radius: 1.0
      });
      const pie = chart
        .intervalStack()
        .position('value')
        .color('verdict', verdict => {
          if (verdict === 'OK') {
            return '#00AA00';
          } else if (verdict === 'WRONG_ANSWER') {
            return '#FF0000';
          }
        })
        .style({ opacity: 0.4 })
        .select(true, {
          style: {
            stroke: 'black',
            lineWidth: 2,
            opacity: 1
          }
        })
        .label('value', val => {
          if (val < 20) {
            return null;
          }
          const opacity = 1;
          return {
            offset: -20,
            textStyle: {
              opacity,
              fill: 'white',
              fontSize: 12,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            formatter: (text, item) => {
              const d = item.point;
              return d.verdict + '\n' + (d.percent * 100).toFixed(0) + '%';
            }
          };
        });
      chart.render();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.renderChart();
    });
  }
};
</script>

<style></style>
