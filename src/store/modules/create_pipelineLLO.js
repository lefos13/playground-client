import { mapState, mapActions, commit } from "vuex";
import store from "@/store/index";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    token: "",
    llo: {},
    log: [],
    mongolog: [],
    socketid: "",
    restapi: "off",
  },
  getters: {
    getrestapi(state, container) {
      //console.log("js1 get "+JSON.stringify(state.llo))
      return state.restapi;
      //return state.log
    },
    getmongolog(state, container) {
      //console.log("js1 get "+JSON.stringify(state.llo))
      return state.mongolog;
      //return state.log
    },
    getlog(state, container) {
      //console.log("js1 get "+JSON.stringify(state.llo))
      return state.log;
    },
    gettoken(state, container) {
      //console.log("js1 get "+JSON.stringify(state.llo))
      return state.token;
    },
    getllosrc(state, container) {
      //console.log("js1 get "+JSON.stringify(state.llo))
      return state.llo;
    },
    getsocketid(state, container) {
      //console.log("js1 get "+JSON.stringify(state.llo))
      return state.socketid;
    },
  },
  mutations: {
    add_log(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.log.push(data);
    },
    setrestapi(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.restapi = data;
    },
    set_token(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.token = data;
    },
    rm_log(state, path) {
      //console.log("js1 set "+JSON.stringify(data))
      state.log = state.log.filter((item) => item.tailed_path !== path);
      //const filteredArray = myarr.filter(obj => obj.name !== 'foo');
      //console.log("js1 set "+JSON.stringify(filterlog))
      console.log("js1 setrm " + JSON.stringify(state.log));

      //state.log = filterlog;
    },
    tail_log(state, path) {
      //console.log("js1 set "+JSON.stringify(data))
      state.log = state.log
        .filter((item) => item.tailed_path !== path)
        .splice(0, 4);
      //const filteredArray = myarr.filter(obj => obj.name !== 'foo');
      //console.log("js1 set "+JSON.stringify(filterlog))
      console.log("js1 setrmrmrmrmrmrmrmrm " + JSON.stringify(state.log));

      //state.log = filterlog;
    },
    setmongolog(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.mongolog.push(data);
      //state.log.push(data);
    },
    rmmongolog(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.mongolog = [];
      //state.log.push(data);
    },
    setllo(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.llo = data;
    },
    setsocketid(state, data) {
      //console.log("js1 set "+JSON.stringify(data))
      state.socketid = data;
    },
  },
  actions: {
    RMmongolog({ commit }, value) {
      commit("rmmongolog");
    },
    addlog({ commit }, value) {
      //console.log("container "+value)
      var tt = {};
      tt.message = value.log.log.message;
      tt.tailed_path = value.log.log.tailed_path;
      tt.date = value.log.date;
      commit("add_log", tt);
    },
    setRestapi({ commit }, value) {
      //console.log("container "+value)
      commit("setrestapi", value.restapi);
    },
    settoken({ commit }, value) {
      //console.log("container "+value)
      commit("set_token", value.token);
    },
    rmlog({ commit }, value) {
      //console.log("containerirm "+value)
      commit("rm_log", value.path);
    },
    taillog({ commit }, value) {
      console.log("containerirm " + value);
      commit("tail_log", value.path);
    },
    async get_data({ commit, rootGetters }, value) {
      try {
        let p = await axios.get("https://factory.swarmlab.io:55527/run", {
          timeout: 45000,
          params: {
            code: value.code,
          },
        });

        //var p = value.code
        console.log("paramp " + JSON.stringify(p));
        store.dispatch("pipelineLLO/setScriptllo", p);
        return p;
      } catch (e) {
        if (
          e.message == "Request failed with status code 401" ||
          /401/i.test(e.message)
        ) {
          window.location.href = "https://api-login.swarmlab.io:8089";
        } else {
          var R = {
            ERROR_str: e,
            ERROR: "yes",
          };
          return R;
        }
      }
    },
    async get_log({ commit, rootGetters }, value) {
      try {
        var token = store.getters["pipelineLLO/gettoken"];

        let p = await axios.get("https://factory.swarmlab.io:55527/get_log", {
          timeout: 45000,
          params: {
            token: token,
            start: value.datestart,
            end: value.dateend,
            swarmlabname: value.swarmlabname,
          },
        });

        //var p = value.code
        console.log(
          "paramp-------------------------- " + JSON.stringify(value)
        );
        store.dispatch("pipelineLLO/set_mongolog", p);
        return p;
      } catch (e) {
        if (
          e.message == "Request failed with status code 401" ||
          /401/i.test(e.message)
        ) {
          window.location.href = "https://api-login.swarmlab.io:8089";
        } else {
          var R = {
            ERROR_str: e,
            ERROR: "yes",
          };
          return R;
        }
      }
    },
    async hotreload({ commit, rootGetters }, value) {
      try {
        var token = value.token;
        var params = {
          swarmlabname: value.swarmlabname,
        };
        var options = {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        };
        var p = await axios.post(
          "https://api.swarmlab.io/swarmlabrunhotreload",
          params,
          options
        );
        if (p.error == "invalid_token") {
          console.log(p);
          console.log(JSON.stringify(p));
        } else {
        }
        //console.log(value.token)
        //console.log(value.swarmlabname)
        console.log(JSON.stringify(p));
      } catch (e) {
        if (
          e.message == "Request failed with status code 401" ||
          /401/i.test(e.message)
        ) {
          //console.log('error '+JSON.stringify(e))
          window.location.href = "https://api-login.swarmlab.io:8089";
        } else {
          var R = {
            ERROR_str: e,
            ERROR: "yes",
          };
          return R;
        }
      }
    },
    set_mongolog({ commit }, value) {
      //console.log("container "+value)
      //commit('setmongolog', value)
      for (let item of value.data.data) {
        //console.log(JSON.stringify(item))
        var itemobj = {};
        itemobj.message = item.message;
        itemobj.tailed_path = item.tailed_path;
        itemobj.date = item.time;
        //console.log('vvvvvvvvvvvvvvvvvvvvvvvv '+JSON.stringify(itemobj))

        commit("setmongolog", itemobj);
      }
    },
    setScriptllo({ commit }, value) {
      //console.log("container "+value)
      commit("setllo", value);
    },
    setsocketllo({ commit }, value) {
      //console.log("container "+value)
      commit("setsocketid", value);
    },
    setScriptCodlogAction({ commit }, value) {
      //console.log("container "+value)
      commit("setScriptCodelog", value);
    },
  },
};
