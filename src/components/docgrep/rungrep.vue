<template>
  <div class="runGrep">
    <div class="row">
      <div class="col-12">
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <div class="input-group-text">/</div>
          </div>

          <input
            type="text"
            class="form-control"
            placeholder="regex"
            v-model="search.regex"
          />

          <div class="input-group-append">
            <div class="input-group-text">/</div>

            <div class="form-control custom-switch">
              <input
                id="customSwitch1"
                type="checkbox"
                class="custom-control-input"
                v-model="search.case"
              />
              <label class="custom-control-label" for="customSwitch1"
                >Ignore case</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- row -->

    <div class="row">
      <div class="col-9">
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <div class="input-group-text">Log</div>
          </div>
          <input
            type="text"
            class="form-control"
            placeholder="file"
            v-model="search.log"
          />
          <input
            type="text"
            class="form-control"
            placeholder="desc"
            v-model="search.desc"
          />
        </div>
      </div>
      <!-- col -->

      <div class="col-3">
        <button
          class="btn btn-outline-secondary"
          round
          type="button"
          @click="setregex"
        >
          Search
        </button>
      </div>
      <!-- col -->
    </div>
    <!-- row -->

    <div class="row">
      <div class="col-12 viewGrep">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">Log</th>
              <th scope="col">Regex</th>
              <th scope="col">IC</th>
              <th scope="col">Desc</th>
            </tr>
          </thead>
          <tbody v-for="item in log">
            <tr>
              <td>
                <span
                  class="badge badge-danger badge-pill"
                  style="cursor: pointer"
                  @click="removeregex(item.id)"
                  >Remove</span
                >
              </td>
              <td style="cursor: pointer">{{ item.log }}</td>
              <td style="cursor: pointer">{{ item.regex }}</td>
              <td style="cursor: pointer">{{ item.case }}</td>
              <td style="cursor: pointer">{{ item.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- col -->
    </div>
    <!-- row -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, dispatch } from "vuex";
import Vue from "vue";
import store from "@/store/index";
export default {
  components: {},
  data() {
    return {
      search: {
        log: "",
        regex: "",
        desc: "",
        case: true,
      },
      obj: 1,
      log: [],
    };
  },
  methods: {
    removeregex(index) {
      let ind = this.log.map((item) => item.id).indexOf(index); // find index
      this.log.splice(ind, 1);
      //console.log(JSON.stringify(index))
      //console.log(JSON.stringify(this.log))
    },
    setregex() {
      var o = {};
      o.id = this.obj++;
      o.log = this.search.log;
      o.regex = this.search.regex;
      o.case = this.search.case;
      o.desc = this.search.desc;
      this.log.push(o);
      //console.log(JSON.stringify(this.log))
    },
  },
  mounted() {
    this.$root.$on("GREP_on_data", (message) => {
      this.$nextTick(function() {
        var regexpath = this.log.filter(
          (item) => item.log === message.log.tailed_path
        );

        //console.log('regexpath2 '+ JSON.stringify(regexpath))
        var code = "";
        var regexoutput = false;
        if (Array.isArray(regexpath) && regexpath.length) {
          regexoutput = true;
        } else {
          regexoutput = false;
        }
        if (regexoutput) {
          //var logtmp = store.getters['pipelineLLO/getlog'];
          var logtmp = message.log.message;
          //var itemlog = ''
          code += "";
          //itemlog = logtmp.filter(item1 => item1.tailed_path === path);
          //console.log('logtmp22 '+ JSON.stringify(itemlog))
          for (let regex of regexpath) {
            //console.log(regex.regex)
            if (regex.case) {
              var re = new RegExp(regex.regex, "i");
              //console.log("true");
            } else {
              var re = new RegExp(regex.regex);
              //console.log("false");
            }
            if (re.test(logtmp)) {
              code += logtmp + " " + message.log.tailed_path;
              code += "\n";
              // -------------------------------------
              // send to grep rungrep to view
              // -------------------------------------
              this.$root.$emit("GREP_view_data", code);
            } else {
              console.log("Not found");
            }
          }
        }
      });
    });
  },
  beforeDestroy() {
    this.$root.$off("GREP_on_data");
  },
};
</script>

<style>
.runGrep {
  font-family: monospace;
  height: 350px;
}
.viewGrep {
  height: 300px;
  overflow-y: auto;
}
</style>
