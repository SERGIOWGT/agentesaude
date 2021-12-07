<template>
  <v-layout class="pa-0 ma-0" align-content-center justify-end>
    <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
    <QuestionBox v-if="estaPerguntando"
                 titulo="Baixa dos dados da Nuvem" 
                 mensagem="Confirma a baixa dos dados da nuvem para esse dispositivo?" 
                 tituloBotaoOk="Concordo"
                 tituloBotaoNo="Cancela"
                 maxWidth="270"
                 @cbOk= "cbBotaoOk"
                 @cbNo= "cbBotaoNo"
    />
    <ProgressBar :mensagem="mensagemAguarde"/>
    <v-flex v-if="estaLogando">
      <Login :tokenSistema="tokenSistema" @cbAutenticado= "cbAutenticado"/>
    </v-flex>
    <v-flex v-else>
      <v-container v-show="mostraTela">
      <v-alert v-show="infoAlerta.mensagem !== ''" :icon="infoAlerta.icone" :color="infoAlerta.cor" prominent text dark>{{infoAlerta.mensagem}}</v-alert>
      <v-row  dense v-for="item in funcionalidades" :key="item.id" > 
        <v-col cols="12">
          <v-layout class="px-2 py-2" v-show="item.ativo==true">
            <v-expansion-panels focused>
              <v-expansion-panel  class="py-1 blue-grey lighten-5">
                <v-expansion-panel-header disable-icon-rotate v-on:click="executaFuncao(item.id)">    
                  <div class="d-flex align-center">
                      <v-icon :color="item.iconColor">{{item.icon}}</v-icon><span :class="'ml-2 ' + item.textColor"> {{item.text}}</span>
                  </div>
                  <template v-slot:actions>
                    <v-icon :color="item.iconColor">mdi-arrow-right-circle-outline</v-icon>
                  </template>
                </v-expansion-panel-header>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>
        </v-col>
      </v-row>
    </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
  import color from '../config/colors'
  import mainService from '../services/mainService'
  import ProgressBar from '../lastec.components/lastec-progressbar.vue'
  import MessageBox from '../lastec.components/lastec-messagebox'
  import QuestionBox from '../lastec.components/lastec-questionbox'
  import Login from '../lastec.components/lastec-login'
  import proxyService from '../services/proxyService'

  export default {
    components: {
      ProgressBar, Login, MessageBox, QuestionBox
    },
    data() {
      return {
        tokenSistema:'ebe4c237-f13d-11eb-a054-566fe1410274',

        infoAlerta: {
          mensagem: 'Resre',
          cor: 'teal',
          icone: 'mdi-check'
        },
        tiposAlerta: [{cor: 'teal', icone: 'mdi-check'}, {cor: 'red lighten-2', icone: 'mdi-exclamation'}],

        estaLogando: false,
        estaPerguntando: false,
        ultimaOpcao: 0,

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
            text: 'Clique aqui e baixe os dados dos cidadãos atualizados para inicio da visitação ', 
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
          },
          {   
            id: 4, 
            textColor: color.textColor.menuHome, 
            text: 'Limpa os dados do dispositivo', 
            icon: 'mdi-delete-outline', 
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
      this.$store.commit('habilitaUserbar', true)
      this.$store.commit('init')
    },
    async mounted() {
      this.preparaTela()
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
      async cbAutenticado(param) {
        
        this.mostraTela = false;
        const usuarioGuid = param.usuarioGuid;
        const nomeUsuario = param.nomeUsuario;
        this.mensagemAguarde =  'Registrando o dispositivo na nuvem... Aguarde!'

        this.isLoading = true
        let erro = false
        const resposta = await mainService.autentica(usuarioGuid)        
        .catch (err => {
            this.mensagemAguarde =  ''
            this.isLoading = false
            this.mensagemErro =  'Autenticando API: ' + mainService.catchPadrao(err)
            erro = true
        });
        if (erro) {
          this.mensagemAguarde =  ''
          return
        }

        if (resposta.status != 200) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  resposta.message
          return;
        }

        const _dados = resposta.data
        if (!((_dados.token) && (_dados.cidadesAutorizadasDTO))) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32158] '
          return;
        }

        const _cidades = _dados.cidadesAutorizadasDTO
        if (_cidades.length == 0) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32157] '
          return
        }

        if (!((_cidades[0].cidadeId) && (_cidades[0].nomeCidade))) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32156] '
          return
        }

        const _param = {
          token: _dados.token,
          cidadeId: _cidades[0].cidadeId,
          nomeCidade: _cidades[0].nomeCidade,
          nomeUsuario: nomeUsuario,
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
        this.mostraTela = false;
        this.estaLogando = false;

        const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
        delay(1000).then(() => {
          this.mensagemAguarde =  ''
          if (this.ultimaOpcao == 1) {
            this.executaFuncao(this.ultimaOpcao)
          }
          else 
            this.$router.push('upload') 
        });
        this.mensagemAguarde =  ''
      },
      executaFuncao(id) {
        this.ultimaOpcao = id;
        switch (id) {
          case 1:
            if (!this.$store.getters.estaOnLine) {
              this.mensagemErro = 'É necessário acesso a internet para baixar os dados da nuvem'
              return ;
            }
            if (this.$store.getters.dadosBaixados) {
              this.mensagemErro = 'Já há dados baixados para esse dispositivo'
              return ;
            }
            if (!this.$store.getters.estaLogado) {
              this.estaLogando = true
              return ;
            }
            this.executaDownload();
            break;
          case 2:
            if (!this.$store.getters.dadosBaixados) {
              this.mensagemErro = 'É necessário baixar os dados da nuvem para esse dispositivo'
              return ;
            }
            this.$router.push('visita');
            break;
          case 3:
            if (!this.$store.getters.estaOnLine) {
              this.mensagemErro = 'É necessário acesso a internet para baixar os dados da nuvem'
              return ;
            }
            if (!this.$store.getters.dadosBaixados) {
              this.mensagemErro = 'É necessário baixar os dados da nuvem para esse dispositivo'
              return ;
            }
            if (!this.$store.getters.estaLogado) {
              this.estaLogando = true
              return ;
            }
            this.$router.push('upload') 
            break;
          case 4:
            const _numVisitasPendentes  = this.$store.getters.numeroVisitasPendentes;
            if (_numVisitasPendentes > 0) {
              this.mensagemErro = 'Há visitas ainda não atualizadas.'
              return ;
            }
            
            this.executaLimpeza();
            break;
          default:
            this.mensagemErro = `funcionalidade não implementada [id=${id}]`
        }
      },
      preparaTela() {
        this.mostraTela = false
                // 
        const _haCargas = this.$store.getters.dadosBaixados;
        if (_haCargas == false) {
          this.infoAlerta.mensagem = 'É necessário baixar os dados da nuvem para esse dispositivo';
          this.infoAlerta.icone = this.tiposAlerta[1].icone;
          this.infoAlerta.cor = this.tiposAlerta[1].cor;

          this.funcionalidades[0].ativo = true;
          this.funcionalidades[1].ativo = this.funcionalidades[2].ativo = this.funcionalidades[3].ativo = false;
        } else {
          const _numVisitas  = this.$store.getters.numeroVisitas;
          const _numVisitasPendentes  = this.$store.getters.numeroVisitasPendentes;

          if (_numVisitas === 0) {
            this.infoAlerta.mensagem = '';
            this.infoAlerta.mensagem = 'Dispositivo sem visitas cadastradas';
            this.infoAlerta.icone = this.tiposAlerta[1].icone;
            this.infoAlerta.cor = this.tiposAlerta[1].cor;
            this.funcionalidades[0].ativo = false;
            this.funcionalidades[1].ativo = this.funcionalidades[2].ativo = this.funcionalidades[3].ativo = true;
          }
          else if (_numVisitasPendentes === 0) {
            this.infoAlerta.mensagem = 'Dispositivo atualizado com a nuvem';
            this.infoAlerta.icone = this.tiposAlerta[1].icone;
            this.infoAlerta.cor = this.tiposAlerta[1].cor;
            this.funcionalidades[0].ativo = false; 
            this.funcionalidades[1].ativo = this.funcionalidades[2].ativo = this.funcionalidades[3].ativo = true;
          }
          else if (_numVisitasPendentes === 1) {
            this.infoAlerta.mensagem = 'Há somente uma visita ainda não atualizada na nuvem';
            this.infoAlerta.icone = this.tiposAlerta[0].icone;
            this.infoAlerta.cor = this.tiposAlerta[0].cor;
            this.funcionalidades[0].ativo = this.funcionalidades[3].ativo = false;
            this.funcionalidades[1].ativo = this.funcionalidades[2].ativo = true;
          } else {
            this.infoAlerta.mensagem = `Há ${_numVisitasPendentes} visitas não atualizadas na nuvem.`;
            this.infoAlerta.icone = this.tiposAlerta[0].icone;
            this.infoAlerta.cor = this.tiposAlerta[0].cor;

            this.funcionalidades[0].ativo = this.funcionalidades[3].ativo = false;
            this.funcionalidades[1].ativo = this.funcionalidades[2].ativo = true;
          }
        }

        this.mostraTela = true
      },
      async cbBotaoOk() {
        
        this.estaPerguntando = false;
        await this.baixaDados();
      },
      cbBotaoNo() {
        this.estaPerguntando = false;
      },
      executaDownload() {
        this.estaPerguntando = true;
      },
      executaLimpeza() {
        const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
        this.mostraTela = false        
        this.mensagemAguarde = 'Limpando os dados... Aguarde';
        this.$store.commit('limpaDados')
        delay(2000).then(() => {
          this.mensagemAguarde = '';
        });
        delay(2000).then(() => {
          this.mensagemSucesso = 'Dados limpos com sucesso';
          this.preparaTela()
          this.mostraTela = true
        });
      },
      async baixaDados() {
        let contador = 0;
        this.mostraTela = false        
        let erro = false;
        this.mensagemAguarde = 'Buscando os cidadãos da Micro Área... Aguarde';

        // Baixa as tabelas principais
        let resp = await proxyService.listaComorbidades()
          .catch (err => {this.mensagemAguarde = ''; erro = true; this.mensagemErro =  mainService.catchPadrao(err); });
        if (erro) {
          this.isLoading = false;
          return;
        }
        let comorbidades = resp.status == 200 ? resp.data : [];

        resp = await proxyService.listaSintomas()
        if (erro) {
          this.isLoading = false;
          return;
        }
        let sintomas = resp.status == 200 ? resp.data : [];

        resp = await proxyService.listaDoencas()
        if (erro) {
          this.isLoading = false;
          return;
        }
        let doencas = resp.status == 200 ? resp.data : [];

        resp = await proxyService.listaTipoMotivoVisita()
        if (erro) {
          this.isLoading = false;
          return;
        }
        let motivosVisita = resp.status == 200 ? resp.data : [];

        resp = await proxyService.listaTipoMotivoAnaliticoVisita()
        if (erro) {
          this.isLoading = false;
          return;
        }
        let motivosAnaliticoVisita = resp.status == 200 ? resp.data : [];

        resp = await proxyService.listaTipoAcaoVisita()
        if (erro) {
          this.isLoading = false;
          return;
        }
        let acoesVisita = resp.status == 200 ? resp.data : [];

        resp = await proxyService.listaTipoDesfechoVisita()
        if (erro) {
          this.isLoading = false;
          return;
        }
        let desfechosVisita = resp.status == 200 ? resp.data : [];

        // Lista todos os Pacientes da Micro Area
        resp = await proxyService.listaPacientesMicroArea(1, '')
          .catch (err => {this.mensagemAguarde = ''; erro = true; this.mensagemErro =  mainService.catchPadrao(err); });

        if (erro) {
          this.isLoading = false;
          return;
        }
        
        let dados = {
            acoesVisita: acoesVisita,
            bairros: [],
            cidadaos: [],
            comorbidades: comorbidades,
            desfechosVisita: desfechosVisita,
            doencas: doencas,
            logradouros: [],
            motivosVisita: motivosVisita,
            motivosAnaliticoVisita: motivosAnaliticoVisita,
            sintomas: sintomas,
        }
        
        // Para cada Paciente, busca os sintomas e comborbidades e salva
        const listaCidadaos = resp.status == 200 ? resp.data : []
        for(let i=0; i < listaCidadaos.length; ++i) {
          let cidadao = listaCidadaos[i];

          let infoCidadao = {
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
            sintomas: [],
            comorbidades: []
          };
          dados.cidadaos.push(cidadao);

          if (dados.bairros.findIndex(x => x.id==cidadao.bairroId) === -1) {
            dados.bairros.push({id: cidadao.bairroId, nome: cidadao.nomeBairro});
          }

          if (dados.logradouros.findIndex(x => x.id==cidadao.logradouroId) === -1) {
            dados.logradouros.push({id: cidadao.logradouroId, nome: cidadao.nomeLogradouro, bairroId: cidadao.bairroId});
          }

          dados.logradouros.sort((a, b) => {const a_ = a.nome.toUpperCase(); const b_ = b.nome.toUpperCase(); return a_ == b_ ? 0 : a_ > b_ ? 1 : -1});
          dados.bairros.sort((a, b) => {const a_ = a.nome.toUpperCase(); const b_ = b.nome.toUpperCase(); return a_ == b_ ? 0 : a_ > b_ ? 1 : -1});
        }
        // busca comorbidades e sintomas do paciente
        let resp2 = await proxyService.listaPacientesIndicadores(1);
        if (resp2.status == 200) {
          const listaIndicadores = resp2.data;
          let indice = -1;
          let contador=0;
          listaIndicadores.forEach(indicador => {
            indice = dados.cidadaos.findIndex((cidadao) => {return cidadao.id === indicador.pacienteId});
            if (indice >= 0) {
              dados.cidadaos[indice].sintomas = indicador.sintomas;
              dados.cidadaos[indice].comorbidades = indicador.comorbidades;
              dados.cidadaos[indice].doencas = indicador.doencas;
            }
          });
        }
        this.$store.commit('persisteDados', dados)
        
        this.mensagemAguarde = '';
        this.mensagemSucesso = listaCidadaos.length == 0 ? 'Nenhum registro baixado' : listaCidadaos.length == 1 ? 'Um registro baixado com sucesso' : `${listaCidadaos.length} registros baixados com sucesso`;
        this.preparaTela()
        this.mostraTela = true
      }
    }
  }
</script>

