<template>
  <div>
    <div class="row">
      <div class="col-12 d-flex justify-content-center text-center">
        <!-- <h4 class="text-info">Search</h4> -->
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <div class="input-group input-group-sm sm-6">
          <div class="input-group-prepend">
            <div
              class="form-control custom-control custom-switch custom-control-inline"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="log_logerror"
                v-model="logcheck.error"
              />
              <label class="custom-control-label" for="log_logerror"
                >Error</label
              >
            </div>

            <div
              class="form-control custom-control custom-switch custom-control-inline"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="log_output"
                v-model="logcheck.output"
                data-size="large"
                data-toggle="toggle"
              />
              <label class="custom-control-label" for="log_output"
                >Output</label
              >
            </div>

            
          </div>
        </div>
      </div>
      <!-- col -->

      <div class="col-6">
        <div class="input-group input-group-sm sm-6">
          
        </div>
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <div class="row">
      <div class="col-6">
        <div class="input-group-append">
          <button
            class="btn btn-outline-primary"
            round
            type="button"
            @click="Hotlog"
          >
            Hot_log ALL
          </button>
        </div>
        <div class="input-group-append">
          <button
            class="btn btn-outline-primary"
            round
            type="button"
            @click="mongorawf"
          >
            Hot_log MONGO RAW
          </button>
          <div class="input-group-append">
            <button
              class="btn btn-outline-primary"
              round
              type="button"
              @click="allrawf"
            >
              Hot_log RAW ALL
            </button>
          </div>
        </div>
      </div>
      <!-- col -->

      <div class="col-5">
        <div class="input-group input-group-sm sm-5 justify-content-end ">
          <div class="input-group-prepend">
            <div class="input-group-append">
              <button
                class="btn btn-outline-warning"
                round
                type="button"
                @click="Clearlog"
              >
                Clear
              </button>
            </div>
            <div class="input-group-append">
              <button
                class="btn btn-outline-warning"
                round
                type="button"
                @click="Hidelog"
              >
                Hide
              </button>
            </div>
            <div class="input-group-append">
              <button
                class="btn btn-outline-warning"
                round
                type="button"
                @click="Refresh"
              >
                Force Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- col -->

      <div class="col-1"></div>
      <!-- col -->
    </div>
    <!-- row -->

    <div class="row rowlog overflow-auto">
      
      <!-- col -->
      <div v-show="onEvent" class="logs">
        <h2>ON-event logs for all apps (Simplified - ALL)</h2>
        <div class="input-group-append">
          <button
            class="btn btn-outline-primary"
            round
            type="button"
            @click="scroll(1)"
          >
            Scroll to Bottom
          </button>
        </div>
        <div id="applogs" class="table2">
          <vuetable
            ref="apptable"
            :api-mode="false"
            :fields="fields"
            :css="css.table"
          >
          </vuetable>
        </div>
      </div>
      <div v-show="mongoraw" class="logs">
        <h2>ON-event logs for MongoDB only (RAW)</h2>
        <div class="input-group-append">
          <button
            class="btn btn-outline-primary"
            round
            type="button"
            @click="scroll(2)"
          >
            Scroll to Bottom
          </button>
        </div>
        <div id="mongologs" class="table2">
          <vuetable
            ref="mongotable"
            :api-mode="false"
            :fields="fields2"
            :css="css.table"
          >
          </vuetable>
        </div>
      </div>
      <div v-show="raw" class="logs">
        <h2>ON-event logs (RAW - ALL)</h2>
        <!-- <div class="input-group-append">
          <button
            class="btn btn-outline-primary"
            round
            type="button"
            @click="scroll(3)"
          >
            Scroll to Bottom
          </button>
        </div> -->
        <div id="rawlogs">
          <vuetable
            ref="rawtable"
            :api-mode="false"
            :fields="fields3"
            :css="css.table"
            table-height="400px"
          >
          </vuetable>
        </div>
      </div>
    </div>
    <!-- row -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, dispatch } from "vuex";
import Vue from "vue";
import store from "@/store/index";
import JSZip from "jszip";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { DateTime } from "luxon";
import FileSaver from "file-saver";
import Vuetable from "vuetable-2";
import axios from "axios";
import CssConfig from "vuetable-2/src/components/VuetableCssConfig.js";

export default {
  components: {
    Vuetable,
    DatePicker,
  },
  data() {
    return {
      countIndex: 1,
      hover: false,
      css: CssConfig,
      fields: [
        {
          name: "message",
          title: "Log",
          width: "20%",
          visible: true,
          dataClass: "center aligned",
        },
        {
          name: "timestamp",
          title: "Time",
          width: "20%",
          visible: true,
        },
        {
          name: "type",
          titleClass: "center aligned",
          width: "10%",
        },
        {
          name: "process_id",
          visible: true,
        },
        {
          name: "app_name",
          visible: true,
          title: '<span class="orange"></span>App Name',
        },
        // 'timestamp',
        // 'type',
        // 'process_id',
        // 'app_name',
      ],
      fields2: [
        {
          name: "t",
          title: "Timestamp",
          visible: true,
          width: "30%",
        },

        {
          name: "s",
          title: "Severity",
          visible: true,
          width: "5%",
        },
        {
          name: "attr",
          title: "Attributes",
          width: "40%",
        },
        {
          name: "c",
          title: "Components",
          titleClass: "center aligned",
          width: "10%",
        },
        {
          name: "id",
          visible: false,
        },
        {
          name: "ctx",
          visible: true,
          title: "Context",
          width: "5%",
        },
        {
          name: "msg",
          title: "Message",
          width: "10%",
        },

        // 'timestamp',
        // 'type',
        // 'process_id',
        // 'app_name',
      ],
      fields3: [
        {
          name: "container_id",
          title: "Container_id",
          width: "13%",
        },
        {
          name: "log",
          title: "Log",
          width: "40%",
        },

        {
          name: "container_name",
          title: "Container Name",
          width: "17%",
        },
        {
          name: "source",
          title: "Source",
          width: "8%",
        },
        {
          name: "time",
          title: "Time",
          width: "22%",
        },
      ],
      log_path: [],
      log_path_lenght: [],
      log_path_lenghtstatus: [],
      loglenghttotal: 32,
      onEvent: false,
      allHistory: false,
      search: {
        datestart: "",
        dateend: "",
        log: "",
        output: "",
        error: "",
      },
      logcheck: {
        log: true,
        error: true,
        output: true,
      },
      selected: [],
      showlloedit: true,
      issocket: "close",
      socketdata: "",
      logintoken: "",
      code: [],
      logdata: [],
      mongodata: [],
      mongoerror: [],
      mongoout: [],
      localData: [],

      localDataError: [],
      localDataOut: [],
      rawdata: [],
      rawout: [],
      rawerror: [],
      mongoraw: false,
      allraw: false,
      raw: false,
    };
  },
  methods: {
    Refresh() {
      this.checklogs();
      this.$refs.apptable.reload();
    },
    checklogs() {
      if (this.logcheck.error && !this.logcheck.output) {
        // console.log("Inside check");
        this.$refs.apptable.setData(this.localDataError);
        this.$refs.mongotable.setData(this.mongoerror);
        this.$refs.rawtable.setData(this.rawerror);
      } else if (this.logcheck.error && this.logcheck.output) {
        // console.log("Inside check default");
        this.$refs.apptable.setData(this.localData);
        this.$refs.mongotable.setData(this.mongodata);
        this.$refs.rawtable.setData(this.rawdata);
      } else if (!this.logcheck.error && this.logcheck.output) {
        this.$refs.apptable.setData(this.localDataOut);
        this.$refs.mongotable.setData(this.mongoout);
        this.$refs.rawtable.setData(this.rawout);
      }
    },
    scroll(param) {
      if (param == 1) {
        var container = this.$el.querySelector("#applogs");
        container.scrollTop = container.scrollHeight;
      } else if (param == 2) {
        var container = this.$el.querySelector("#mongologs");
        container.scrollTop = container.scrollHeight;
      }
      // } else if (param == 3) {
      //   console.log("moving scroll bar of raw logs");
      //   const container = this.$refs.rawtable;
      //   container.scrollIntoView({ behavior: "smooth" });
      // }
    },
    async getuser(token) {
      var data = await this.checktoken(token);
      console.log("User: " + data.user + "  Token: " + data.token);
      this.$socket.client.emit("onevent", data.user);
    },
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    async checktoken(value) {
      try {
        var token = value;
        var pipelines = {
          source: "ssologin",
        };
        var params = {
          pipeline: pipelines,
        };

        var options = {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        };
        var res = await axios.post(
          "https://api.swarmlab.io/istokenvalidsso",
          params,
          options
        );
        return res.data;
      } catch (e) {
        if (
          e.message == "Request failed with status code 401" ||
          /401/i.test(e.message)
        ) {
          window.location.href = "https://api-login.swarmlab.io:8089";
        }
        console.error(e);
      }
    },
    Hotlog() {
      var logintoken = store.getters["pipelineLLO/gettoken"];
      //call to start on event logs
      this.onEvent = true;
    },
    mongorawf() {
      this.mongoraw = true;
    },
    allrawf() {
      this.raw = true;
    },
    Hidelog() {
      this.onEvent = false;
      this.mongoraw = false;
      this.raw = false;
    },
    Clearlog() {
      // this.onEvent = false;
      // this.mongoraw = false;
      // this.raw = false;

      this.localData = [];
      this.localDataError = [];
      this.localDataOut = [];

      this.rawdata = [];
      this.rawout = [];
      this.rawerror = [];

      this.mongodata = [];
      this.mongoout = [];
      this.mongoerror = [];

      this.Refresh();
    },
    logview(item) {
      //console.log('path ' + JSON.stringify(item))
      if (this.logcheck.log) {
        if (item.endsWith("-log")) {
          return true;
        }
      }
      if (this.logcheck.error) {
        if (item.endsWith("-error")) {
          return true;
        }
      }
      if (this.logcheck.output) {
        if (item.endsWith("-output")) {
          return true;
        }
      }
    },
    async selectPath(path) {
      console.log("path " + JSON.stringify(path));
      var statuslenght = this.log_path_lenght[path];
      Vue.set(this.log_path_lenghtstatus, path, statuslenght);
      // -------------------------------------
      // send to AdhocView to view in code
      // -------------------------------------
      this.$root.$emit("playground_log_in", path);
    },
    async clearLog(path) {
      console.log("path " + JSON.stringify(path));
      Vue.set(this.log_path_lenght, path, 0);
      Vue.set(this.log_path_lenghtstatus, path, 0);
      var log = store.dispatch("pipelineLLO/rmlog", {
        path: path,
      });
    },
    async setFilter() {
      console.log(JSON.stringify(this.search));

      var ddd8 = JSON.stringify(this.search.datestart);
      ddd8 = ddd8.replace(/"/g, ""); //"
      var datestart = DateTime.fromISO(ddd8, { zone: "Europe/Athens" });
      //console.log(datestart.zoneName); //=> 'Europe/Paris'
      //console.log(datestart.toString()); //=> 'Europe/Paris'

      var ddd18 = JSON.stringify(this.search.dateend);
      ddd18 = ddd18.replace(/"/g, ""); //"
      var dateend = DateTime.fromISO(ddd18, { zone: "Europe/Athens" });

      var restapi = "on";
      var logrestapi = await store.dispatch("pipelineLLO/setRestapi", {
        restapi: restapi,
      });
      var swarmlabname = new URL(location.href).searchParams.get(
        "pipelinename"
      );
      var log = await store.dispatch("pipelineLLO/get_log", {
        datestart: datestart.toISODate(),
        dateend: dateend.toISODate(),
        swarmlabname: swarmlabname,
      });
      var mongolog = store.getters["pipelineLLO/getmongolog"];
      console.log("paramp " + JSON.stringify(mongolog));

      //this.$root.$emit('GREP_on_data',mongolog.data.data)

      // list files from data
      this.log_path = [...new Set(mongolog.map((item) => item.tailed_path))];
      var loglenght = "";
      for (let item of this.log_path) {
        loglenght = mongolog.filter((item1) => item1.tailed_path === item)
          .length;
        Vue.set(this.log_path_lenght, item, loglenght);
        if (loglenght > this.loglenghttotal) {
          // -------------------------------------
          //  Save store
          // -------------------------------------
          var ltotal1 = store.dispatch("pipelineLLO/taillog", {
            path: item,
          });
        }
      }
    },
    async resetFilter() {
      console.log(JSON.stringify(this.logdata));
    },
    async socketopen() {
      console.log("inside socketopen()");
      this.$socket.client.open();
    },
    async socketauthenticate() {
      var tokentmp = this.logintoken;
      // pernaw hardcoded to token
      console.log("Inside socket authenticate");
      this.$socket.client.emit("authenticate", tokentmp);
    },
    async socketreconnect() {
      console.log("inside socketreconnect() --- sending to socketopen()");
      var log = await this.socketopen();
      this.socketauthenticate();
    },
    /**
     *
     * == socketclose()
     *
     * [source,javascript]
     * ----
     *       this.$socket.client.close();
     * ----
     *
     */

    async socketclose() {
      this.$socket.client.close();
    },
  },
  computed: {
    httpOptions() {
      var token = store.getters["pipelineLLO/gettoken"];
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }; //table props -> :http-options="httpOptions"
    },
  },
  beforeMount() {
    this.socketauthenticate();
    console.log("send1");
  },

  /**
 *
 * == Socket subscribe
     *
 * [source,javascript]
 * ----
 *          ...
 *          })
     * sdfsf
     den to perni  sdfsf
 * ----
 * <1> EventBus is used for parent/child component communication.
 *
 */
  mounted() {
    // from AdhocView
    this.$root.$on("SERVER_socket_connect", (v) => {
      this.$nextTick(function() {
        console.log("socket recconect inside runllo");
        this.socketreconnect();
      });
    });
  },
  /**
   *
   * == Destroy EventBus
   *
   * See
   * https://www.digitalocean.com/community/tutorials/vuejs-component-lifecycle[Vue.js Lifecycle Hooks^].
   *
   * *beforeDestroy*
   *
   * - beforeDestroy is fired right before teardown. Your component will still be fully present and functional.
   *
   * [source,javascript]
   * ----
   * ----
   * <1> EventBus is used for parent/child component communication.
   *
   */
  beforeDestroy() {
    this.$root.$off("SERVER_socket_socket");
  },
  /**
   *
   * == Open a socket
   *
   * See
   * https://www.digitalocean.com/community/tutorials/vuejs-component-lifecycle[  Vue.js Lifecycle Hooks^]
   *
   * *Created*
   *
   * - You are able to access reactive data and events that are active with the created hook. Templates and Virtual DOM have not yet been mounted or rendered:
   *
   * [source,javascript]
   * ----
   *   this.socketopen()
   * ----
   *
   */

  created() {
    //var logintoken = new URL(location.href).searchParams.get("token");
    var logintoken = new URL(
      "https://api-client.swarmlab.io:8088/?token=1e46b03ddd79f1237404a5e4c5dd487b21f98b1f"
    ).searchParams.get("token");
    this.logintoken = logintoken;
    // === We get the user + check for the token if exists
    this.checktoken(this.logintoken);
    //console.log(" from created ", data);
    var log = store.dispatch("pipelineLLO/settoken", {
      token: logintoken,
    });

    this.socketopen();

    // let p = axios.get("http://localhost:3000/test");
    // console.log(p);
  },
  /**
   *
   * == Socket events
   *
   * [source,javascript]
   * ----
   *   this.$socket.client.emit('authenticate', 'logintoken');
   * ----
   *
   */
  sockets: {
    connect() {
      var logintoken = store.getters["pipelineLLO/gettoken"];
      this.$socket.client.emit("authenticate", logintoken);

      this.$socket.client.emit("socket_id_get", "socketdatasend");
      //var username = 'username'
      //var roomname = 'roomname'
      //this.$socket.client.emit('setUsername',{user:username});
      //this.$socket.client.emit('createRoom', {user:username,room:roomname});
      //this.$socket.client.emit('joinRooom',{room:roomname});
      //var msg = {user:username,room:roomname,msg:'hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'}
      //this.$socket.client.emit('sendMessage',msg);
      console.log("socket connected " + "socketdatasend");
      this.issocket = "open";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "on");
      this.getuser(logintoken);
      //asd
    },
    /**
     *
     * === onError
     *
     */
    error(error) {
      console.log("socket error " + JSON.stringify(error));
      this.issocket = "close";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
    },
    /**
     *
     * === connect_error
     *
     */
    connect_error(error) {
      console.log("socket connect_error " + JSON.stringify(error));
      this.issocket = "close";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === connect_error
     *
     */
    disconnect(reason) {
      console.log("socket disconnect " + JSON.stringify(reason));
      this.issocket = "close";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === Socket connect_timeout
     *
     */
    connect_timeout(reason) {
      console.log("socket timeout " + JSON.stringify(reason));
      this.issocket = "close";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === Socket reconnect
     *
     */
    reconnect(attemptNumber) {
      console.log(
        "socket reconnect attemptNumber " + JSON.stringify(attemptNumber)
      );
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === connect_attempt
     *
     */
    reconnect_attempt(attemptNumber) {
      console.log("socket reconnect_attempt " + JSON.stringify(attemptNumber));
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === Socket reconnecting
     *
     */
    reconnecting(attemptNumber) {
      console.log("socket reconnecting " + JSON.stringify(attemptNumber));
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === reconnect_error
     *
     */
    reconnect_error(error) {
      console.log("socket reconnect_error " + JSON.stringify(error));
      this.issocket = "close";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
      this.socketreconnect();
    },
    /**
     *
     * === unauthorized
     *
     */
    unauthorized(val) {
      console.log("socket unauthorized " + JSON.stringify(val));
      this.issocket = "close";
      // send to AdhocView
      this.$root.$emit("SERVER_socket_status", "off");
    },
    /**
     *
     * === connected
     *
     */
    socket_id_emit(val) {
      console.log("socket id from server " + JSON.stringify(val));
      console.log("socket id from serveri saved " + JSON.stringify(socketsave));
      this.issocket = "open";
    },
    /**
     *
     * === Socket onMessage
     *
     */
    /*
     */
    async logdata(val) {
      console.log(" socket from logdata " + JSON.stringify(val));
      // -------------------------------------
      //  Save store
      // -------------------------------------
      var log = store.dispatch("pipelineLLO/addlog", {
        log: val,
      });
      // -------------------------------------
      // send to grep rungrep to view
      // -------------------------------------
      this.$root.$emit("GREP_on_data", val);
      // -------------------------------------
      // send to AdhocView to view in code
      // -------------------------------------
      //  this.$root.$emit('playground_log_in',val.value)
      // -------------------------------------
      // send to AdhocView for socket status
      // -------------------------------------
      this.$root.$emit("SERVER_socket_status", "on");

      var ltmp = store.getters["pipelineLLO/getlog"];
      //console.log('logtmpltmp '+ JSON.stringify(ltmp))
      this.log_path = [...new Set(ltmp.map((item) => item.tailed_path))];
      var loglenght = "";
      for (let item of this.log_path) {
        //console.log('l1find '+ JSON.stringify(item))
        loglenght = ltmp.filter((item1) => item1.tailed_path === item).length;
        Vue.set(this.log_path_lenght, item, loglenght);
        if (loglenght > this.loglenghttotal) {
          // -------------------------------------
          //  Save store
          // -------------------------------------
          var ltotal1 = store.dispatch("pipelineLLO/taillog", {
            path: item,
          });
        }
        //console.log('l2 '+ this.log_path_lenght[item] )
      }
      //console.log('l1 '+ JSON.stringify(this.log_path))
    },
    async message(val) {
      console.log(" socket message " + JSON.stringify(val));
    },
    // Lefos --- socket event to add the data to the right tables
    async logsend(val) {
      // ==== LEFOS
      //Check which data array to put as data to the tables
      this.checklogs();

      var log = store.dispatch("pipelineLLO/addlog", {
        log: val,
      });

      val.container_id = '<div class="conid">' + val.container_id + "</div>";
      // console.log("raw before.. " + val.log);

      // A bit of edit to fit perfectly into the table
      val.log = val.log.replace(/,/g, ", ");
      val.log = val.log.replace(/":/g, '": ');
      // console.log("raw after .. " + val.log);

      // Change color of source for ALL RAW table to be able to see the error logs easy
      if (val.source == "stdout") {
        val.source = '<div class="outtype" >' + val.source + "</div>";
        this.rawout.push(val);
      } else {
        val.source = '<div class="errtype" >' + val.source + "</div>";
        this.rawerror.push(val);
      }

      this.countIndex++;
      this.rawdata.push(val);

      // Check if the log is by a node_service and change color of the type field
      if (val.tag.includes("node") && this.IsJsonString(val.log)) {
        var test = JSON.parse(val.log);
        test.app_name = val.container_name;
        if (test.type == "out") {
          test.type = '<div class="outtype" >' + test.type + "</div>";
          this.localDataOut.push(test);
        } else if (test.type == "err") {
          test.type = '<div class="errtype" >' + test.type + "</div>";
          this.localDataError.push(test);
        }
        this.localData.push(test);
      } //check if the log is by the mongodb and change color
      else if (val.tag.includes("node") && !this.IsJsonString(val.log)) {
        var tmp2;
        var type;
        if (val.source.includes("stdout")) {
          // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
          //type = '<div class="outtype" >' + val.source + "</div>";
          tmp2 = {
            message: val.log,
            timestamp: val.time,
            type: '<div class="outtype" >' + "out" + "</div>",
            process_id: "-",
            app_name: val.container_name,
          };
          this.localDataOut.push(tmp2);
          this.localData.push(tmp2);
        } else if (val.source.includes("stderr")) {
          //type = '<div class="outtype" >' + val.source + "</div>";
          tmp2 = {
            message: val.log,
            timestamp: val.time,
            type: '<div class="errtype" >' + "err" + "</div>",
            process_id: "-",
            app_name: val.container_name,
          };
          this.localDataError.push(tmp2);
          this.localData.push(tmp2);
        }
      } else if (val.tag.includes("mongodb") && this.IsJsonString(val.log)) {
        // ========== push data for raw table ============
        var tmp = JSON.parse(val.log);

        if (tmp.s == "I") {
          tmp.s = '<div class="outtype" >' + tmp.s + "</div>";
          this.mongoout.push(tmp);
        } else {
          tmp.s = '<div class="errtype" >' + tmp.s + "</div>";
          this.mongoerror.push(tmp);
        }
        tmp.t = '<div class="mongod">' + JSON.stringify(tmp.t) + "</div>";
        this.mongodata.push(tmp);
        // ===========

        //msg
        var tmplog = JSON.parse(val.log);
        var msg2 = tmplog.msg;

        //timestam
        var time = tmplog.t;
        time = time.$date;
        var tmp = {
          message: msg2,
          timestamp: time,
          type: "<div class= 'outtype'>out</div>",
          process_id: "Unknown",
          app_name: val.container_name,
        };

        this.localDataOut.push(tmp);
        this.localData.push(tmp);
        // console.log("HEY " + JSON.stringify(test));
      } else if (val.tag.includes("redis")) {
        var tmplog = val;
        //timestamp
        var time = tmplog.time;
        var tmp = {
          message: tmplog.log,
          timestamp: time,
          type: "<div class= 'outtype'>out</div>",
          process_id: "Unknown",
          app_name: val.container_name,
        };

        this.localDataOut.push(tmp);
        this.localData.push(tmp);
      }
    },
  },
};
</script>

<style>
.table2 {
  overflow: auto;
  /* overflow-anchor: none; */
  max-height: 400px;
  min-width: 100%;
}
.outtype {
  color: rgb(0, 0, 0) !important;
  background-color: rgba(13, 233, 13, 0.411) !important;
  padding: 5px;
}
.errtype {
  color: white;
  background-color: rgb(197, 29, 29);
  padding: 5px;
}
h2 {
  background-color: dimgray;
  padding: 10px;
  color: white;
  margin-top: 20px;
  border-radius: 5px;
  width: 100%;
}
.CodeMirror {
  font-family: monospace;
}
.rowlog {
  display: flex; /* equal height of the children */
  min-height: 600px;
  box-shadow: 3px 3px 10px 10px rgba(0, 0, 0, 0.281);
  margin-bottom: 40px;
  margin-top: 20px;
  padding: 5px;
}
.logs {
  width: 100%;
}
button {
  padding: 10px 10px 10px 10px;
  margin: 10px 10px 10px 0px;
}
.conid {
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px;
  width: 120px;
  height: 100px;
  display: inline-block;
}
.conid:hover {
  transition: 0.7s;
  width: 580px;
  background-color: rgb(49, 49, 49);
  color: #fff;
  position: relative;
  border-radius: 6px;
  padding: 5px;
}

.mongod {
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px;
  width: 110px;
  height: 140px;
  /* position: relative; */
  display: inline-block;
}
.mongod:hover {
  transition: 0.7s;
  width: 330px;
  background-color: rgb(63, 61, 61);
  color: #fff;
  border-radius: 6px;
  padding: 5px;
}
</style>
