import Vue from "vue";
import App from "./App.vue";
import store from "@/store/index";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSweetalert2 from "vue-sweetalert2";
Vue.use(VueSweetalert2);

import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

const socket = io("localhost:3000", {
  //const socket = io('http://factory.swarmlab.io:55528', {
  //autoConnect: false
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 500,
  maxReconnectionAttempts: Infinity,
  pingInterval: 25000,
  pingTimeout: 60000,
  //transports: ["websocket"],
  transports: ["websocket", "polling"],
  //transports: ["polling"],
  secure: true,
  rejectUnauthorized: false,
});

Vue.use(VueSocketIOExt, socket);

Vue.use(BootstrapVue);

Vue.config.productionTip = false;
new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
