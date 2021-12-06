<template>
    <v-dialog v-model="dialog" max-width="maxWidth">
      <v-card>
        <v-card-title class="text-h9">{{titulo}}</v-card-title>
        <v-card-text>{{mensagem}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="botaoNo">{{tituloBotaoNo}}</v-btn>
          <v-btn color="green darken-1" text @click="botaoOk">{{tituloBotaoOk}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
  export default {
     props: {
      titulo: String,
      mensagem: String,
      tituloBotaoOk: String,
      tituloBotaoNo: String,
      maxWidth: String
    },
    data: () => ({
      dialog: true
    }),
    methods: {
        botaoOk() {
            this.$emit('cbOk')
        },
        botaoNo() {
            this.$emit('cbNo')
        }
    }
  }
</script>