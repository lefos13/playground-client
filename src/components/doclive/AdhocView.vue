<template>
  <div>
    <b-row no-gutters w-100 h-100 v-if="showlloedit">
      <b-col cols="12" sm="12" md="12">
        <b-row>
          <b-col cols="4">
            <div
              class="input-group input-group-sm sm-3"
              style="padding-top: 10px;"
            >
              <button
                type="button"
                round
                disable
                class="btn btn-outline-info btn-sm"
                v-if="socketonline"
                @click="socketconnect"
              >
                online
              </button>
              <div v-if="socketonline"></div>
              <button
                type="button"
                round
                class="btn btn-outline-info btn-sm"
                v-else
                @click="socketconnect"
              >
                socket disconnected
              </button>
            </div>
          </b-col>

          <b-col cols="3">
            <div class="input-group input-group-sm sm-3">
              <div v-if="socketonline" class="search-wrapper">
                <label class="filters" for="search">Search a log:</label>
                <input
                  id="search"
                  type="text"
                  v-model="searchparam"
                  placeholder="Log"
                />
              </div>
              <div v-if="socketonline" class="selec">
                <label class="filters" for="list">Pick a service:</label> <br />
                <select class="filters" id="list" v-model="selected">
                  <option selected value="All">All</option>
                  <option v-for="item in this.items" v-bind:key="item.name">
                    {{ item.name }}
                  </option>
                </select>
                <!-- <img
                  id="image"
                  src="../../assets/refresh.png"
                  alt=""
                  @click="getServices"
                /> -->
                <button id="btn" v-on:click="getServices">
                  <img id="image" src="../../assets/refresh.png" />
                </button>
              </div>
              <button
                type="button"
                round
                disable
                class="btn btn-outline-info btn-sm"
                v-if="socketonline"
                @click="showHistory"
              >
                {{ this.alllogs }}
              </button>
            </div>
          </b-col>

          <b-col cols="5">
            <div class="input-group input-group-sm d-flex justify-content-end">
              <button
                type="button"
                round
                disable
                class="btn btn-outline-info btn-sm"
                v-if="socketonline"
                @click="showChart"
              >
                {{ this.chartbut }}
              </button>
            </div>
            <div class="input-group input-group-sm d-flex justify-content-end">
              <div class="input-group-append">
                <button
                  type="button"
                  round
                  class="btn btn-outline-warning btn-sm"
                  v-if="socketonline"
                  @click="clear()"
                >
                  Clear
                </button>
              </div>
            </div>
          </b-col>
        </b-row>

        <div class="codemirror2">
          <div v-if="history" class="table3">
            <h2>History of all app logs</h2>
            <vuetable
              ref="vuetable"
              :api-url="api_url"
              :api-mode="true"
              :fields="fields"
              :item-actions="itemActions"
              :sort-order="sortOrder"
              :show-sort-icons="true"
              :multi-sort="multiSort"
              :per-page="perpage"
              :append-params="extraparams"
              table-height="300px"
              pagination-path="links.pagination"
              detail-row-id="id"
              wrapper-class="vuetable-wrapper"
              loading-class="loading"
              @vuetable:pagination-data="onPaginationData"
              @vuetable:load-success="loadsuccess"
              @vuetable:load-error="onLoadError"
              :css="css.table"
            >
            </vuetable>
          </div>

          <div class="pagi">
            <div
              v-if="history"
              class="vuetable-pagination ui basic segment grid"
            >
              <vuetable-pagination-info
                ref="paginationInfo"
                :css="css.paginationInfo"
              >
              </vuetable-pagination-info>
              <vuetable-pagination
                :css="css.pagination"
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              >
              </vuetable-pagination>
            </div>
          </div>

          <div class="highch" v-show="chartstatus">
            <h2>HighChart with log sum Data (all)</h2>
            <div class="input-group-append">
              <button
                type="button"
                round
                class="btn btn-outline-warning btn-sm"
                @click="callback(1)"
              >
                Refresh
              </button>
            </div>
            <highcharts
              class="hc"
              :options="chartOptions"
              :callback="callback"
              ref="chart"
            ></highcharts>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, dispatch } from "vuex";
import Vue from "vue";
import store from "@/store/index";
import { Vuetable, VuetablePaginationDropdown } from "vuetable-2";
import VuetablePaginationInfo from "vuetable-2/src/components/VuetablePaginationInfo";
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";

import CssConfig from "vuetable-2/src/components/VuetableCssConfig.js";

import { codemirror } from "vue-codemirror";
import JSZip from "jszip";
import FileSaver from "file-saver";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/neat.css";
import "codemirror/theme/paraiso-light.css";
import "codemirror/addon/selection/active-line.js";

import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";

import "codemirror/mode/shell/shell.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";
import "codemirror/keymap/vim.js";

import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/lib/codemirror";
import "codemirror/addon/display/placeholder";
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
import axios from "axios";

exportingInit(Highcharts);

export default {
  components: {
    codemirror,
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    VuetablePaginationDropdown,
    highcharts: Chart,
  },
  data() {
    return {
      items: [],
      extraparams: {
        logtext: "",
      },
      searchparam: "",
      chartstatus: false,
      chartbut: "Show HighChart",
      chartOptions: {
        title: {
          text: "Length of logs chart",
        },
        // line: {
        //   dataLabels: {
        //     enabled: true,
        //   },
        // },
        chart: {
          type: "column",
        },
        xAxis: {
          categories: ["Out Logs", "Error Logs"],
        },
        yAxis: {
          title: {
            text: "Counter",
          },
        },
        series: [],
      },
      api_url: "http://localhost:3000/test2",
      fields: [
        {
          name: "message",
          title: "Log",
          sortField: "message",
          visible: true,
          width: "45%%",
        },
        {
          name: "timestamp",
          title: "Time",
          sortField: "time",
          width: "25%",
          visible: true,
        },
        {
          name: "type",
          // sortField: "type",
          titleClass: "center aligned",
          width: "10%",
        },
        {
          name: "process_id",
          title: "P_ID",
          visible: true,
          width: "5%",
        },
        {
          name: "app_name",
          visible: true,
          sortField: "app_name",
          title: '<span class="orange"></span>App Name',
          width: "15%",
        },
        // 'timestamp',
        // 'type',
        // 'process_id',
        // 'app_name',
      ],
      sortOrder: [
        {
          field: "type",
          direction: "asc",
        },
      ],
      perpage: 5,
      multiSort: true,
      paginationComponent: "vuetable-pagination",
      css: CssConfig,
      itemActions: [
        {
          name: "view-item",
          label: "",
          icon: "glyphicon glyphicon-zoom-in",
          class: "btn btn-info",
          extra: {
            title: "View",
            "data-toggle": "tooltip",
            "data-placement": "left",
          },
        },
        {
          name: "edit-item",
          label: "",
          icon: "glyphicon glyphicon-pencil",
          class: "btn btn-warning",
          extra: {
            title: "Edit",
            "data-toggle": "tooltip",
            "data-placement": "top",
          },
        },
        {
          name: "delete-item",
          label: "",
          icon: "glyphicon glyphicon-remove",
          class: "btn btn-danger",
          extra: {
            title: "Delete",
            "data-toggle": "tooltip",
            "data-placement": "right",
          },
        },
      ],
      alllogs: "Search",
      socketonline: false,
      tryConsole: false,
      history: false,
      ssl: {},
      getinfo: "",
      token: "",
      swarmlabname: "",

      code: "",
      editchoice: "",
      optionsedit: [
        { text: "code", value: "code" },
        { text: "text", value: "text" },
      ],
      llodesc: [
        {
          llo_url: "",
          llo_name: "",
          llo_author: "",
          llo_intro: "",
        },
      ],
      llo: [
        {
          id: 0,
          rm: false,
          data_info: "Asciidoc \n",
          data_code: "#Your source code",
          data_service: "",
          code_datafile: "url",
          code_name: "",
          code_exec: "",
          code_options: "",
          code_mime: "",
          code_info: "",
          code_code: "",
          code_codeout: "",
          code_codeoutput: "console",
          points: "",
          challenge_question: "",
          code_challenge_question: "",
          challenge_answer: "",
          challenge_answer_hint: "",
          code_challenge_answer_hint: "",
          challenge_answer_source: "",
          challenge_answer_code_out: "",
          challenge_answer_code: "",
          code_challenge_answer_code: "",
        },
      ],
      searchLLO: [],
      searchLLOactive: false,
      ADOC_html_code: "",
      challenge: [],
      action: "",
      tryLLO: [],
      service: "os2",
      active: 0,
      activecount: 0,
      remove: "",
      activeField: "",
      bootstrap: false,
      firstbootstrap: 0,
      htmlasciitmp: "",
      datafile:
        "https://git.swarmlab.io:3000/labs/examples-mpi2/raw/branch/master/0_netstat/data",
      datadir: "0_netstat/data",
      LearningObject: "",
      showllo: true,
      showlloedit: true,
      selected: "All",
      options: [
        { text: "vim", value: "vim" },
        { text: "sublime", value: "sublime" },
      ],
      optionsmime: [
        { text: "sh", value: "bash" },
        { text: "javascript", value: "javascript" },
        { text: "python", value: "python" },
        { text: "php", value: "php" },
        { text: "sql", value: "sq;" },
        { text: "xml", value: "xml" },
        { text: "c", value: "c" },
      ],
      pValidate: false,
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        lineSeparator: "\n",
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        styleSelectedText: true,
        mode: "shell",
        hintOptions: {
          completeSingle: false,
        },
        keyMap: "sublime",
        //keyMap: "vim",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        indentUnit: this.ADOC_html_code,
        lineWrapping: true,
        //theme: 'neat',
        theme: "paraiso-light",
        refresh: true,
        readOnly: true,
        autofocus: false,
        extraKeys: { Ctrl: "autocomplete" },
      },
      ADOC_html: [],
    };
  },
  methods: {
    async callback(params) {
      var res = await axios.get("http://localhost:3000/length");
      //new code
      if (params == 1) {
        this.chartOptions.series.splice(0, this.chartOptions.series.length);
        res["data"].forEach((val) => {
          this.chartOptions.series.push({
            name: val.name,
            data: [val.lengtho, val.lengthe],
          });
        });
      } else {
        console.log(res["data"]);
        res["data"].forEach((val) => {
          this.chartOptions.series.push({
            name: val.name,
            data: [val.lengtho, val.lengthe],
          });
        });
      }
      //new code end
    },
    socketconnect() {
      //asd
      // send to runLLO
      console.log("socketcoonect adhoc");
      this.$root.$emit("SERVER_socket_connect");
    },
    showChart() {
      if (this.chartstatus == false) {
        this.chartstatus = true;
        this.chartbut = "Hide HighChart";
      } else {
        this.chartstatus = false;
        this.chartbut = "Show HighChart";
      }
    },
    async getServices() {
      this.items.splice(0, this.items.length);
      await axios.get("http://localhost:3000/services").then((res) => {
        res.data.forEach((val) => {
          //console.log(val);
          this.items.push({
            name: val,
          });
        });
        // this.items.push({
        //   name: "All",
        // });
      });
    },
    showHistory() {
      this.items = [];
      this.getServices();
      this.extraparams.logtext = this.searchparam;
      this.extraparams.selected = this.selected;
      if (this.history == false) {
        this.history = true;
      } else {
        this.$refs.vuetable.refresh();
      }
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    //asd
    loadsuccess(response) {
      var data = response.data.data;
      this.fielddata = data;
      //console.log(this.fielddata);
      var n = data.length;
      n = n - 1;
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onLoadError(payload) {
      /*
          //error2 "invalid_token" join-service.vue:684
          //error2 "The access token provided has expired" join-service.vue:685
          //error2 "Unauthorized" join-service.vue:686
          //error2 401
        console.log('error2 '+JSON.stringify(payload.response.data.error))
        console.log('error2 '+JSON.stringify(payload.response.data.error_description))
        console.log('error2 '+JSON.stringify(payload.response.statusText))
        console.log('error2 '+JSON.stringify(payload.response.status))
        */
      if (payload.response.status == "401") {
        window.location.href = "https://api-login.swarmlab.io:8089";
        Vue.nextTick(
          () => (window.location.href = "https://api-login.swarmlab.io:8089")
        );
      }
    },
    clear() {
      this.tryConsole = false;
      this.code = "";
    },
    async getdata() {
      var field = this.getinfo;
      var log = await store.dispatch("pipelineLLO/get_data", {
        code: field,
      });
    },

    async showactive(index) {
      this.topwindow(index);
    },
    onCmReady(cm) {
      cm.on("change", (cm, chg) => {}),
        cm.on("keypress", () => {
          cm.showHint({ completeSingle: false });
        });
    },
    onCmCursorActivity(a, b, c) {},
    onCmFocus(cm) {},
    onCmCodeChange(newCode) {
      this.code = newCode;
      //this.$root.$emit('socket_add',this.code)
    },
    handleChange() {},
    setKeymap() {
      this.cmOptions.keyMap = this.selected;
    },
    infoFilter() {
      var title1 = "<h3>Playbook Images</h3>";
      var winfop =
        '<table  class="table table-striped table-sm ">' +
        '<tr><td class="text-left">Shift-Tab</td> <td class="text-left">indentLess</td></tr>' +
        '<tr><td class="text-left">Alt-Q</td> <td class="text-left">wrapLines</td></tr>' +
        '<tr><td class="text-left">Ctrl-Up</td> <td class="text-left">scrollLineUp</td></tr>' +
        '<tr><td class="text-left">Ctrl-Down</td> <td class="text-left">scrollLineDown</td></tr>' +
        '<tr><td class="text-left">Ctrl-L</td> <td class="text-left">selectLine</td></tr>' +
        '<tr><td class="text-left">Esc</td> <td class="text-left">singleSelectionTop</td></tr>' +
        '<tr><td class="text-left">Ctrl-Enter</td> <td class="text-left">insertLineAfter</td></tr>' +
        '<tr><td class="text-left">Ctrl-D</td> <td class="text-left">selectNextOccurrence</td></tr>' +
        '<tr><td class="text-left">Shift-Ctrl-Space</td> <td class="text-left">selectScope</td></tr>' +
        '<tr><td class="text-left">Shift-Ctrl-M</td> <td class="text-left">selectBetweenBrackets</td></tr>' +
        '<tr><td class="text-left">Ctrl-M</td> <td class="text-left">goToBracket</td></tr>' +
        '<tr><td class="text-left">Ctrl-K Ctrl-Y</td> <td class="text-left">sublimeYank</td></tr>' +
        '<tr><td class="text-left">Ctrl-K Ctrl-C</td> <td class="text-left">showInCenter</td></tr>' +
        '<tr><td class="text-left">Ctrl-K Ctrl-G</td> <td class="text-left">clearBookmarks</td></tr>' +
        '<tr><td class="text-left">Ctrl-K Ctrl-Backspace</td> <td class="text-left">delLineLeft</td></tr>' +
        '<tr><td class="text-left">Ctrl-K Ctrl-0</td> <td class="text-left">unfoldAll</td></tr>' +
        '<tr><td class="text-left">Ctrl-K Ctrl-J</td> <td class="text-left">unfoldAll</td></tr>' +
        '<tr><td class="text-left">Ctrl-Alt-Up</td> <td class="text-left">addCursorToPrevLine</td></tr>' +
        '<tr><td class="text-left">Ctrl-Alt-Down</td> <td class="text-left">addCursorToNextLine</td></tr>' +
        '<tr><td class="text-left">Ctrl-F3</td> <td class="text-left">findUnder</td></tr>' +
        '<tr><td class="text-left">Shift-Ctrl-F3</td> <td class="text-left">findUnderPrevious</td></tr>' +
        '<tr><td class="text-left">Shift-Ctrl-[</td> <td class="text-left">fold</td></tr>' +
        '<tr><td class="text-left">Shift-Ctrl-]</td> <td class="text-left">unfold</td></tr>' +
        '<tr><td class="text-left">Ctrl-F</td> <td class="text-left">find</td></tr>' +
        "</table>";

      var title1 = "";
      var winfo = "";
      this.$swal({
        title: "<strong>Key bindings</strong>",
        type: "info",
        html: winfop + title1 + winfo,
        showCloseButton: true,
        showLoaderOnConfirm: false,
        allowOutsideClick: false,
      });
    },
    async hotreload() {
      var field = this.getinfo;
      var log = await store.dispatch("pipelineLLO/hotreload", {
        token: this.token,
        swarmlabname: this.swarmlabname,
      });
    },
    infoHotreload() {
      var html1 = ` <div style="overflow-x: auto;"> <table  class="table table-striped table-sm ">
        <thead>
            <tr>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-left" >Download</td>
                <td class="text-left">https://git.swarmlab.io:3000/labs/swarmlab-playground-client/raw/branch/master/hot_reload.sh</td>
            </tr>
            <tr>
                <td class="text-center" colspan="2"><b>and add the proper values</b></td>
            </tr>
            <tr>
              <td class="text-left">token</td>
              <td class="text-left">${this.token}</td>
            </tr>
            <tr>
              <td class="text-left">swarmlabname</td>
              <td class="text-left">${this.swarmlabname}</td>
            </tr>
            <tr>
              <td class="text-center" colspan="2"><b>OR set the variables before exec</b></td>
            </tr>
            <tr>
              <td class="text-left" colspan="2">export SWARMLAB_token=${this.token}</td>
            </tr>
            <tr>
              <td class="text-left" colspan="2">export SWARMLAB_name=${this.swarmlabname}</td>
            </tr>
            <tr>
              <td class="text-center" colspan="2"><b>Ready!</b<</td>
            </tr>
            <tr>
              <td class="text-left" colspan="2"><i>Execute script every time you run git push</i></td>
            </tr>
</tbody>
</table></div>`;

      this.$swal({
        title: "<strong>HowTo</strong>",
        type: "info",
        html: html1,
        showCloseButton: true,
        showLoaderOnConfirm: false,
        allowOutsideClick: false,
      });
    },
  },
  computed: {
    codemirror() {
      //test
      return this.$refs.myCm.codemirror;
    },
  },
  mounted() {
    // from runLLO
    this.$root.$on("SERVER_socket_status", (v) => {
      this.$nextTick(function() {
        if (v == "off") {
          this.socketonline = false;
        } else if (v == "on") {
          this.socketonline = true;
        }
      });
    });
    // from runLLO
    this.$root.$on("playground_log_in", (path) => {
      //this.$nextTick(function () {
      var restapi = store.getters["pipelineLLO/getrestapi"];
      if (restapi == "off") {
        // rest off ara socket
        var logtmp = store.getters["pipelineLLO/getlog"];
      } else if (restapi == "on") {
        // rest on ara read from rest not from socket
        var logtmp = store.getters["pipelineLLO/getmongolog"];
      }
      console.log("logtmp-roi " + JSON.stringify(logtmp));
      var itemlog = "";
      this.code = "";
      itemlog = logtmp.filter((item1) => item1.tailed_path === path);
      //Vue.set(this.log_path_lenght, item, loglenght);
      console.log("logtmp22 " + JSON.stringify(itemlog));
      for (let iteml of itemlog) {
        this.code += iteml.message + " " + iteml.tailed_path + " " + iteml.date;

        this.code += "\n";
      }
      /*
        for (let itemlog of logtmp) {
          //console.log('logtmp '+ JSON.stringify(itemlog))
          this.code += itemlog.message
           + ' '
           + itemlog.tailed_path
           + ' '
           + itemlog.date

         //  + itemlog.date.year
         //  + ' '
         //  + itemlog.date.month
         //  + ' '
         //  + itemlog.date.day
         //  + ' '
         //  + itemlog.date.hours
         //  + ' '
         //  + itemlog.date.seconds
         //  + ' '
         //  + itemlog.date.milliseconds

          this.code += "\n"
        }
        */

      //this.code += v
      //this.code += "\n"
      this.$refs.myCm.codemirror.setCursor(
        this.$refs.myCm.codemirror.lineCount(),
        0
      );
      this.tryConsole = true;
      //})
    });
  },
  beforeDestroy() {
    this.$root.$off("SERVER_socket_status");
    this.$root.$off("playground_log_in");
  },

  created() {
    //LEFOS TOKEN ====
    //this.token = new URL(location.href).searchParams.get("token");
    this.token = new URL(
      "https://api-client.swarmlab.io:8088/?token=59e732744987bc63a98a4f909d50984371b44543"
    ).searchParams.get("token");

    this.swarmlabname = new URL(location.href).searchParams.get("pipelinename");

    this.getServices();
  },
};
</script>

<style sc oped>
h2 {
  background-color: dimgray;
  padding: 10px;
  color: white;
  margin-top: 20px;
  border-radius: 5px;
}
.highch {
  padding-top: 50px;
  max-width: 100%;
}
.CodeMirror {
  font-family: monospace;
  max-width: 900px;
  min-height: 500px;
}
.codemirror2 {
  min-height: 600px;
  box-shadow: 3px 3px 10px 10px rgba(0, 0, 0, 0.281);
  margin-top: 10px;
  margin-bottom: 40px;
  margin-right: 10px;
  margin-left: 10px;
  padding: 5px;
}
.orange {
  color: rgb(167, 110, 6);
}
.pagi {
  max-width: 900px;
}
.btn {
  padding: 10px;
  margin: 10px;
}
.pagi {
  height: 40px;
}
#search {
  padding: 0px 5px 5px 5px;

  margin: 0px 0px 10px 10px;
}
.filters {
  margin: 0px 0px 0px 10px;
  max-width: 80%;
}
#image {
  max-width: 20px;
  max-height: 20px;
  /* margin: 0; */
  padding: 0;
  /* border-radius: 2rem; */
}
#btn {
  margin: 0 0 0 10px;
  padding: 0;
  max-width: 28px;
  max-height: 28px;
  background: rgb(158, 226, 226);
  /* border-radius: 1rem; */
}
</style>
