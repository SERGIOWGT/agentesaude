import api from './apiService'
import store from '../store'

const signKey = 'd5f52a0e-f212-11eb-a054-566fe1410274';

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

export default {
    autentica:(usuarioGuid) => {return api.autentica(signKey, usuarioGuid)},
    listaPaciente: (pacienteId) => {
        const cidadao = store.getters.cidadao(pacienteId);
        return new Promise((resolve, reject) => {
            if (cidadao !== null) {
                resolve({status: 200, data: cidadao});
            } else {
                reject({status: 404, message: 'Paciente não encontrado'});
            }
        })
    },
    listaPacienteSintomas:(pacienteId) => {
        const _cidadao = store.getters.cidadao(pacienteId);
        return new Promise((resolve, reject) => {
            if (_cidadao !== null) {
                let _listaSintomas = [];
                if ((_cidadao.sintomas) && (_cidadao.sintomas.length > 0)) {
                    const _sintomasBase = store.getters.sintomas || [];
                    _cidadao.sintomas.forEach((el) => {
                        const _sintoma = _sintomasBase.find((x) => {return x.id === el.id});
                        if (_sintoma) {
                            _listaSintomas.push({id: el.id, nome: _sintoma.nome, dataInicio: el.dataInicio})
                        } else {
                            _listaSintomas.push({id: el.id, nome: 'Não identifidado', dataInicio: ''})
                        }
                    })
                }
                resolve({status: 200, data: _listaSintomas});
            } else {
                reject({status: 404, message: 'Paciente não encontrado'});
            }
        })
    },
    listaPacienteComorbidades:(pacienteId) => {
        const _cidadao = store.getters.cidadao(pacienteId);
        return new Promise((resolve, reject) => {
            if (_cidadao !== null) {
                let _listaComorbidades = [];
                if ((_cidadao.comorbidades) && (_cidadao.comorbidades.length > 0)) {
                    const _comorbidadesBase = store.getters.comorbidades || [];
                    _cidadao.comorbidades.forEach((el) => {
                        const _comorbidade = _comorbidadesBase.find((x) => {return x.id === el.id});
                        if (_comorbidade) {
                            _listaComorbidades.push({id: el.id, nome: _comorbidade.nome, dataInicio: el.dataInicio})
                        } else {
                            _listaComorbidades.push({id: el.id, nome: 'Não identifidado', dataInicio: ''})
                        }
                    })
                }
                resolve({status: 200, data: _listaComorbidades});                
            } else {
                reject({status: 404, message: 'Paciente não encontrado'});
            }
        })
    },
    listaPacienteUltimaVisita: (pacienteId) => {
        return []
    },
    listaTipoAcaoVisita:()  => {
        const _lista = store.getters.acoesVisita || [];
        return new Promise((resolve) => {
            resolve({status: 200, data: _lista});
        });
    },
    listaTipoDesfechoVisita:()  => {
        const _lista = store.getters.desfechosVisita || [];
        return new Promise((resolve) => {
            resolve({status: 200, data: _lista});
        });
    },
    listaTipoMotivoVisita:()  => {
        const _lista = store.getters.motivosVisita || [];
        return new Promise((resolve) => {
            resolve({status: 200, data: _lista});
        });
    },
    listaTipoMotivoAnaliticoVisita:(id) => {
        let _lista = store.getters.motivosAnaliticosVisita || [];
        if (id) 
            _lista = _lista.filter((x) => {return x.tipoMotivoVisitaId === id})

        return new Promise((resolve) => {
            resolve({status: 200, data: _lista});
        });

    },
    // ROTINAS DE SALVAMENTO
    async salvaVisita (id, params){
        const _tempoId = uuidv4();
        const _dados = {
            id: _tempoId,
            atualizado: false,
            dados: params
        }
        store.commit('salvaVisita', _dados)
        return new Promise((resolve) => {
            resolve({status: 200, data: ''});                
        })
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

