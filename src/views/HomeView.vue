<template>
  <v-layout class="pa-0 ma-0" align-content-center justify-end>
    <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
    <ProgressBar :mensagem="mensagemAguarde"/>
    <v-container v-show="mostraTela">
      <v-row dense v-for="item in funcionalidades" :key="item.id" > 
        <v-col cols="12">
          <v-layout class="px-2 py-2" v-show="item.ativo==true">
            <v-expansion-panels focused>
              <v-expansion-panel class="py-1 blue-grey lighten-5">
                <v-expansion-panel-header disable-icon-rotate v-on:click="executaFuncao(item.id)">    
                  <div class="d-flex align-center">
                      <v-icon :color="item.iconColor">{{item.icon}}</v-icon><span :class="'ml-2 ' + item.textColor"> {{item.text}}</span>
                  </div>
                  <template v-slot:actions>
                    <v-icon v-on:click="executaFuncao(item.id)" :color="item.iconColor">mdi-arrow-right-circle-outline</v-icon>
                  </template>
                </v-expansion-panel-header>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
  import color from '../config/colors'
  import mainService from '../services/mainService'
  import ProgressBar from '../lastec.components/lastec-progressbar.vue'
  import MessageBox from '../lastec.components/lastec-messagebox'

  export default {
    components: {
      ProgressBar, MessageBox
    },
    data() {
      return {
        // Dados
        tipoMensagem: 0,
        mensagem: '',
        mensagemAguarde: '',

        token: '',
        mostraTela:false,
        semAcesso: false,
        funcionalidades: [
          {
            id: 1, 
            textColor: color.textColor.menuHome, 
            text: 'Baixe da nuvem dados dos cidadãos atualizados para visitação ', 
            icon: 'mdi-cloud-download', 
            iconColor: color.icon.menuHome, 
            ativo: false,
            func: 'cadastraMonitoramento2()', 
            perms: [{id:109, tipoId:1, acao:'I'}, {id:110, tipoId:1, acao:'C'}
            ]
          }, {   
            id: 2, 
            textColor: color.textColor.menuHome, 
            text: 'Registre as visitas na residência do cidadão', 
            icon: 'mdi-home-map-marker', 
            iconColor: color.icon.menuHome, 
            ativo: false,
            func: 'cadastraMonitoramento2()', 
            perms: [
              {id:111, tipoId:1, acao:'I'},
            ]
          },
          {   
            id: 3, 
            textColor: color.textColor.menuHome, 
            text: 'Atualize na nuvem as últimas visitas realizadas', 
            icon: 'mdi-cloud-upload', 
            iconColor: color.icon.menuHome, 
            ativo: false,
            func: 'cadastraMonitoramento(2)',
            perms: [
              {id:115, tipoId:1, acao:'I'}, 
              {id:116, tipoId:1, acao:'C'}
            ]
          }
        ]
      }
    },
    created() {
      this.preparaTela()
      this.$store.commit('habilitaUserbar', true)
    },
    async mounted() {
      await this.registraApi()
    },
    computed: {
      mensagemErro: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 1
          this.mensagem = val
        }
      },
      mensagemSucesso: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 0
          this.mensagem = val
        }
      },
    },
    methods: {
      async registraApi() {
        this.mensagemAguarde =  'Registrando o dispositivo na nuvem... Aguarde!'
        const usuarioGuid = '9a117082-58cc-4ff7-be79-e6cb25cc118f'

        this.isLoading = true
        let erro = false
        const resposta = await mainService.autentica(usuarioGuid)        
        .catch (err => {
            this.mensagemAguarde =  ''
            this.isLoading = false
            this.mensagemErro =  'Autenticando API: ' + mainService.catchPadrao(err)
            erro = true
        });
        this.mensagemAguarde =  ''
        if (erro) {
          return
        }

        if (resposta.status != 200) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  resposta.message
          return;
        }

        const _dados = resposta.data
        if (!((_dados.token) && (_dados.cidadesAutorizadasDTO))) {
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32158] '
          return;
        }

        const _cidades = _dados.cidadesAutorizadasDTO
        if (_cidades.length == 0) {
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32157] '
          return
        }

        if (!((_cidades[0].cidadeId) && (_cidades[0].nomeCidade))) {
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32156] '
          return
        }

        const _param = {
          token: _dados.token,
          cidadeId: _cidades[0].cidadeId,
          nomeCidade: _cidades[0].nomeCidade,
          autenticado: true,
          unidadeSaudeId: _cidades[0].unidadeSaudeId,
          nomeUnidadeSaude: _cidades[0].nomeUnidadeSaude,
          microAreaId: _cidades[0].microAreaId,
          nomeMicroArea: _cidades[0].nomeMicroArea,
          bairroId: _cidades[0].bairroId,
          nomeBairro: _cidades[0].nomeBairro,
          logradouroId: _cidades[0].logradouroId,
          nomeLogradouro: _cidades[0].nomeLogradouro,
        }
        this.$store.commit('autenticaApi', _param)
      },
      executaFuncao(id) {
        switch (id) {
          case 1:
            this.$router.push('downloadData');
            break;
          case 2:
            this.$router.push('visita');
            break;
          case 3:
            this.$router.push('uploadData') 
            break
          default:
            this.mensagemErro = `funcionalidade não implementada [id=${id}]`
        }
      },
      preparaTela() {
        for (var i=0; i < this.funcionalidades.length; ++i) {
          this.funcionalidades[i].ativo = true
        }
        this.mostraTela = true
      },
    }
  }
</script>

