import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    estaLogado: false,
    estaOnLine: true,
    userBarAtivo: false,
    infosUsuario: {
        email: '',
        ssoToken: '',
        nomeUsuario: 'Nome Usuario',
        usuarioId: '',
        usuarioGuid: '',
        apiToken: '',
        autenticado: false,
        cidadePadrao: {
            id: 0,
            nome: ''
        },
        unidadeSaudePadrao: {
            id: 0,
            nome: ''
        },
        bairroPadrao: {
            id: 0,
            nome: ''
        },
        logradouroPadrao: {
            id: 0,
            nome: ''
        },
        microAreaPadrao: {
            id: 0,
            nome: ''
        }
    },

  },
  mutations: {
    autenticaApi (state, obj) {
        state.infosUsuario.autenticado = obj.autenticado
        state.infosUsuario.apiToken = obj.token
        state.infosUsuario.cidadePadrao.id = obj.cidadeId
        state.infosUsuario.cidadePadrao.nome = obj.nomeCidade
        state.infosUsuario.unidadeSaudePadrao.id = obj.unidadeSaudeId
        state.infosUsuario.unidadeSaudePadrao.nome = obj.nomeUnidadeSaude
        state.infosUsuario.bairroPadrao.id = obj.bairroId
        state.infosUsuario.bairroPadrao.nome = obj.nomeBairro
        state.infosUsuario.microAreaPadrao.id = obj.microAreaId
        state.infosUsuario.microAreaPadrao.nome = obj.nomeMicroArea
        state.infosUsuario.logradouroPadrao.id = obj.logradouroId
        state.infosUsuario.logradouroPadrao.nome = obj.nomeLogradouro
        state.estaLogado = true
    },
    finalizaLogin (state, obj) {
        state.estaLogado = obj
    },
    habilitaUserbar (state, obj) {
      state.userBarAtivo = obj
    },
    setaStatusRede (state, status) {
      state.estaOnLine = status
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    apiToken: state => state.infosUsuario.apiToken,
    bairroPadrao: state => state.infosUsuario.bairroPadrao,
    logradouroPadrao : state => state.infosUsuario.logradouroPadrao,
    cidadePadrao: state => state.infosUsuario.cidadePadrao,
    estaLogado: state => state.estaLogado,
    estaOnLine: state => state.estaOnLine,
    nomeUsuario: state => state.infosUsuario.nomeUsuario,
    microAreaPadrao: state => state.infosUsuario.microAreaPadrao,
    unidadeSaudePadrao: state => state.infosUsuario.unidadeSaudePadrao,
    userBarAtivo: state => state.userBarAtivo && state.estaLogado,
  }
})
export default store;
