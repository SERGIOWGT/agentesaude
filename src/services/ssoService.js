import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    //baseURL: 'https://lastecweb01.azurewebsites.net/api/'
    baseURL: 'https://sso.painelsaude.com.br/api/'
    //baseURL: 'http://localhost:56486/api/'
})

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
    adicionaUsuarioGrupo: (token, usuarioId, grupoAcessoId) => {
        const param = {
            usuarioIdGrupo: 1,
            grupoAcessoId: grupoAcessoId,
            usuarioId: usuarioId
        }
        return  http.post('permissionamentos', param, { headers: { 'Authorization': `bearer ${token}`}})
    },
    ativaUsuario: (token, id) => {
        const _url =  `v1/usuarios/ativa/${id}?usuarioId=1`
        return http.put(_url, null, { headers: { 'Authorization': `bearer ${token}`}});
    },

    listaPermissionamento: (token, usuarioId, sistemaId) => {
        const _url = `v1/Usuarios/${usuarioId}/ListaPermissionamento?sistemaId=${sistemaId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    async listaConfiguracao (sistemaToken) {
        const _url = `login/listaConfiguracao?tokenSistema=${sistemaToken}`;
        return http.get(_url);
    },
    autentica: (sistemaId, email, senha) => {
        const params = {
            'tokenSistema': sistemaId,
            'chave': email,
            'senha': senha,
            'comPermissoes': true
        }
        return http.put('login/autentica', params)
    },
    inativaUsuario: (token, id) => {
        const _url =  `v1/usuarios/inativa/${id}?usuarioId=1`
        return http.put(_url, null, { headers: { 'Authorization': `bearer ${token}`}});
    },
    listaUsuarios: (token, plataformaId) => {
        const _url = `v1/usuarios/ListaBasico?plataformaId=${plataformaId}`;

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        });
    },
    salvaUsuario: (token, id, param) => {
        let url = (id == 0) ? 'v1/usuarios' : `v1/usuarios/${id}`
        url += '/ComGrupo'

        return (id == 0) ?
        http.post(url, param, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(url, param, { headers: { 'Authorization': `bearer ${token}`}});
    },
  
    trocaSenha: (signKey, chave, senha, novaSenha) => {
        const params = {
            'tokenSistema': signKey,
            'chave': chave,
            'senhaAtual': senha,
            'senhaNova': novaSenha
        }
        return http.put('login/TrocaSenhaV2', params)
    },

    esqueceuSenha: (signKey, chave) => {
        const params = {
            'tokenSistema': signKey,
            'chave': chave
        }
        return http.put('login/EsqueciSenha', params)
    },

}