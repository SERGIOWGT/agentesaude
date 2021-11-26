export default {
    Basicas: {
      obrigatorio() {
          return v => !!v || 'Campo obrigatório'
      },
      obrigatorioCondicional(val) {
        if (val == false)
          return v => !v || 'xxx'
        else
          return v => !!v || 'Campo obrigatório'
      },
      max(tamanhoMaximo){
        return v => (v || '').length <= tamanhoMaximo || `Até ${tamanhoMaximo} caracteres`;
      },
      min(tamanhoMinimo){
        return v => (v || '').length >= tamanhoMinimo || `Pelo menos ${tamanhoMinimo} caracteres`;
      },
    },
    Data: {
      valida(obrigatorio) {
        // eslint-disable-next-line no-useless-escape
        if (obrigatorio)
          return v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Data inválida'  // eslint-disable-line
        else
          return v => !v || /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Data inválida'  // eslint-disable-line
      }
    },
    Cpf: {
      valido(obrigatorio) {
        //return v => /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/.test(v) || 'Use o formato (xxx.xxx.xxx-xx)'  // eslint-disable-line
        if (obrigatorio)
          return v => /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[\-]?[0-9]{2}$/.test(v) || 'Cpf é obrigatório'  // eslint-disable-line
        else
          return v => !v || /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[\-]?[0-9]{2}$/.test(v) || 'Cpf inválido'  // eslint-disable-line
      }
    }, 
    NumeroSus: {
      valido(obrigatorio) {
        if (obrigatorio)
            return v =>  /^[0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/.test(v) || 'Campo com 18 números (999 9999 9999 9999)'  // eslint-disable-line
        else 
            return v =>  !v || /^[0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/.test(v) || 'Nùmero do Cartão do SUS inválido'  // eslint-disable-line
      }
    }, 
    Celular: {
        valido(obrigatorio) {
            if (obrigatorio)
                //return v =>  /^[1-9]{2} (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
                return v =>  /^[1-9]{2}[ ]?(?:[2-8]|9[1-9])[0-9]{3}[\-]?[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
            else 
                //return v =>  !v || /^[1-9]{2} (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
                return v =>  !v || /^[1-9]{2}[ ]?(?:[2-8]|9[1-9])[0-9]{3}[\-]?[0-9]{4}$/.test(v) || 'Celular inválido (99 ?9999-9999)'  // eslint-disable-line
        }
    },  
    Email: {
      valido(obrigatorio) {
        if (obrigatorio)
          return v =>  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email inválido'  // eslint-disable-line
        else 
          return v =>  !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email inválido'  // eslint-disable-line
      },
    },
    vetorObrigatorio: [
        v => !!v || 'Campo obrigatório',
    ]
}