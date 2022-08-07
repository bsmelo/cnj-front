<template>
  <div
    :class="{ Main_ShowingRight: docSelected }"
    class="Main_Layout">
    <div class="Main_Body">
      <div class="Main_Top">Projeto CNJ UFG</div>
      <div class="Main_Mid">
        <div class="Main_Left DarkScroll">
          <div class="Main_LeftTitle">Lista de clusters</div>
          <template v-if="mainChartOptions.series">
            <div
              v-for="cluster in mainChartOptions.series"
              class="Main_LeftItem">Cluster #{{ cluster.name }}</div>
          </template>
        </div>
        <div class="Main_Center">
          <Highcharts
            :config="mainChartOptions"
            :counter="counter"
            @detail="openDetail($event)" />
        </div>
        <div :class="{ Main_RightActive: docSelected }" class="Main_Right">
          <div class="Main_Close">
            <v-btn
              color="primary"
              fab dark small
              @click="docSelected = null; counter++">
              <i class="ticon-close_2 Main_CloseIcon" aria-hidden="true"/>
            </v-btn>
          </div>
          <div class="Main_RightBox DarkScroll">
            <template v-if="docSelected">
              <div class="Main_RightTitle">{{ docSelected.documento }}</div>
              <div class="Main_RightSub">Cluster #{{ docSelected.cluster }}</div>
              <div class="Main_Empty">
                <i class="ticon-404 Main_EmptyIcon" aria-hidden="true"/>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import BaseDialog from './BaseDialog.vue'
import dados from '../database/dados.json'
import Highcharts from './Highcharts.vue'

export default {
  name: 'Main',
  components: {
    Highcharts
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dados: dados,
      mainChartOptions: {},
      docSelected: null,
      counter: 0
    }
  },
  watch: {},
  beforeMount() {
    this.prepareForChart(this.dados);
  },
  mounted() {},
  computed: {},
  methods: {
    prepareForChart(arrDados) {
      let series = [];

      arrDados.map((x, ix) => {
        let inSeries = series.find(y => y.name === `${x.cluster}`)
        if (!inSeries) {
          series.push({ name: `${x.cluster}` });
          inSeries = series[series.length-1]
        }
        if (!inSeries.data) {
          inSeries.data = [];
        }
        inSeries.data.push({
            x: x.x,
            y: x.y,
            name: x.documento
        })

      })

      this.mainChartOptions = { series }
    },
    openDetail(e) {
      // console.log(e);
      if (this.docSelected === null) {
        this.counter++;
      }
      this.docSelected = {
        documento: e.name,
        cluster: e.series.name,
        x: e.x,
        y: e.y
      }
    }
  },
}
</script>

<style>
* {
  background-repeat: no-repeat;
  padding: 0;
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
body {
  font-family: 'Roboto', sans-serif;

  --d-back: #fff;
  --d-text: #333;

  --d-back: #333;
  --d-text: #ccc;

  --top-height: 50px;
  --left-width: 270px;
  --right-width: 300px;

  font-size: 18px;
  background-color: var(--d-back);
  color: var(--d-text);

}
.Main_Layout {
  min-height: 100%;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  -webkit-user-select: none;
}
.Main_Body {
  position: relative;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.Main_Top {
  height: var(--top-height);
  background-color: #1c1c1c;
  box-shadow: inset 0px -2px 0px 0px #2a2a2a;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.Main_Mid {
  flex-grow: 1;
  display: flex;
  position: relative;
  width: 100%;
  height: calc(100% - var(--top-height));
  max-height: calc(100% - var(--top-height));
}
.Main_Center {
  flex-grow: 1;
  max-width: calc(100% - var(--left-width));
}
.Main_ShowingRight .Main_Center {
  max-width: calc(100% - var(--left-width) - var(--right-width));
}

/* LEFT */
.Main_Left {
  width: var(--left-width);
  max-width: var(--left-width);
  background-color: #222;
  overflow-y: auto;
  height: 100%;
  max-height: 100%;
}
.Main_LeftTitle {
  padding: 10px 10px 20px 10px;
  font-size: 1.3em;
  opacity: 0.6;
}
.Main_LeftItem {
  min-height: 40px;
  display: flex;
  align-content: center;
  padding: 5px 10px;
}

/* RIGHT */
.Main_Right {
  width: var(--right-width);
  max-width: var(--right-width);
  background-color: #222;
  height: 100%;
  max-height: 100%;  
  position: absolute;
  right: calc(var(--right-width) * -1);
  transition-duration: 0.2s;
}
.Main_RightActive {
  right: 0;
}
.Main_RightBox {
  width: 100%;
  width: var(--right-width);
  height: 100%;
  max-height: 100%;
  padding: 10px 10px;
  overflow-y: auto;
}
.Main_RightTitle {
  word-break: break-word;
}
.Main_RightSub {
  opacity: 0.6;
  margin-bottom: 20px;
}
.Main_Empty {
  text-align: center;
  font-size: 60px;
}
.Main_Close {
  position: absolute;
  left: 50px;
  top: 3px;
  transform: translateX(-86%);
}
.Main_RightActive .Main_Close {
  left: 0;
}


textarea::-webkit-scrollbar,
.DarkScroll::-webkit-scrollbar,
html::-webkit-scrollbar {
  width: 18px;
}
textarea::-webkit-scrollbar-track,
.DarkScroll::-webkit-scrollbar-track,
html::-webkit-scrollbar-track {
  background-color: #0002;
}
textarea::-webkit-scrollbar-thumb,
.DarkScroll::-webkit-scrollbar-thumb,
html::-webkit-scrollbar-thumb {
  background-color: #555;
}
textarea::-webkit-scrollbar-corner,
.DarkScroll::-webkit-scrollbar-corner,
html::-webkit-scrollbar-corner {
  background-color: #222;
}


/* VUETIFY FIX */
.App_Layout .theme--dark.v-btn:focus:before {
  opacity: 0;
}
.App_Layout .theme--dark.v-btn.focus-visible:before {
  opacity: 0.24;
}
</style>