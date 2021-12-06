import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const enumNomeTabela = {
  acao: 'db__acoes',
  bairro: 'db__bairros',
  cidadao: 'db__cidadaos',
  comorbidade: 'db__comorbidades',
  config: 'db__config',
  desfechoVisita: 'db__desfechosVisita',
  doenca: 'db__doencas',
  logradouro: 'db__logradouros',
  motivoVisita: 'db__motivosVisita',
  motivoAnaliticoVisita: 'db__motivosAnaliticoVisita',
  sintoma: 'db__sintomas',
  visita: 'db__visita',
  usuario: 'db__usuario'
}

const store = new Vuex.Store({
  state: {
    statusApp: {
      dadosBaixados: false,
      estaLogado: false,
      estaOnLine: true,
      userBarAtivo: false,
      autenticado: false,
      apiToken: ''
    },
    db: {
      tbConfig: {
        dataCarga: '',
        usuarioId: '',
        email: '',
        microAreaId: '',
        nomeMicroArea: '',
        versao: ''
      },
      tbUsuario: {
        email: '',
        ssoToken: '',
        nomeUsuario: '',
        usuarioId: '',
        usuarioGuid: '',
        dataLogin: new Date(),
        cidadePadrao: {
            id: 0,
            nome: ''
        },
        unidadeSaudePadrao: {
            id: 0,
            nome: ''
        },
        microAreaPadrao: {
            id: 0,
            nome: ''
        }
      },
      tbAcoes: [],
      tbBairros: [],
      tbCidadaos: [],
      tbComorbidades: [],
      tbDoencas: [],
      tbDesfechosVisita: [],
      tbLogradouros: [],
      tbMotivosVisita: [],
      tbMotivosAnaliticosVisita: [],
      tbSintomas: [],
      tbVisitas: []
    },
  },
  mutations: {
    init(state) {
      if(!localStorage.getItem(enumNomeTabela.config)) {
        state.statusApp.dadosBaixados = false
        return;
      }
      state.statusApp.dadosBaixados = true;
      state.db.tbConfig = JSON.parse(localStorage.getItem(enumNomeTabela.config) ||'[]');

      if(localStorage.getItem(enumNomeTabela.usuario)) {
        state.db.tbUsuario = JSON.parse(localStorage.getItem(enumNomeTabela.usuario) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.comorbidade)) {
        state.db.tbComorbidades = JSON.parse(localStorage.getItem(enumNomeTabela.comorbidade) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.doenca)) {
        state.db.tbDoencas = JSON.parse(localStorage.getItem(enumNomeTabela.doenca) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.sintoma)) {
        state.db.tbSintomas = JSON.parse(localStorage.getItem(enumNomeTabela.sintoma) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.bairro)) {
        state.db.tbBairros = JSON.parse(localStorage.getItem(enumNomeTabela.bairro) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.logradouro)) {
        state.db.tbLogradouros = JSON.parse(localStorage.getItem(enumNomeTabela.logradouro) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.cidadao)) {
        state.db.tbCidadaos = JSON.parse(localStorage.getItem(enumNomeTabela.cidadao) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.motivoVisita)) {
        state.db.tbMotivosVisita = JSON.parse(localStorage.getItem(enumNomeTabela.motivoVisita) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.motivoAnaliticoVisita)) {
        state.db.tbMotivosAnaliticosVisita = JSON.parse(localStorage.getItem(enumNomeTabela.motivoAnaliticoVisita) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.acao)) {
        state.db.tbAcoes = JSON.parse(localStorage.getItem(enumNomeTabela.acao) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.visita)) {
        state.db.tbVisitas = JSON.parse(localStorage.getItem(enumNomeTabela.visita) ||'[]');
      }
      if(localStorage.getItem(enumNomeTabela.desfechoVisita)) {
        state.db.tbDesfechosVisita = JSON.parse(localStorage.getItem(enumNomeTabela.desfechoVisita) ||'[]');
      }
    },
    autenticaApi (state, obj) {
        state.statusApp.autenticado = obj.autenticado;
        state.statusApp.estaLogado = true;
        
        state.statusApp.apiToken = obj.token

        state.db.tbUsuario.nomeUsuario = obj.nomeUsuario
        state.db.tbUsuario.cidadePadrao.id = obj.cidadeId
        state.db.tbUsuario.cidadePadrao.nome = obj.nomeCidade
        state.db.tbUsuario.unidadeSaudePadrao.id = obj.unidadeSaudeId
        state.db.tbUsuario.unidadeSaudePadrao.nome = obj.nomeUnidadeSaude
        state.db.tbUsuario.microAreaPadrao.id = obj.microAreaId
        state.db.tbUsuario.microAreaPadrao.nome = obj.nomeMicroArea

        localStorage.setItem(enumNomeTabela.usuario, JSON.stringify(state.db.tbUsuario));
    },
    habilitaUserbar (state, obj) {
      state.statusApp.userBarAtivo = obj
    },
    setaStatusRede (state, status) {
      state.statusApp.estaOnLine = status
    },
    persisteDados(state, dados) {
      state.db.tbAcoes = dados.acoesVisita;
      state.db.tbBairros = dados.bairros;
      state.db.tbCidadaos = dados.cidadaos;
      state.db.tbComorbidades = dados.comorbidades;
      state.db.tbDoencas = dados.doencas;
      state.db.tbLogradouros = dados.logradouros;
      state.db.tbMotivosVisita = dados.motivosVisita;
      state.db.tbMotivosAnaliticosVisita = dados.motivosAnaliticoVisita;
      state.db.tbDesfechosVisita = dados.desfechosVisita;
      state.db.tbSintomas = dados.sintomas;

      state.db.tbConfig.dataCarga = new Date();
      state.db.tbConfig.usuarioId = state.db.tbUsuario.usuarioId;
      state.db.tbConfig.email = state.db.tbUsuario.email;
      state.db.tbConfig.microAreaId = state.db.tbUsuario.microAreaPadrao.id;
      state.db.tbConfig.nomeMicroArea = state.db.tbUsuario.microAreaPadrao.nome;
      state.db.tbConfig.versao = 'v1.0'
     
      localStorage.setItem(enumNomeTabela.acao, JSON.stringify(state.db.tbAcoes));
      localStorage.setItem(enumNomeTabela.bairro, JSON.stringify(dados.bairros));
      localStorage.setItem(enumNomeTabela.cidadao, JSON.stringify(dados.cidadaos));
      localStorage.setItem(enumNomeTabela.comorbidade, JSON.stringify(dados.comorbidades));
      localStorage.setItem(enumNomeTabela.config, JSON.stringify(state.db.tbConfig));
      localStorage.setItem(enumNomeTabela.desfechoVisita, JSON.stringify(dados.desfechosVisita));
      localStorage.setItem(enumNomeTabela.doenca, JSON.stringify(dados.doencas));
      localStorage.setItem(enumNomeTabela.logradouro, JSON.stringify(dados.logradouros));
      localStorage.setItem(enumNomeTabela.motivoVisita, JSON.stringify(state.db.tbMotivosVisita));
      localStorage.setItem(enumNomeTabela.motivoAnaliticoVisita, JSON.stringify(state.db.tbMotivosAnaliticosVisita));
      localStorage.setItem(enumNomeTabela.sintoma, JSON.stringify(dados.sintomas));
      state.statusApp.dadosBaixados = true;
    },
    salvaVisita(state, dados) {
      state.db.tbVisitas = JSON.parse(localStorage.getItem(enumNomeTabela.visita) || '[]');
      state.db.tbVisitas.push(dados);
      localStorage.setItem(enumNomeTabela.visita, JSON.stringify(state.db.tbVisitas));

      // Salva data da última visita no paciente
      console.log(dados)
      let cidadao = state.db.tbCidadaos.find((x) => {return x.id === dados.dados.pacienteId});
      console.log(cidadao)
      if (cidadao) {
        console.log(cidadao.dataUltimaVisita, dados.dados.dataVisita)
        cidadao.dataUltimaVisita = dados.dados.dataVisita
        localStorage.setItem(enumNomeTabela.cidadao, JSON.stringify(state.db.tbCidadaos));
      }
    },
    visitaUploaded(state, dados) {
      if (dados.guid) {
        console.log(dados.guid)
        let visita = state.db.tbVisitas.find((x) => {return x.id === dados.guid});

        if (visita) {
          visita.atualizado = true
          localStorage.setItem(enumNomeTabela.visita, JSON.stringify(state.db.tbVisitas));
        }
       }
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    estaLogado: state => state.statusApp.estaLogado,
    estaOnLine: state => state.statusApp.estaOnLine,
    dadosBaixados: state => state.statusApp.dadosBaixados,

    apiToken: state => state.statusApp.apiToken,
    cidadePadrao: state => state.db.tbUsuario.cidadePadrao,
    
    nomeUsuario: state => state.db.tbUsuario.nomeUsuario,
    microAreaPadrao: state => state.db.tbUsuario.microAreaPadrao,
    unidadeSaudePadrao: state => state.db.tbUsuario.unidadeSaudePadrao,
    userBarAtivo: state => state.statusApp.userBarAtivo && state.statusApp.estaLogado,

    //
    acoesVisita: state => state.db.tbAcoes,
    bairros: state => state.db.tbBairros,
    cidadao: (state) => (id) => {return state.db.tbCidadaos.find((x) => {return x.id === id});},
    cidadaos: state => state.db.tbCidadaos,
    comorbidades: state => state.db.tbComorbidades,
    desfechosVisitas: state => state.db.tbDesfechosVisita,
    doencas: state => state.db.tbDoencas,
    logradouros: state => state.db.tbLogradouros,
    motivosVisita: state => state.db.tbMotivosVisita,
    motivosAnaliticosVisita: state => state.db.tbMotivosAnaliticosVisita,
    sintomas: state => state.db.tbSintomas,
    visita: (state) => (id) => {return state.db.tbVisitas.find((x) => {return x.id === id});},
    visitas: state => state.db.tbVisitas,
  }
})
//store.dispatch("init");
export default store;
