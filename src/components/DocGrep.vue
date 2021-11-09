<template>
<div>

    <div class="row" >

                <div :class="columnview">
                  <ad-grep
                    style="background-color: #f8f9fa"
                  >
                  </ad-grep>
                </div>

                <div :class="columncode">
                  <run-grep
                    style="background-color: #f8f9fa"
                  >
                  </run-grep>
                </div>
    </div>

 </div>
</template>

<script>
import RunGrep from "./docgrep/rungrep.vue";
import AdGrep from "./docgrep/GrepView.vue";

export default {
  name: 'DocGrep',
  props: {
  }, 
  components: {
    RunGrep,
    AdGrep
  },
  data () {
      return {
        loading: false,
        showhistory : 0,
        productIndex: 1,
        showmenou: 1,
        columnviewdefault : 0,
        columncodedefault : 0,
        columnview : 'col-7 order-first',
        columncode : 'col-5 order-last',
        tutorMenou: 'student'
      }
    },
      created: function () {
    },
  mounted() {
      this.$root.$on('LLOshowmenounotebooks', () => {
        this.showmenou = 1
      }),
    this.$root.$on('lloshowchallengehistory', (llo,active) => {
      this.showhistory = 1
    })
    },
   beforeDestroy () {
    this.$root.$off('LLOshowmenounotebooks'),
    this.$root.$off('lloshowchallengehistory') // working
   },
 methods: {
         fullscreen(action){
          if(action == 'max'){
              this.columnview = 'col-11 order-first'
              this.columncode = 'col-1 order-last'
              this.columnviewdefault = 1
              this.columncodedefault = 0
              //set height iframe
              this.$root.$emit('LLOresizemenounotebooks','max')
              console.log(this.columnview)
           }
           else if(action == 'min'){
              this.columnview = 'col-7 order-first'
              this.columncode = 'col-5 order-last'
              this.columnviewdefault = 0
              this.columncodedefault = 1
              //set height iframe
              this.$root.$emit('LLOresizemenounotebooks','min')
              console.log(this.columnview)
           }
           else if(action == 'codemax'){
              this.columnview = 'col-1 order-first'
              this.columncode = 'col-11 order-last'
              this.columnviewdefault = 0
              this.columncodedefault = 1
              console.log(this.columnview)
           }
           else if(action == 'codemin'){
              this.columnview = 'col-7 order-first'
              this.columncode = 'col-5 order-last'
              this.columnviewdefault = 1
              this.columncodedefault = 0
              this.$root.$emit('LLOresizemenounotebooks','min')
              console.log(this.columnview)
           }
         },
          async onAction (action) {
              this.tutorMenou='tutor'
              //this.tutorMenou='student'
          }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
