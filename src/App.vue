<template>
  <div id="app">
    <!-- ***************** nav items ****************** -->
    <b-navbar toggleable="md" class="navbar-secondary">
      <b-navbar-toggle target="nav_collapse"> </b-navbar-toggle>
      <b-navbar-brand class="logo simple-text ti-swarmlab text-secondary">
        Swarmlab.io Playground
      </b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav> </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="https://git.swarmlab.io:3000" target="_swarmlabgit">
            Swarmlab_git
          </b-nav-item>
          <b-nav-item> | </b-nav-item>
          <b-nav-item
            :href="'https://api-client.swarmlab.io:8088/?token=' + token"
            target="_swarmlab"
          >
            Lab_onDemand
          </b-nav-item>
          <b-nav-item> | </b-nav-item>
          <!--
              <b-nav-form>
                <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
                <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
              </b-nav-form>
            -->
          <!--  template
              <b-nav-item-dropdown right>
            -->

          <!-- Using template slot -->
          <!--  template
                <template slot="button-content">
                  <em>Template</em>
                </template>

                <b-dropdown-item >
                    <button type="button"
                          round
                          class="btn btn-outline-info btn-sm"
                          @click="connect_to_iot('mesh')">
                          add</button>
                </b-dropdown-item>

              </b-nav-item-dropdown>

              <b-nav-item > &nbsp; &nbsp; &nbsp;  </b-nav-item>

                    <button type="button"
                          round
                          class="btn btn-outline-info btn-sm"
                          @click="saveDocLive">
                          Save As Zip</button>
              -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- ***************** container items ****************** -->
    <b-row>
      <b-col cols="12">
        <doc-live style="background-color: #f8f9fa"> </doc-live>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <doc-grep style="background-color: #f8f9fa"> </doc-grep>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DocLive from "./components/DocLive.vue";
import DocGrep from "./components/DocGrep.vue";
import axios from "axios";
import "@/assets/css/themify-icons.css";

export default {
  name: "app",
  components: {
    DocLive,
    DocGrep,
  },
  data() {
    return {
      show: true,
      token: "",
      SwarmabAsciiLabTemplate: "",
    };
  },
  mounted() {},
  created() {
    //var url_string = window.location.href;
    //hardcoded token
    var url_string =
      "https://api-client.swarmlab.io:8088/?token=8ee68923f567ad2fb5835f579c4d74f0cad6b1d1";
    var url = new URL(url_string);
    this.token = url.searchParams.get("token");
    console.log("token " + this.token);
  },
  methods: {
    saveDocLive() {
      this.$root.$emit("asciilive_save", "save");
    },
    async connect_to_iot(iot) {
      if (iot == "mesh") {
        this.SwarmabAsciiLabTemplate = {
          iot5: {
            id: 5,
            name: "auto5",
            img: "rinse.png",
            Servicios: [
              { model: "Sentra", doors: 4 },
              { model: "Maxima", doors: 4 },
              { model: "Skyline", doors: 2 },
            ],
          },
        };
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Lato:400,700");

body {
  background: #eef1f4 !important;
}

.nav-background {
  background: #353535;
}

.ti-swarmlab:before {
  position: relative;
  top: -5px;
  right: -8px;
  font-size: 1.5em;
  font-weight: 300;
  content: "\e606";
  color: #222;
  color: #74b3c8;
  border-color: #c60000;
}

.ti-themify-logo:before {
  content: "\e6d1";
}

.menoutext {
  font-family: "Lato", sans-serif !important;
}
.col-4 {
  max-width: 25%;
  flex: 0 0 25%;
}
.col-3 {
  max-width: 35%;
  flex: 0 0 35%;
}
.col-5 {
  max-width: 40%;
  flex: 0 0 40%;
}
</style>
