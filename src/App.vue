<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <!-- <p style="color:red" v-show="httpError.hasError">{{httpError.status}} | {{httpError.statusText}}</p>
    <button @click="httpGet">get test</button> -->
    <!-- <p>{{reponseData}}</p> -->
    <!-- <p>{{reponseData1}}</p> -->
    <router-view />
  </div>
</template>

<script>
import { get } from "@/request/api";
export default {
  name: "app",
  data(){
    return {
      reponseData:null,
      reponseData1:1111111
    }
  },
  mounted(){
    // this.httpGet();
  },
  // computed: {
  //   httpError() {
  //     console.log(this.httpError.$store)
  //     return this.httpError.$store;
  //   }
  // }, 
  methods: {
    httpGet() {
      getTest('/diagram/diagraminstantiation/ztinfo').then(response => {
        this.reponseData = response.data; 
        console.log(response,11)
      });
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  background: #151a37;
  /* margin-top: 60px; */
}
</style>
