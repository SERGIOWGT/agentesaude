<template>
    <v-container fluid style="height: 100vmax;" class="pa-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>  
        <ProgressBar :mensagem="mensagemAguarde"/>          
        <v-flex><TituloPagina titulo="BAIXA DADOS DO CIDADÃO DA NUVEM" @cbAnterior="$router.back()" /></v-flex>
         <v-row class="justify-center pt-5 mt-5">
              <v-btn :disabled="isLoading || !this.$store.getters.estaOnLine || !this.$store.getters.estaLogado" class="white--text teal lighten-2 botao-arredondado" v-on:click="iniciaBaixa()">CLIQUE AQUI PARA INICIAR</v-btn>
          </v-row>
    </v-container>
</template>
<script>
  import mainService from '../services/mainService'
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar.vue'
  import TituloPagina from '../components/TituloPagina'
      
  export default {
      name: 'identificacaoCidadao',
      components: {MessageBox, ProgressBar, TituloPagina},
      data() {
        return {
          isLoading: false,
          
          microAreaPadrao: {
            id: 0,
            nome: ''
          },

          // dados
          tipoMensagem: 0,
          mensagem: '',
          mensagemAguarde: '',

        }
      },
      created() {
        this.$store.commit('habilitaUserbar', false)
      },
      mounted() {
        this.microAreaPadrao = this.$store.getters.microAreaPadrao
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
        cbMensagemAguarde(msg) {
          this.mensagemAguarde = msg
        },
        cbMensagemErro(msg) {
          this.tipoMensagem = 1
          this.mensagem = msg
        },
        cbMensagemSucesso(msg) {
          this.tipoMensagem = 0
          this.mensagem = msg
        },
        async iniciaBaixa() {
          this.isLoading = true
          let erro = false;

          // Baixa as tabelas principais
          let resp = await mainService.listaComorbidades();
          resp = await mainService.listaSintomas();
          resp = await mainService.listaDoencas();

          // Lista todos os Pacientes da Micro Area
          this.mensagemAguarde = 'Buscando cidadãos da Micro Área... Aguarde';
          resp = await mainService.listaPacientesMicroArea(1, '')
            .catch (err => {this.mensagemAguarde = ''; erro = true; this.mensagemErro =  mainService.catchPadrao(err); });

          if (erro) {
            this.isLoading = false;
            return;
          }

          let bairros = [];
          let logradouros = [];

          // Para cada Paciente, busca os sintomas e comborbidades e salva
          const listaCidadaos = resp.status == 200 ? resp.data : []
          for(let i=0; i < listaCidadaos.length; ++i) {
            let cidadao = listaCidadaos[i];

           /*  let infoCidadao = {
              id : cidadao.id,
              bairroId: cidadao.bairroId,
              cartaoSUS: cidadao.CartaoSUS,
              celular : cidadao.celular,
              celular2 : cidadao.celular2,
              descricaoEndereco : '',
              eMail : cidadao.eMail,
              nome : cidadao.nome,
              logradouroId: cidadao.logradouroId,
              microAreaId : cidadao.microAreaId,
              nomeLogradouro : cidadao.nomeLogradouro,
              numeroEndereco : cidadao.numeroEndereco,
              complementoEndereco : cidadao.complemento,
              telefoneContato : cidadao.telefoneContato,
              tipoEstadoSaudeId: cidadao.TipoEstadoSaudeId,
              ultimaVisita: null,
              sintomas: [],
              comorbidades: [],
              doencas: [],
            }; */

            if (bairros.findIndex(x => x.id==cidadao.bairroId) === -1) {
              bairros.push({id: cidadao.bairroId, nome: cidadao.nomeBairro});
            }

            if (logradouros.findIndex(x => x.id==cidadao.logradouroId) === -1) {
              logradouros.push({id: cidadao.logradouroId, nome: cidadao.nomeLogradouro, bairroId: cidadao.bairroId});
            }

            /*resp = await mainService.listaPacienteSintomas(cidadao.id)
            .catch (err => {this.mensagemAguarde = ''; erro = true; this.mensagemErro =  mainService.catchPadrao(err); });
            if (erro) {
              this.isLoading = false;
              return;
            }
            const listaSintomas = resp.status == 200 ? resp.data : []
            listaSintomas.forEach(sintoma => { 
              infoCidadao.sintomas.push(sintoma.id);
            });
            console.log(infoCidadao);
            */
           logradouros.sort((a, b) => {const a_ = a.nome.toUpperCase(); const b_ = b.nome.toUpperCase(); return a_ == b_ ? 0 : a_ > b_ ? 1 : -1});
           bairros.sort((a, b) => {const a_ = a.nome.toUpperCase(); const b_ = b.nome.toUpperCase(); return a_ == b_ ? 0 : a_ > b_ ? 1 : -1});

          }
          localStorage.setItem('bairros__', JSON.stringify(bairros));
          localStorage.setItem('logradouros__', JSON.stringify(logradouros));

          this.isLoading = false;
          this.mensagemAguarde = '';
          this.mensagemSucesso = listaCidadaos.length == 0 ? 'Nenhum registro baixado' : listaCidadaos.length == 1 ? 'Um registro baixado com sucesso' : `${listaCidadaos.length} registros baixados com sucesso`;
        }
      }
  }
</script>
<style scoped>
  .input__label {
    color: blue;
  }
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
    display-2 {font-size: 0.8rem}
    body-2 {font-size: 0.8rem}
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
  }
</style>

