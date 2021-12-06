import {data2String, string2Data} from '../bibliotecas/formataValores'

export function ordenaComorbidades(todasComorbidades, ComorbidadesCidadao) {
    let retorno=[]
    if (ComorbidadesCidadao == null) {
        todasComorbidades.forEach((linha ) => {
            const item = {
                id: linha.id, 
                nome: linha.nome,
                selecionado: false
            }
            retorno.push(item)
        })
        return retorno
    }
    let aux =[]
    ComorbidadesCidadao.forEach(linha => {
        const index = todasComorbidades.findIndex( el => el.id === linha.id );
        if (index != -1) {
            aux.push(index)
        }
        
    });
    aux.sort((a, b) => {return a - b;});

    
    aux.forEach((linha) => {
        const item = {
            id: todasComorbidades[linha].id, 
            nome: todasComorbidades[linha].nome,
            selecionado: true
        }
        retorno.push(item)
    })

    todasComorbidades.forEach((linha, index) => {
        if (!aux.includes(index)) {
            const item = {
                id: linha.id, 
                nome: linha.nome,
                selecionado: false
            }
            retorno.push(item)
        }
    })
    return retorno
}
    
export function ordenaSintomas(todosSintomas, sintomasCidadao){
    let retorno=[]
    if (sintomasCidadao == null) {
        todosSintomas.forEach((linha) => {
            const item = {
                id: linha.id, 
                nome: linha.nome,
                dias: 0,
                selecionado: false
            }
            retorno.push(item)
        })
        return retorno
    }

    let aux =[]
    sintomasCidadao.forEach(linha => {
        const index = todosSintomas.findIndex( el => el.id === linha.id );
        if (index != -1) {
            aux.push(index)
        }
        
    });
    aux.sort((a, b) => {return a - b;});

    const dataHoje = hoje()
    aux.forEach((linha, index) => {
        const dataSintoma = string2Data(sintomasCidadao[index].dataInicio, 'yyyy-mm-dd', '-')
        const item = {
            id: todosSintomas[linha].id, 
            nome: todosSintomas[linha].nome,
            dias: parseInt((dataHoje - dataSintoma) / (1000 * 60 * 60 * 24), 10),
            selecionado: true
        }
        retorno.push(item)
    })

    todosSintomas.forEach((linha, index) => {
        if (!aux.includes(index)) {
            const item = {
                id: linha.id, 
                nome: linha.nome,
                dias: 0,
                selecionado: false
            }
            retorno.push(item)
        }
    })
    return retorno
}

export function preparaSintomas2Save(dataBase, sintomas) {
    let retorno = [];
    
    sintomas.forEach((linha) => {
        if (linha.selecionado) {
            let dataInicio = new Date(dataBase.getTime())
            dataInicio.setDate(dataBase.getDate() - linha.dias)
            const item = {
                id: linha.id,
                dataInicio: data2String(dataInicio, 'SQL')
            }
            retorno.push (item)
        }
    })
    return retorno;
}
export function temAcesso (array, funcionalidadeId, tipoFuncionalidadeId, acao) {
    let achou = -1
    for (let i= 0; (i < array.length) && (achou == -1); ++i) {
        if ((funcionalidadeId == array[i].funcionalidadeId) &&  (array[i].tipoFuncionalidadeId === tipoFuncionalidadeId)) {
            if (tipoFuncionalidadeId == 1)
            { 
                switch (acao)
                {
                    case 'C':
                        achou = (array[i].consulta === 'S' ? i : achou);
                        break;
                    case 'A':
                        achou = (array[i].alteracao === 'S' ? i : achou);
                        break;
                    case 'I':
                        achou = (array[i].inclusao === 'S' ? i : achou);
                        break;
                    case 'E':
                        achou = (array[i].exclusao === 'S' ? i : achou);
                        break;
                    default:
                        achou = -1;
                }
            } else {
                achou = (array[i].consulta === 'S' ? i : achou);
            }
        }
    }
    return (achou !== -1) 
}
export function hoje() {
    const _dataAux = new Date()
    return new Date(_dataAux.getFullYear(),_dataAux.getMonth(),_dataAux.getDate())
}

const  enumStatusVisita = {
    recusada: 0,
    pacienteAusente: 1,
    semPendencia: 2,
    naoBaixada: 3,
    baixada: 4
}

export function statusVisita(tipoDesfechoVisitaId, requerSolucao, dataSolucao) {

    if (tipoDesfechoVisitaId == 2) // Visita recusada
        return enumStatusVisita.recusada

    if (tipoDesfechoVisitaId == 3) // Paciente ausente
        return enumStatusVisita.pacienteAusente

    if (requerSolucao == 'S') 
        return dataSolucao == '0001-01-01' ? enumStatusVisita.naoBaixada : enumStatusVisita.baixada

    return this.enumStatusVisita.semPendencia
}

