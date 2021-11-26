<template>
    <v-app-bar app flat dark  :color="background" class="pr-2">
      <v-row class="linha">
        <v-col  class="d-flex justify-center" cols="2">
          <v-btn icon v-on:click="goHome()">
            <img color="white" src="../assets/logo.png">
          </v-btn>
        </v-col>
        <v-col  class="d-flex justify-center" cols="8">
          <h4>{{titulo}}</h4>
        </v-col>
        <v-col  class="d-flex justify-center" cols="2">
          <v-icon :color="estaOnline == true ? '': 'red'" >{{iconRede(estaOnline)}}</v-icon>
        </v-col>
      </v-row>
    </v-app-bar>
    
</template>
<script>
  import color from '../config/colors'

  export default {
    name: 'AppBar',
    props: {
      estaOnline: Boolean, titulo: String, urlLogo: String
    },
    data() {
      return {
        background: color.background.appBar
      }
    },
    created() {
      console.log(this.estaOnline)
    },
    methods: { 
      iconRede: (v) => { return v == true ? 'mdi-lan-connect' : 'mdi-lan-disconnect'},
      goHome() {
        this.$router.push('/Home').catch(()=>{})
      }
    }
  }
</script>
<style scoped>
  .v-btn::before {
    background-color: transparent;
  }
  .linha {
    background-color: transparent;
    padding: 0px 0px 0px 0px;
    justify-items: center;
    align-items: center;
  }

</style>