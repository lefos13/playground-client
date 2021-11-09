<template>
  <div>

      <b-row  no-gutters w-100 h-100 
        v-if="showlloedit"
      >
         <b-col cols="12" sm="12" md="12"  >

<hr 
 v-if="!tryConsole"
>
                <div class="input-group input-group-sm d-flex justify-content-end">
                    <div class="input-group-append">
                      <button type="button"
                          round
                          class="btn btn-outline-warning btn-sm"
                          v-if="tryConsole"
                          @click="clear()">
                          Clear</button>
                    </div>
                 </div>

                <div class="CodeMirrorGrep" >
                  <codemirror
                    ref="myCm"
                    :value="code"
                    :options="cmOptions"
                     @cursorActivity="onCmCursorActivity"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange"
                  ></codemirror>
                </div>

           </b-col>
       </b-row>



	</div>
</template>
<script>
import {mapState, mapGetters, mapActions,dispatch} from 'vuex'
import Vue from 'vue'
import store from '@/store/index'                              


import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neat.css'
  import 'codemirror/theme/paraiso-light.css'
import'codemirror/addon/selection/active-line.js'

import'codemirror/addon/hint/show-hint.js'
import'codemirror/addon/hint/show-hint.css'
import'codemirror/addon/hint/javascript-hint.js'
import'codemirror/addon/selection/active-line.js'
import'codemirror/addon/scroll/annotatescrollbar.js'
import'codemirror/addon/search/matchesonscrollbar.js'
import'codemirror/addon/search/searchcursor.js'
import'codemirror/addon/search/match-highlighter.js'

import'codemirror/mode/shell/shell.js'
import'codemirror/addon/edit/matchbrackets.js'
import'codemirror/addon/comment/comment.js'
import'codemirror/addon/dialog/dialog.js'
import'codemirror/addon/dialog/dialog.css'
import'codemirror/addon/search/searchcursor.js'
import'codemirror/addon/search/search.js'
import'codemirror/keymap/sublime.js'
import'codemirror/keymap/vim.js'

import'codemirror/addon/fold/foldgutter.css'
import'codemirror/addon/fold/brace-fold.js'
import'codemirror/addon/fold/comment-fold.js'
import'codemirror/addon/fold/foldcode.js'
import'codemirror/addon/fold/foldgutter.js'
import'codemirror/addon/fold/indent-fold.js'
import'codemirror/addon/fold/markdown-fold.js'
import'codemirror/addon/fold/xml-fold.js'
import 'codemirror/lib/codemirror';
import 'codemirror/addon/display/placeholder';

export default {
   components: {
			codemirror
   },
   data () {
    return {
      tryConsole:false,
      getinfo:'',
      code: '',
      optionsedit: [
        { text: 'code', value: 'code' },
        { text: 'text', value: 'text' }
      ],
		  searchLLO: [],
      searchLLOactive : false,
      showllo:true,
      showlloedit:true,
 		selected: 'sublime',
    options: [
      { text: 'vim', value: 'vim' },
      { text: 'sublime', value: 'sublime' }
    ],
    optionsmime: [
      { text: 'sh', value: 'bash' },
      { text: 'javascript', value: 'javascript' },
      { text: 'python', value: 'python' },
      { text: 'php', value: 'php' },
      { text: 'sql', value: 'sq;' },
      { text: 'xml', value: 'xml' },
      { text: 'c', value: 'c' }
    ],
        pValidate: false,
  cmOptions: {
    tabSize: 2,
    styleActiveLine: true,
    lineNumbers: true,
    lineSeparator:'\n',
    line: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
    styleSelectedText: true,
    mode: 'shell',
    hintOptions:{
      completeSingle: false
    },
    keyMap: "sublime",
    //keyMap: "vim",
    matchBrackets: true,
    showCursorWhenSelecting: true,
    indentUnit:this.ADOC_html_code,
    lineWrapping: true,
    //theme: 'neat',
    theme: 'paraiso-light',
    refresh:true,
    readOnly: true,
    autofocus: false,
    extraKeys: { "Ctrl": "autocomplete"  }
   },
    ADOC_html_code:'',
   }
  },
  methods: {

 socketconnect () {
    // send to runLLO
 },
 clear () {
      this.tryConsole = false
      this.code = ''
 },
 async getdata () {

 },

   async showactive(index) {
      this.topwindow(index)
		},
    onCmReady(cm) {
      cm.on('change', (cm, chg) => {
      }),
      cm.on('keypress', () => {
          cm.showHint({completeSingle:false})
      })
    },
    onCmCursorActivity(a, b, c) {
    },
    onCmFocus(cm) {
    },
    onCmCodeChange(newCode) {
      this.code = newCode
    },
    handleChange() {
    },
    setKeymap () {
      this.cmOptions.keyMap = this.selected
    }

  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror
   }

	},
	mounted() {

		this.$root.$on('GREP_view_data', (v) => {
			this.$nextTick(function () {
          this.code += v
          this.tryConsole=true
			})
		})
    this.$refs.myCm.codemirror.setSize(null,'350');
	},
  beforeDestroy () {
		this.$root.$off('GREP_view_data')
 },

		created () {
		}
};
</script>

<style>

</style>
