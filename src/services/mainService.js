import sso from './ssoService'
import api from './apiService'
import store from '../store'

export default {

    // Rotinas da Api
    listaBairros () {
        const nomeCache = `bairros__`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }
    },
    async listaComorbidades() {
        const nomeCache = `tipoComorbidades__`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }

        console.log(`${nomeCache} from server`)
        const ret = await api.listaComorbidades(store.getters.apiToken);
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );
         return ret;
    },
    async listaDoencas() {
        const nomeCache = `tipoDoencas__`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }

        console.log(`${nomeCache} from server`)
        const ret = await api.listaDoencas(store.getters.apiToken);
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );

        return ret;
    },
    listaLogradouros (bairroId) {
        const nomeCache = `logradouros__`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let data = JSON.parse(localStorage.getItem(nomeCache) || '[]');

                let resp = {status: 200, data: data.filter(x => {return x.bairroId == bairroId})}
                resolve(resp);
            });
        }
    },
    listaPacientesMicroArea (microAreaId) { return api.listaPacientesMicroArea(store.getters.apiToken, microAreaId); },
    listaPermissionamento: (token, usuarioId, sistemaId) => {return sso.listaPermissionamento(token, usuarioId, sistemaId);},
    listaPacientes () {
        
    },
    async listaSintomas() {
        const nomeCache = `tipoSintomas__`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }

        console.log(`${nomeCache} from server`)
        const ret = await api.listaSintomas(store.getters.apiToken);
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );
       
        return ret;
    },
    async listaTipoAcaoVisita() {
        const nomeCache = `tipoAcaoVisita__`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }

        console.log(`${nomeCache} from server`)
        const ret = await api.listaTipoAcaoVisita( store.getters.apiToken);
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );
        return ret;
    },
    async listaTipoMotivoVisita (id) {
        const nomeCache = `tipoMotivoVisita__${id || ''}`;
        
        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }
        console.log(`${nomeCache} from server`)
        const ret = await api.listaTipoMotivoVisita( store.getters.apiToken, id)
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );
        return ret;

    },
    async listaTipoMotivoAnaliticoVisita (id ) {
        const nomeCache = `tipoMotivoAnaliticoVisita__${id || ''}`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }
        console.log(`${nomeCache} from server`)
        const ret = await api.listaTipoMotivoAnaliticoVisita( store.getters.apiToken, id);
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );
        return ret;

    },
    async listaTipoSolucaoVisita(cidadeId) {
        const nomeCache = `tipoSolucaoVisita__${cidadeId || ''}`;

        if (localStorage.getItem(nomeCache)) {
            console.log(`${nomeCache} from cache`)
            return new Promise(function(resolve) {
                let resp = {status: 200, data: JSON.parse(localStorage.getItem(nomeCache) || '[]')}
                resolve(resp);
            });
        }

        console.log(`${nomeCache} from server`)
        const ret = await api.listaTipoSolucaoVisita( store.getters.apiToken, cidadeId);
        localStorage.setItem(nomeCache, JSON.stringify(ret.status == 200 ? ret.data : []) );
        return ret;
    },
    async setaPermissionamento (permissao) {
        store.commit('setaPermissao', permissao)
    },
    async temAcesso (funcionalidadeId, tipoFuncionalidadeId, acao) {
        var _busca = function (linha) {
            var _retorno = false;
            
            if ((linha.funcionalidadeId === funcionalidadeId) && 
                (linha.tipoFuncionalidadeId === tipoFuncionalidadeId)) {

                //Cadastro
                if (linha.tipoFuncionalidadeId == 1)
                { 
                    switch (acao)
                    {
                        case 'C':
                            _retorno = (linha.consulta === 'S' ? true : false);
                            break;
                        case 'A':
                            _retorno = (linha.alteracao === 'S' ? true : false);
                            break;
                        case 'I':
                            _retorno = (linha.inclusao === 'S' ? true : false);
                            break;
                        case 'E':
                            _retorno = (linha.exclusao === 'S' ? true : false);
                            break;
                        default:
                            _retorno = false;
                    }
                } else 
                    _retorno = true;
            }
            return _retorno
        }

        const _array = store.getters.permissionamento
        var _item = _array.find(_busca)
        return !(_item == null) 
    },
    async autentica (usuarioGuid) {
        const _signKey = 'd5f52a0e-f212-11eb-a054-566fe1410274'
        return api.autentica(_signKey, usuarioGuid);
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