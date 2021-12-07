import {data2String} from '../bibliotecas/formataValores'
import mainService from '../services/mainService'
export default {
    data() {
    },
    async salvaSintomas(pacienteId, sintomas, mostraMensagem, mostraErro, callback){ 
        let _sintomas = []
        const _dataAux = new Date()
        const _dataHoje = new Date(_dataAux.getFullYear(),_dataAux.getMonth()+1,_dataAux.getDate())
        let _dataInicio = _dataHoje

        for (let i = 0;  i < sintomas.length; i++) {
            if (sintomas[i].selecionado) {
                let item = {}

                _dataInicio = _dataInicio.setDate(_dataHoje.getDate() - sintomas[i].dias)

                item.id = sintomas[i].id
                item.dataInicio = data2String(_dataInicio, 'SQL')
                
                _sintomas.push (item)
            }
        }
        // Não há sintomas
        if (_sintomas.lenght == 0) {
            mostraErro('Nenhum sintoma foi selecionado. [erroId=01.001.001]')
            return
        } 
        mostraMensagem("Aguarde... Salvando os Sintomas")
        await mainService.salvaPacienteSintomas(pacienteId, _sintomas)
            .then(resposta => {
                    mostraMensagem('')
                    if (resposta.status == 200) {
                        callback()
                    } else {
                        mostraMensagem(resposta.message)
                    }
                })
            .catch(response => {
                this.mensagemAguarde = ''; mainService.catchPadrao(response)}) 
    },
    async listaPacientePorNome(cidadeId, parteNome) {
        const retorno = await mainService.listaPacientesPorNome(cidadeId, parteNome)
        return retorno
    }
}
