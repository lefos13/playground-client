import Vuex from 'vuex'
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
// -------------- Playbook----------------
import pipelineLLO from './modules/create_pipelineLLO'
import { library, dom } from '@fortawesome/fontawesome-svg-core'

import {faIcons, faSort, faChevronUp, faChevronDown, faBars, fas } from '@fortawesome/free-solid-svg-icons'
import { faJs, faVuejs, fab,  faFontAwesome} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'





Vue.use(Vuex)
Vue.use(BootstrapVue);



Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faIcons, faSort, faChevronUp, faChevronDown, faBars, faJs, faVuejs, fab, fas, faFontAwesome)
dom.watch() // This will kick of the initial replacement of i to svg tags and configure a MutationObserver


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


export default new Vuex.Store({
  modules: {
		pipelineLLO
  },
  state: { // = data
  },
  getters: { // = computed properties
  },
  mutations: {
  }
})
