<template>
  <div>
    <!--  menou -->
    <div class="row" v-show="showmenou == 1">
      <div class="col-3">
        <div class="input-group-append">
          <button
            type="button"
            round
            v-if="columnviewdefault == '0'"
            class="ti-layout-sidebar-none btn btn-outline-info btn-sm"
            @click="fullscreen('max')"
          >
            Max-Notebook View
          </button>

          <button
            type="button"
            round
            v-if="columnviewdefault == '1'"
            class="ti-layout-sidebar-right btn btn-outline-info btn-sm"
            @click="fullscreen('min')"
          >
            Min-Notebook View
          </button>
        </div>
      </div>

      <div class="col-6">
        <span></span>
      </div>

      <div class="col-3">
        <div class="input-group-prepend">
          <button
            type="button"
            round
            v-if="columncodedefault == '0'"
            class="ti-layout-sidebar-none btn btn-outline-info btn-sm"
            style="float: right;"
            @click="fullscreen('codemax')"
          >
            Max-Code View
          </button>

          <button
            type="button"
            round
            v-if="columncodedefault == '1'"
            style="float: right;"
            class="ti-layout-sidebar-left btn btn-outline-info btn-sm"
            @click="fullscreen('codemin')"
          >
            Min-Code View
          </button>
        </div>
      </div>
    </div>
    <!-- menou -->

    <div class="row">
      <div :class="columnview">
        <ad-hoc style="background-color: #f8f9fa"> </ad-hoc>
      </div>

      <div :class="columncode">
        <run-llo style="background-color: #f8f9fa"> </run-llo>
      </div>
    </div>
  </div>
</template>

<script>
import RunLlo from "./doclive/runLlo.vue";
import AdHoc from "./doclive/AdhocView.vue";

export default {
  name: "DocLive",
  props: {},
  components: {
    RunLlo,
    AdHoc,
  },
  data() {
    return {
      loading: false,
      showhistory: 0,
      productIndex: 1,
      showmenou: 1,
      columnviewdefault: 0,
      columncodedefault: 0,
      columnview: "col-7 order-first",
      columncode: "col-5 order-last",
      tutorMenou: "student",
    };
  },
  created: function() {},
  mounted() {
    this.$root.$on("LLOshowmenounotebooks", () => {
      this.showmenou = 1;
    }),
      this.$root.$on("lloshowchallengehistory", (llo, active) => {
        this.showhistory = 1;
      });
  },
  beforeDestroy() {
    this.$root.$off("LLOshowmenounotebooks"),
      this.$root.$off("lloshowchallengehistory"); // working
  },
  methods: {
    fullscreen(action) {
      if (action == "max") {
        this.columnview = "col-11 order-first";
        this.columncode = "col-1 order-last";
        this.columnviewdefault = 1;
        this.columncodedefault = 0;
        //set height iframe
        this.$root.$emit("LLOresizemenounotebooks", "max");
        console.log(this.columnview);
      } else if (action == "min") {
        this.columnview = "col-7 order-first";
        this.columncode = "col-5 order-last";
        this.columnviewdefault = 0;
        this.columncodedefault = 1;
        //set height iframe
        this.$root.$emit("LLOresizemenounotebooks", "min");
        console.log(this.columnview);
      } else if (action == "codemax") {
        this.columnview = "col-1 order-first";
        this.columncode = "col-11 order-last";
        this.columnviewdefault = 0;
        this.columncodedefault = 1;
        console.log(this.columnview);
      } else if (action == "codemin") {
        this.columnview = "col-7 order-first";
        this.columncode = "col-5 order-last";
        this.columnviewdefault = 1;
        this.columncodedefault = 0;
        this.$root.$emit("LLOresizemenounotebooks", "min");
        console.log(this.columnview);
      }
    },
    async onAction(action) {
      this.tutorMenou = "tutor";
      //this.tutorMenou='student'
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.col-7 {
  max-width: 48%;
}
.col-5 {
  flex: 0 0 50%;
  max-width: 50%;
}
</style>
