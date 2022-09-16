<template>
  <div
    :class="{ Main_ShowingRight: docSelected }"
    class="Main_Layout">
    <div class="Main_Body">
      <!-- <div class="Main_Top">
        <div class="Main_TopTile">Projeto CNJ UFG</div>
        <div v-if="isAdvanced" class="Main_TopModeloSelect">
          <v-select
            v-model="modeloModel"
            :items="modelosList"
            hide-details
            filled
            label="Modelo" />
        </div>
      </div> -->
      <div class="Main_Mid">
        <div class="Main_Left DarkScroll">
          <div class="Main_LeftUp">
            <div class="Main_TopTile">Projeto SAS</div>
          </div>
          <div class="Main_LeftStats">
            <v-btn dark large
              color="blue-grey darken-4"
              @click="">
              <span>Upload CSV</span>
              <i class="ticon-upload Icon_Button_Right" aria-hidden="true"/>
            </v-btn>
          </div>
          <div class="Main_LeftTitle">
            <div>Lista de clusters</div>
            <div class="Main_RightItem Main_RightSub">Documentos: {{ nDocumentosFiltrado }}</div>
          </div>

          <v-expansion-panels>
            <v-expansion-panel
              v-for="(cluster, i) in clusters"
              :key="i">
              <v-expansion-panel-header>
                Cluster #{{ cluster.id_cluster }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="Main_ClusterDetail">
                  <div
                    v-for="doc in cluster.docs"
                    class="Main_RightItem Main_ClusterDetailText D_Link"
                    @mouseenter="highlightPath(doc.chave_documento)"
                    @click="loadDetail({ name: doc.chave_documento })">{{ doc.descricao }}</div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        </div>
        <div class="Main_Center">
          <div class="Main_CenterTop">
            <div class="Main_Filters">
              <!-- <v-text-field
                v-model="searchModel"
                label="Número do processo"
                append-icon="ticon-search"
                style="max-width: 300px"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="0000000-00.0000.0.00.0000"
                hide-details
                filled /> -->
              <v-text-field-simplemask
                v-model="searchModel"
                v-bind:label="'Localizar processo'"
                v-bind:style="'display: contents;'"
                v-bind:properties="{
                  prefix: '',
                  suffix: '',
                  readonly: false,
                  disabled: false,
                  outlined: false,
                  hideDetails: true,
                  clearable: true,
                  placeholder: '0000000-00.0000.0.00.0000',
                  style: 'max-width: 300px',
                  appendIcon: 'ticon-search',
                  filled: true
                }"
                v-bind:options="{
                  inputMask: '#######-##.####.#.##.####',
                  outputMask: '#######-##.####.#.##.####',
                  empty: null,
                  applyAfter: false,
                  alphanumeric: true,
                  lowerCase: false,
                }"
                @input="locateProcess()"
              />
              <v-select
                v-model="classeModel"
                :items="classeList"
                style="max-width: 200px"
                hide-details
                filled
                clearable
                label="Classe"
                @change="changedClass()" />
            </div>
          </div>
          <div class="Main_CenterChart">
            <Highcharts
              :config="mainChartOptions"
              :counter="counter"
              @detail="loadDetail($event)" />
          </div>
        </div>
        <div :class="{ Main_RightActive: docSelected }" class="Main_Right">
          <div class="Main_Close">
            <v-btn
              fab dark small
              @click="docSelected = null; counter++">
              <i class="ticon-close_2 Main_CloseIcon" aria-hidden="true"/>
            </v-btn>
          </div>
          <div class="Main_RightBox DarkScroll">
            <template v-if="docSelected && !docSelected.isnull">
              <div class="Main_RightTitle">{{ docSelected.descricao }}</div>
              <button
                class="D_Link D_LinkPlus Main_RightTitleProc"
                @click="dialogProcModel = true;">
                <span class="Main_RightSub">Processo: </span>
                <span>{{ docSelected.numero_processo }}</span>
              </button>
              <v-btn
                icon text dark small
                @click="">
                <i class="ticon-contract Main_SendChartIcon" aria-hidden="true"/>
              </v-btn>
              <div class="Main_RightItem Main_ClusterRateBox">
                <span class="Main_RightSub">Cluster:&nbsp;</span>
                <span>#{{ docSelected.id_cluster }}</span>
                <span class="Main_RightStarsBox">
                  <v-rating
                    empty-icon="star_outline"
                    full-icon="star"
                    half-icon="$mdStarHalfFull"
                    color="yellow"
                    background-color="#747400"
                    hover
                    length="5"
                    size="18"
                  ></v-rating>
                </span>
              </div>
              <div v-if="procSelected" class="Main_ProcLayout">
                <div class="Main_RightItem">
                  <span class="Main_RightSub">Órgão julgador: </span>
                  <span>{{ procSelected.orgao_julgador }}</span>
                </div>
                <div class="Main_RightItem">
                  <span class="Main_RightSub">Natureza: </span>
                  <span>{{ procSelected.natureza }}</span>
                </div>
                <div class="Main_RightItem">
                  <span class="Main_RightSub">Situação: </span>
                  <span>{{ procSelected.situacao }}</span>
                </div>
                <div class="Main_RightItem">
                  <span class="Main_RightSub">Assunto principal: </span>
                  <span>{{ procSelected.assunto }}</span>
                </div>
                <div class="Main_RightItem">
                  <span class="Main_RightSub">Classe: </span>
                  <span>{{ procSelected.classe }}</span>
                </div>
                <div class="Main_RightItem">
                  <span class="Main_RightSub">Instância: </span>
                  <span>{{ procSelected.instancia }}</span>
                </div>
              </div>
              <!-- <div class="Main_RightItem">
                <span class="Main_RightSub">Score de similaridade: </span>
                <span class="Main_RightScore">{{ docSelected.score_similaridade * 100 }}%</span>
              </div> -->



              <v-tabs
                centered
                style="margin: 15px -20px 0 -20px; width: calc(100% + 40px);"
                color="grey"
                dark>
                <v-tabs-slider color="yellow"></v-tabs-slider>
                <v-tab href="#tab-1">Resumo</v-tab>
                <v-tab href="#tab-2">Similares</v-tab>

                <v-tab-item value="tab-1">
                  <div class="Main_TabBox">
                    <div class="Main_RightItem">
                      <div class="Main_RightSub">Resumo: </div>
                      <div class="Main_RightResumoText">{{ docResumo }}</div>
                    </div>
                    <div class="D_Center" style="margin-top: 20px;">
                      <v-btn dark
                        @click="inteiroDialog = true;">
                        <span>Ver texto completo</span>
                      </v-btn>
                    </div>
                  </div>
                </v-tab-item>

                <v-tab-item value="tab-2">
                  <div>
                      <!-- v-if="detailLoading" -->
                    <BaseContentLoader
                      v-if="detailLoading"
                      style="padding: 10px 10px 10px 20px;"
                      type="block"
                      count="5" />

                    <div v-else class="Main_SimilarList">

                      <div class="Main_SimilarExport">
                        <v-btn dark large
                          color="blue-grey darken-4"
                          @click="">
                          <span>Exportar TXT ou JSON</span>
                          <i class="ticon-download Icon_Button_Right" aria-hidden="true"/>
                        </v-btn>
                      </div>
                      
                      <div v-for="(item, ix) in documentosSimilares" class="Main_SimilarItem">
                        <div class="Main_SimilarTop">
                          <div class="Main_SimilarLeft">
                            <div class="Main_RightTitleBox">
                              <button
                                class="D_Link Main_RightTitleProc"
                                @click="loadProcessoSimilar(item.numero_processo); similarProcDialog = true;">
                                <span>{{ item.numero_processo }}</span>
                              </button>
                              <v-btn
                                icon text dark small
                                class="Main_SimilarCopyButton"
                                @click="">
                                <i class="ticon-contract Main_SendChartIcon" aria-hidden="true"/>
                              </v-btn>

                            </div>
                            <div class="Main_SimilarDoc Main_RightItem Main_SimilarProc">
                              <span>{{ item.descricao }} </span>
                              <span class="Main_RightScore">{{ Math.round(item.score_similaridade * 100) }}%</span>
                            </div>
                          </div>
                          <!-- <div class="Main_SimilarRight">
                            <v-btn
                              icon text dark
                              @click="expandSimilar(ix)">
                              <i class="ticon-angle-down Main_SimilarExpand" aria-hidden="true"/>
                            </v-btn>
                          </div> -->
                        </div>
                      </div>

                    </div>
                  </div>
                </v-tab-item>
              </v-tabs>
            </template>
            <template v-else-if="docSelected">
              <div class="Main_RightTitle">Processo não encontrado</div>
              <div class="Main_RightItem">
                <span class="Main_RightSub">Busca: </span>
                <span>{{ docSelected.proc }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <v-dialog
        v-model="dialogProcModel"
        max-width="500">
        <div class="D_Dialog">
          <div v-if="procSelected" class="Main_ProcLayout">
            <div class="Main_RightTitle">{{ procSelected.processo }}</div>


            <div class="Main_RightItem">
              <span class="Main_RightSub">Órgão julgador: </span>
              <span>{{ procSelected.orgao_julgador }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Órgão julgador colegiado: </span>
              <span>{{ procSelected.orgao_julgador_colegiado }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Natureza: </span>
              <span>{{ procSelected.natureza }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Situação: </span>
              <span>{{ procSelected.situacao }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Classe: </span>
              <span>{{ procSelected.classe }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Instância: </span>
              <span>{{ procSelected.instancia }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Assunto: </span>
              <span>{{ procSelected.assunto }}</span>
            </div>  
            <div class="Main_RightItem">
              <span class="Main_RightSub">Competência: </span>
              <span>{{ procSelected.competencia }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Fonte de dados: </span>
              <span>{{ procSelected.fonte_dados }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Assuntos: </span>
              <div v-for="item in procSelected.lista_assuntos" class="Main_RightListString">
                <span>{{ item }}</span>
              </div>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Partes: </span>
              <div v-for="item in procSelected.lista_tipo_partes" class="Main_RightListString">
                <span class="Main_RightParteLabel">{{ item[0] }}: </span>
                <span class="Main_RightParteValue">{{ item[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </v-dialog>

      <v-dialog
        v-model="similarProcDialog"
        max-width="500">
        <div class="D_Dialog">
          <div v-if="similarProc" class="Main_ProcLayout">
            <div class="Main_RightTitle">{{ similarProc.processo }}</div>


            <div class="Main_RightItem">
              <span class="Main_RightSub">Órgão julgador: </span>
              <span>{{ similarProc.orgao_julgador }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Órgão julgador colegiado: </span>
              <span>{{ similarProc.orgao_julgador_colegiado }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Natureza: </span>
              <span>{{ similarProc.natureza }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Situação: </span>
              <span>{{ similarProc.situacao }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Classe: </span>
              <span>{{ similarProc.classe }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Instância: </span>
              <span>{{ similarProc.instancia }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Assunto: </span>
              <span>{{ similarProc.assunto }}</span>
            </div>  
            <div class="Main_RightItem">
              <span class="Main_RightSub">Competência: </span>
              <span>{{ similarProc.competencia }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Fonte de dados: </span>
              <span>{{ similarProc.fonte_dados }}</span>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Assuntos: </span>
              <div v-for="item in similarProc.lista_assuntos" class="Main_RightListString">
                <span>{{ item }}</span>
              </div>
            </div>
            <div class="Main_RightItem">
              <span class="Main_RightSub">Partes: </span>
              <div v-for="item in similarProc.lista_tipo_partes" class="Main_RightListString">
                <span class="Main_RightParteLabel">{{ item[0] }}: </span>
                <span class="Main_RightParteValue">{{ item[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </v-dialog>

      <v-dialog
        v-model="inteiroDialog"
        max-width="800">
        <div class="D_Dialog">
          <div class="Main_InteiroText">{{ inteiro }}</div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
// import BaseDialog from './BaseDialog.vue'
import dados from '../database/dados.json'
import resumos from '../database/resumos.json'
import Highcharts from './Highcharts.vue'
import BaseContentLoader from './BaseContentLoader.vue';

export default {
  name: 'Main',
  components: {
    Highcharts,
    BaseContentLoader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAdvanced: false,
      docsCl: [],
      docsClLoading: false,
      clusters: [],
      mainChartOptions: {},
      docSelected: null,
      detailLoading: false,
      similarProc: null,
      similarProcLoading: false,
      similarProcDialog: false,
      procSelected: null,
      procLoading: false,
      counter: 0,
      modeloModel: "KMeans-labse-mean_tokens",
      modelosList: ["KMeans-labse-mean_tokens", "Modelo 2", "Modelo 3"],
      classeModel: null,
      classeList: [],
      dialogProcModel: false,
      documentosSimilares: [],
      searchModel: null,
      resumos,
      nDocumentosFiltrado: 0,
      docResumo: null,
      docResumoLoading: false,
      inteiro: null,
      inteiroLoading: false,
      inteiroDialog: false
    }
  },
  watch: {},
  beforeMount() {
    this.loadClusters();
  },
  mounted() {},
  computed: {
    // docResumo() {
    //   if (this.docSelected && !this.docSelected.isnull) {
    //     let resumo = this.resumos.find(x => x.chave_documento === this.docSelected.chave_documento)
    //     if (resumo) {
    //       return resumo.resumo
    //     } else {
    //       return "Resumo não encontrado"
    //     }
    //   } else {
    //     return ""
    //   }
    // }
  },
  methods: {
    prepareForChart(arrDados) {
      let series = [];
      this.nDocumentosFiltrado = arrDados.length;

      arrDados.map((x, ix) => {
        if (ix === 0) return;
        let inSeries = series.find(y => y.name === `${x.id_cluster}`)
        if (!inSeries) {
          series.push({ name: `${x.id_cluster}` });
          inSeries = series[series.length-1]
        }
        if (!inSeries.data) {
          inSeries.data = [];
        }
        inSeries.data.push({
            x: Number(x.pos_x),
            y: Number(x.pos_y),
            name: x.chave_documento,
            custom: x
        })

      })

      series.sort(function(a, b) {
        return a.name - b.name;
      });

      this.clusters = series.map(x => {
        return {
          id_cluster: x.name,
          docs: x.data.map(y => {
            return y.custom
          })
        }
      })

      this.mainChartOptions = { series }
    },
    loadClusters() {
      this.docsClLoading = true;

      axios.get(Vue.preUrl + `/documentos/${this.modeloModel}`)
      .then(res => {
        this.docsCl = res.data;
        this.prepareForChart(this.docsCl);
        this.resolveClasses();
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.docsClLoading = false;
      });

    },
    resolveClasses() {
      let result = [];
      this.docsCl.map(x => {
        result.push(x.classe);
      })
      result.sort((a, b) => a.localeCompare(b))
      
      this.classeList = [...new Set(result)];
    },
    changedClass() {
      let docsFiltered = [];
      if (this.classeModel) {
        docsFiltered = this.docsCl.filter(x => x.classe === this.classeModel);
      } else {
        docsFiltered = this.docsCl;
      }
      
      this.prepareForChart(docsFiltered);

    },
    loadDetail(e) {
      // console.log(e);
      if (this.docSelected === null) {
        this.counter++;
      }
      if (e.name === null) {
        this.docSelected = {
          isnull: true,
          proc: e.proc
        }
        return;
      }
      this.docSelected = this.docsCl.find(x => x.chave_documento === e.name);
      this.docSelected.numero_processo = e.name.substr(0, 25);
      this.docSelected.resumo_sumarizado = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

      this.detailLoading = true;
      this.loadProcesso(this.docSelected.numero_processo);

      // let temp = "KMeans-labse-mean_tokens";
      let temp = "KMeans-labse-mean_tokens";
      // let temp = "modelo_teste";

      axios.get(Vue.preUrl + `/${temp}/documentos/${e.name}/similares`)
      .then(res => {
        this.documentosSimilares = res.data;
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.detailLoading = false;
      });

      this.docResumo = null;
      this.docResumoLoading = true;
      axios.get(Vue.preUrl + `/documentos/${e.name}/resumo`)
      .then(res => {
        this.docResumo = res.data;
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.docResumoLoading = false;
      });

      this.inteiro = null;
      this.inteiroLoading = true;
      axios.get(Vue.preUrl + `/documentos/${e.name}/inteiro_teor`)
      .then(res => {
        this.inteiro = res.data;
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.inteiroLoading = false;
      });


    },
    loadProcesso(proc) {
      let vm = this;
      this.procLoading = true;

      axios.get(Vue.preUrl + `/processos/${proc}`)
      .then(res => {
        vm.procSelected = res.data;

        Object.keys( vm.procSelected ).forEach(function (item) {
          if (typeof vm.procSelected[item] === 'string' && vm.procSelected[item].includes("INCONSISTENTE") || vm.procSelected[item] === null) {
            vm.procSelected[item] = "-"
          }
        })
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.procLoading = false;
      });

    },
    loadProcessoSimilar(proc) {
      let vm = this;
      this.similarProcLoading = true;

      axios.get(Vue.preUrl + `/processos/${proc}`)
      .then(res => {
        vm.similarProc = res.data;

        Object.keys( vm.similarProc ).forEach(function (item) {
          if (typeof vm.similarProc[item] === 'string' && vm.similarProc[item].includes("INCONSISTENTE") || vm.similarProc[item] === null) {
            vm.similarProc[item] = "-"
          }
        })
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.similarProcLoading = false;
      });

    },
    expandSimilar(index) {
      let item = this.documentosSimilares[index];
      if (item.expanded) {
        Vue.set(item, "expanded", false);
      } else {
        Vue.set(item, "expanded", true);
      }
    },
    expandCluster(index) {
      let item = this.documentosSimilares[index];
      if (item.expanded) {
        Vue.set(item, "expanded", false);
      } else {
        Vue.set(item, "expanded", true);
      }
    },
    locateProcess() {
      
      if (!this.searchModel || this.searchModel.length < 25) return;
      console.log(this.searchModel);

      let doc = this.docsCl.find(x => x.chave_documento.includes(this.searchModel));

      if (doc) {
        this.loadDetail({ name: doc.chave_documento });
        this.highlightPath(doc.chave_documento);
      } else {
        this.loadDetail({ name: null, proc: this.searchModel })
      }
    },
    highlightPath(id) {
      document.querySelectorAll(`.Main_HighlightPoint`).forEach(x => {
        x.classList.remove("Main_HighlightPoint");
      });

      
      let path = document.querySelector(`.highcharts-markers path[aria-label*="${id}"]`);
      // console.log(path);
      if (path) {
        path.classList.add("Main_HighlightPoint");
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
html {
  overflow-y: unset;
  overflow-x: hidden;
}
html, body, .v-application {
  width: 100%;
  height: 100%;
}
body {
  font-family: 'Roboto', sans-serif;

  --d-back: #fff;
  --d-text: #333;

  --d-back: #333;
  --d-text: #ccc;

  --top-height: 90px;
  --left-width: 270px;
  --right-width: 380px;

  font-size: 18px;
  background-color: var(--d-back);

}
.Main_Layout {
  min-height: 100%;
  max-height: 100%;
  max-width: 100%;
  display: flex;
  color: var(--d-text);
  /* -webkit-user-select: none; */
}
.D_Dialog {
  color: var(--d-text);
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
  gap: 15px;
}
.Main_Mid {
  flex-grow: 1;
  display: flex;
  position: relative;
  width: 100%;
  /* height: calc(100% - var(--top-height));
  max-height: calc(100% - var(--top-height)); */
  height: 100%;
  max-height: 100%;
}
.Main_Center {
  flex-grow: 1;
  max-width: calc(100% - var(--left-width));
  display: flex;
  flex-direction: column;
}
.Main_ShowingRight .Main_Center {
  max-width: calc(100% - var(--left-width) - var(--right-width));
}
.Main_Filters {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  flex-grow: 1;
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
  padding: 20px 10px 15px 10px;
  font-size: 1.3em;
  line-height: 1.3;
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
  padding: 20px;
  overflow-y: scroll;
}
.Main_RightTitle {
  word-break: break-word;
  margin-bottom: 10px;
}
.Main_RightTitleProc {
  font-size: 14px;
}
.Main_RightSub {
  opacity: 0.6;
}
.Main_RightItem {
  font-size: 14px;
}
.Main_RightResumoText {
  opacity: 0.8;
}
.Main_SimilarProc {
  opacity: 0.8;
}
.Main_RightScore {
  padding: 6px 9px;
  background-color: #ffffff1a;
  border-radius: 20px;
  color: white;
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
.D_Center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.D_Link {
  text-decoration: none;
  color: var(--d-text);
  padding: 5px 6px;
  margin: -5px -6px;
  border-radius: 5px;
  transition-duration: 0.1s;
}
.D_Link:hover,
.D_Link.focus-visible {
  outline: none;
  background-color: rgba(255,255,255,0.06);
}
.D_LinkPlus {
  background-color: rgba(255,255,255,0.06);
}
.D_LinkPlus:hover,
.D_LinkPlus.focus-visible {
  outline: none;
  background-color: rgba(255,255,255,0.12);
}
.D_Dialog {
  background-color: #383838;
  padding: 20px;
}
.Main_TabBox {
  padding: 20px;
}
.Main_SendChartIcon {
  font-size: 15px;
  color: var(--d-text);
}
.Main_RightStarsBox {
  display: inline-flex;
  margin-left: 5px;
}
.Main_SimilarItem {
  padding: 10px 10px 10px 20px;
  box-shadow: inset 0px -1px 0px 0px #ffffff14;
}
.Main_SimilarTop {
  display: flex;
  align-items: center;
}
.Main_SimilarLeft {
  flex-grow: 1;
}
.Main_SimilarExpand {
  font-size: 21px;
}
.Main_CenterTop {
  min-height: var(--top-height);
  display: flex;
  align-items: center;
}
.Main_CenterChart {
  flex-grow: 1;
}
.Main_LeftUp {
  padding: 20px 10px 20px 10px;
  background-color: var(--d-back);
  display: flex;
  align-items: center;
  min-height: var(--top-height);
}
.Main_RightListString {
  margin-left: 10px;
}
.Main_RightParteLabel {
  opacity: 0.6;
}
.Icon_Button_Right {
  font-size: 21px;
  margin-left: 4px;
}
.Main_LeftStats {
  padding: 20px 10px 0px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.Main_ClusterDetailText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.Main_SimilarExport {
  display: flex;
  justify-content: center;
  margin: 20px 0 10px 0;
}
.Main_ClusterRateBox {
  display: flex;
  align-items: center;
}
.Main_SimilarCopyButton {
  opacity: 0;
  transition: 0.1s;
}
.Main_SimilarItem:hover .Main_SimilarCopyButton {
  opacity: 1;
}
.Main_HighlightPoint {
  stroke: white;
  stroke-width: 15px !important;
  stroke-opacity: 0.5;
  stroke-linejoin: round;
}
.Main_InteiroText {
  color: #b3b3b3;
}


textarea::-webkit-scrollbar,
.DarkScroll::-webkit-scrollbar,
.v-dialog::-webkit-scrollbar,
html::-webkit-scrollbar {
  width: 18px;
}
textarea::-webkit-scrollbar-track,
.DarkScroll::-webkit-scrollbar-track,
.v-dialog::-webkit-scrollbar-track,
html::-webkit-scrollbar-track {
  background-color: #0002;
}
textarea::-webkit-scrollbar-thumb,
.DarkScroll::-webkit-scrollbar-thumb,
.v-dialog::-webkit-scrollbar-thumb,
html::-webkit-scrollbar-thumb {
  background-color: #555;
}
textarea::-webkit-scrollbar-corner,
.DarkScroll::-webkit-scrollbar-corner,
.v-dialog::-webkit-scrollbar-corner,
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
.v-application.App_Box .primary {
  background-color: #1976d2 !important;
  border-color: #1976d2 !important;
}
.v-application.App_Box .primary--text {
  color: #5cbbf6!important;
  caret-color: #5cbbf6!important;
}
.Main_Layout .v-input--selection-controls {
  margin-top: 0px;
}
.theme--dark.v-application {
  background: unset !important;
  color: unset !important;
}
.v-application .accent {
  background-color: #006fc7 !important;
  border-color: #0079b5 !important;
}
.v-application .accent--text {
  color: #006fc7 !important;
  caret-color: #006fc7 !important;
}
.theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border: none !important;
}
.v-application--wrap {
  display: contents;
}
.Main_Layout .v-btn {
  text-transform: unset;
  letter-spacing: unset;
}
.theme--dark.v-btn {
  color: unset;
}
.Main_Layout .v-tab {
  text-transform: unset;
  letter-spacing: unset;
}
.Main_Layout .theme--dark.v-tabs-items {
  background-color: unset;
}
.Main_Layout .theme--dark.v-tabs > .v-tabs-bar {
  /* background-color: unset; */
}
.v-input--is-dirty .v-input__append-inner + .v-input__append-inner {
  display: none;
}
.v-expansion-panel-header {
  padding: 16px 10px;
}
.v-expansion-panel-content__wrap {
  padding: 0 10px 16px;
}
.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: transparent;
  color: var(--d-text);
}
.theme--dark.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
  color: var(--d-text);
}
.Main_Layout .v-rating .v-icon {
  padding: 0.2rem;
}
</style>