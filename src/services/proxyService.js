import api from './apiService'
import store from '../store'

export default {
    listaComorbidades:() => {return api.listaComorbidades(store.getters.apiToken)},
    listaDoencas:() => {return api.listaDoencas(store.getters.apiToken)},
    listaPacientesMicroArea:(microAreaId) => {return api.listaPacientesMicroArea(store.getters.apiToken, microAreaId)},
    listaPacientesIndicadores:(microAreaId) => {return api.listaPacientesIndicadores(store.getters.apiToken, microAreaId)},
    listaSintomas:() => {return api.listaSintomas(store.getters.apiToken)},
    listaTipoAcaoVisita:()  => {return api.listaTipoAcaoVisita( store.getters.apiToken)},
    listaTipoAcaoVisita:()  => {return api.listaTipoAcaoVisita( store.getters.apiToken)},
    listaTipoDesfechoVisita:()  => {return api.listaTipoDesfechoVisita( store.getters.apiToken)},
    listaTipoMotivoVisita:()  => {return api.listaTipoMotivoVisita( store.getters.apiToken)},
    listaTipoMotivoAnaliticoVisita:() => {return api.listaTipoMotivoAnaliticoVisita( store.getters.apiToken, null)},

    async salvaVisita (id, params){
        var _token = store.getters.apiToken;
        return api.salvaVisita(_token, id, params);
    },

    catchPadrao: (response) => {
        let mensagemErro = ''
        if (response) {
            if (response.erros) {
                let _mensagem = ""
                response.erros.forEach(el => {
                    _mensagem += el.mensagem
                });
                mensagemErro=_mensagem
            }
            else
                mensagemErro=response.message

        } else {
            mensagemErro=response.message
        }
        return mensagemErro;
    }
}

