import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    baseURL: process.env.VUE_APP_API_SERVICE_URL
})

http.interceptors.request.use(function (config) {
    const d = new Date().toUTCString();
    config.headers.dataEnvio =  d
    return config;
  });
http.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    var _erros = ''
    if (error.response) {
        if (error.response.status == 400) {
            _erros = error.response.data
        } else if (error.response.status == 401) {
             _erros = {erros: [{
                'chave': '000.0401',
                'mensagem': 'Url não autorizada'
            }]}
    
        } else if (error.response.status == 404) {
            _erros = {erros: [{
                'chave': '000.0404',
                'mensagem': 'Url não encontrada'
            }]}

        } else {
            _erros = {erros: [{
                'chave': '000.0000',
                'mensagem': error
            }]}
        }
    } else {
        _erros = {erros: [{
            'chave': '000.0000',
            'mensagem': error
        }]}
    }

    return Promise.reject(_erros)
})
export default {
    autentica: (signKey, usuarioGuid) => {
        const _url = `Autenticacao/Autentica?signkey=${signKey}&userKey=${usuarioGuid}`
        return http.get(_url)
    },
    listaComorbidades: (token) => {
        return http.get('tipoComorbidades', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaDoencas: (token) => {
        return http.get('tipoDoencas', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacientesIndicadores: (token, microAreaId) => {
        const _url = `pacienteIndicadores/ListaIndicadores/?microAreaId=${microAreaId}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacientesMicroArea(token, microAreaId) {
        const url = `pacientes/listaCompleta?ordenacao=0`

        const paramPost = {
            bairroId: 0,
            cartaoSUS: '',
            celular: '',
            celular2: '',
            cidadeId: 0,
            complementoEndereco: '',
            CPF: '',
            dataNascimento: '',
            dataVisitaInicio: '',
            dataVisitaFim: '',
            eMail: '',

            id: 0,
            logradouroId: 0,
            microAreaId: microAreaId,
            nome: '',
            nomeMae: '',
            numeroEndereco: '',
            numeroMaxLinhas: 1000,
            
            RG: '',
            sexo: '',

            comorbidades: [],
            sintomas: [],
            doencas: [],

            unidadeSaudeId: 0,
            telefoneContato: '',
            tipoEstadoSaudeId: 0,
            tipoMotivoVisitaAnaliticoId: 0,
        }

        return http.post(url, paramPost, {headers: {'Authorization': `bearer ${token}`} })
    },
    listaPacienteUltimaVisita (token, pacienteId) {
        const url = `pacienteVisitas/ListaUltimaVisita?pacienteId=${pacienteId}`
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacienteVisita (token, id) {
        const url = `pacienteVisitas/ListaVisita?id=${id}`
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaPacienteVisitas: (token, param) => {
        let url = `pacienteVisitas/ListaCompleta`
        
        let paramPost = {
            id: 0,
            pacienteId: 0,
            nomepaciente: null,
            tipoMotivoVisitaAnaliticoId: 0,
            tipoAcaoVisitaId: 0,
            TipoSolucaoVisitaId: 0,
            unidadeSaudeId: 0,
            microAreaId: 0,
            cidadeId: 0,
            bairroId: 0,
            logradouroId: 0,
            numeroEndereco: null,
            complementoEndereco: null,
            CPF: null,
            cartaoSUS: null,
            sexo: null,
            tipoEstadoSaudeId: 0,
            dataNascimento: null,
            dataVisitaInicio: null,
            dataVisitaFim: null,
            dataSolucaoInicio: null,
            dataSolucaoFim: null,
            visitaBaixada: null,
            visitaRealizada: null,
            numeroMaxLinhas: 50,
            sintomas: [],
            comorbidades: [],
            doencas: [],
        }
        if (param.id)  
            paramPost.id = param.id
        else {
            if (param.pacienteId) 
                paramPost.pacienteId = param.pacienteId

            if (param.nomepaciente) 
                paramPost.nomepaciente = param.nomepaciente

            if (param.tipoMotivoVisitaAnaliticoId) 
                paramPost.tipoMotivoVisitaAnaliticoId = param.tipoMotivoVisitaAnaliticoId

            if (param.tipoAcaoVisitaId) 
                paramPost.tipoAcaoVisitaId = param.tipoAcaoVisitaId

            if (param.TipoSolucaoVisitaId) 
                paramPost.TipoSolucaoVisitaId = param.TipoSolucaoVisitaId

            if (param.unidadeSaudeId) 
                paramPost.unidadeSaudeId = param.unidadeSaudeId

            if (param.microAreaId) 
                paramPost.microAreaId = param.microAreaId

            if (param.cidadeId) 
                paramPost.cidadeId = param.cidadeId

            if (param.bairroId) 
                paramPost.bairroId = param.bairroId

            if (param.logradouroId) 
                paramPost.logradouroId = param.logradouroId

            if (param.numeroEndereco) 
                paramPost.numeroEndereco = param.numeroEndereco

            if (param.complementoEndereco) 
                paramPost.complementoEndereco = param.complementoEndereco

            if (param.cpf) 
                paramPost.CPF = param.cpf

            if (param.cartaoSUS) 
                paramPost.cartaoSUS = param.cartaoSUS

            if (param.sexo) 
                paramPost.sexo = param.sexo

            if (param.tipoEstadoSaudeId) 
                paramPost.tipoEstadoSaudeId = param.tipoEstadoSaudeId
    
            if (param.dataNascimento)
                paramPost.dataNascimento = param.dataNascimento
    
            if (param.dataVisitaInicio)
                paramPost.dataVisitaInicio = param.dataVisitaInicio
            
            if (param.dataVisitaFim)
                paramPost.dataVisitaFim = param.dataVisitaFim
            
            if (param.dataSolucaoInicio)
                paramPost.dataSolucaoInicio = param.dataSolucaoInicio
            
            if (param.dataSolucaoFim)
                paramPost.dataSolucaoFim = param.dataSolucaoFim

            if (param.visitaRealizada)
                paramPost.visitaRealizada = param.visitaRealizada
    
            if (param.visitaBaixada)
                    paramPost.visitaBaixada = param.visitaBaixada
    
            if (param.sintomas) {
                paramPost.sintomas = param.sintomas
            }
            if (param.comorbidades) {
                paramPost.comorbidades = param.comorbidades
            }
            if (param.doencas) {
                paramPost.doencas = param.doencas
            }
        }
        return http.post(url, paramPost, {headers: {'Authorization': `bearer ${token}`} })
    },
    listaPerfisSeguranca (token) {
        const url = 'perfisSeguranca/listaCompleta'
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaSintomas (token) {
        const url = 'tipoSintomas'
        return http.get(url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoDesfechoVisita: (token) => {
        return http.get('tipoDesfechoVisita', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoAcaoVisita: (token) => {
        return http.get('tipoAcaoVisitas', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoMotivoVisita: (token, id) => {
        let _url = `TipoMotivoVisitas`
        if (id)
            _url += `?id=${id}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoMotivoAnaliticoVisita: (token, tipoMotivoVisitaId) => {
        let _url = `TipoMotivoVisitaAnaliticos`
        if (tipoMotivoVisitaId)
            _url += `?tipoMotivoVisitaId=${tipoMotivoVisitaId}`

        console.log('listaTipoMotivoAnaliticoVisita', _url)
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaTipoSolucaoVisita: (token, cidadeId) => {
        return http.get(`TipoSolucaoVisitas?cidadeId=${cidadeId}`, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaUnidadesSaude: (token, cidadeId, id, parteNome) => {
        let _url = `unidadeSaudes?cidadeId=${cidadeId}`

        if (id)
            _url += `&id=${id}`

        if (parteNome)
            _url += `&nome=${parteNome}`

        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaUsuarios: (token, cidadeId) => {
        const _url = `Usuarios/ListaCompleta?cidadeId=${cidadeId}`
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    salvaVisita: (token, id, params) => {
        var _url = (id == 0) ? 'pacienteVisitas' : `pacienteVisitas/${id}`
        params.id = id
        
        return (id == 0) ?
                    http.post(_url, params, { headers: { 'Authorization': `bearer ${token}`}}) 
                        : http.put(_url, params, { headers: { 'Authorization': `bearer ${token}`}});
    },
}