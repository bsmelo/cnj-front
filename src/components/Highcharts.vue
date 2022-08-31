<template>
  <div class="Highcharts_Layout">
    <div v-if="noData" class="Highcharts_Empty">
      <div v-if="config.title" class="Highcharts_TitleEmpty">{{ config.title.text }}</div>
      Sem dados para exibir
    </div>
    <div :id="id" class="Highcharts_Div" />
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import Export from "highcharts/modules/export-data";
import Dark from "highcharts/themes/dark-unica";
import Accessibility from "highcharts/modules/accessibility";
import drilldown from "highcharts/modules/drilldown";
import Histogram from "highcharts/modules/histogram-bellcurve";
let uid = 0;

export default {
  name: 'Highcharts',
  components: {
    // BaseDetalheHeader
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    counter: {
      type: Number,
      default: 0
    }
  },
  data() {
    uid += 1;
    return {
      id: `hcid-${uid}`,
      chart: null,
      chartSlidersDebounceFunction: null,
      returnedFunction: null,
      noData: false,
      renderCount: 0
    }
  },
  watch: {
    counter() {
      let vm = this;
      setTimeout(() => {
        vm.handleResize();
      }, 0);
    },
    config() {
      this.checkEmpty();
    }
  },
  beforeMount() {
    // Exporting(Highcharts);
    // Export(Highcharts);
    Dark(Highcharts);
    Accessibility(Highcharts);

    this.chartSlidersDebounceFunction = Vue.debounce(this.renderChart, 500);

    this.returnedFunction = Vue.debounce(this.handleResize, 200);
    window.addEventListener('resize', this.returnedFunction);
  },
  mounted() {
    this.checkEmpty();
  },
  computed: {},
  methods: {
    renderChart() {
      var _this = this;

      let options = {
        chart: {
          type: 'scatter',
          zoomType: 'xy',
          reflow: false,
          events: {
            load: function (event) {
              event.target.reflow();
            }
          },
          animation: {
            duration: 200
          },
          resetZoomButton: {
            position: {
              y: 30
            }
          }
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          title: {
            enabled: false
          },
          labels: {
            enabled: false
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true,
          tickLength: 0,
          gridLineColor: "#fff1",
          gridLineWidth: "1",
        },
        yAxis: {
          title: {
            enabled: false
          },
          labels: {
            enabled: false
          },
          gridLineColor: "#fff1",
          tickLength: 0,
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: '<b>Documento {point.key}</b><br><b>Cluster #{series.name}</b><br><br>',
              pointFormat: '{point.x}, {point.y}'
            },
            stickyTracking: false,
            events: {
              click: function (event) {
                _this.$emit('detail', event.point);
              },
            },
          },
          series: {
            animation: false
          }
        },
        series: []
      };
      // end options
      this.renderCount++;

      options = window._merge(options, this.config);

      Highcharts.setOptions({
        lang: {
          thousandsSep: ".",
          decimalPoint: ",",
          numericSymbols: [null, "mi", "bi", "tri", "qua", "quin"]
        }
      });

      // create or update if exist
      if (!this.chart) {
        this.chart = Highcharts.chart(this.id, options);
      } else {
        this.chart.update({
          series: options.series
        }, true, true, true);
      }

      // end of renderChart()
    },
    handleResize() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
        this.renderChart();
      }
    },
    checkEmpty() {
      let isEmpty = true;
      if (this.config.series) {
        this.config.series.map(x => {
          if (x.data && x.data.length > 0) isEmpty = false;
        })
      }
      if (!isEmpty) {
        this.noData = false;
        this.$nextTick().then(() => {
          // if (this.chart) this.handleResize();
          // else this.renderChart();
          this.renderChart();
        })        
      } else {
        this.noData = true;
      }
    },
  },
}
</script>

<style>
.Highcharts_Layout {
  display: contents;
}
.Highcharts_Div {
  height: 100%;
  width: 100%;
}
.Highcharts_Empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 30px;
  flex-grow: 1;
}
.Highcharts_TitleEmpty {
  font-size: 20px;
  margin-bottom: 50px;
}
.Highcharts_Empty ~ .Highcharts_Div {
  display: none;
}





svg.highcharts-root,
.highcharts-container {
  font-family: "Roboto", sans-serif !important;
}
svg.highcharts-root
  .highcharts-tooltip
  tspan:not([style*="bold;"]):not([style*="fill"]):not([style*="color:"]) {
  fill: rgba(255, 255, 255, 0.7) !important;
}
svg.highcharts-root .highcharts-tooltip tspan[style*="bold"] {
  font-weight: normal !important;
  fill: rgba(255, 255, 255, 1) !important;
}
svg.highcharts-root .highcharts-tooltip tspan[style*="color:"] {
  fill: currentColor;
}
.highcharts-tooltip text {
  fill: hsla(0,0%,100%,.7)!important;
}
.highcharts-map-series .highcharts-data-label text {
  /* color: #356b93 !important;
  fill: #356b93 !important; */
}
.highcharts-button-box {
  stroke: rgb(238, 238, 238);
  stroke-width: 1;
}
.highcharts-button {
  cursor: pointer;
}
.highcharts-drilldown-point {
  stroke-width: 4px;
  stroke: rgba(255,255,255,0.4);
  stroke-dasharray: 8;
}
.highcharts-scrolling[style*="overflow: auto hidden;"] {
  overflow-x: overlay !important;
}
.highcharts-scrolling {
  overflow: overlay !important;
}
.highcharts-tooltip-container {
  z-index: 20 !important;
}
.highcharts-menu {
  box-shadow: none !important;
}
.highcharts-menu-item {
  transition-duration: 0.05s;
}
.highcharts-point {
  stroke-width: 0px !important;
}
</style>