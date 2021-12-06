<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <TituloPagina titulo="Visitas Cadastradas no Dispositivo" @cbAnterior="$router.back()"/>
       
        <v-flex v-show="buscandoDados==false">
            <v-card flat class="pt-0 mt-0" tile>
                <v-list subheaderthree-line>
                    <v-chip-group v-model="filtro" column>
                        <v-chip filter outlined>Todas</v-chip>
                        <v-chip filter outlined>Enviadas</v-chip>
                        <v-chip filter outlined>Não Enviadas</v-chip>
                    </v-chip-group>
                    <v-divider></v-divider>
                    <v-subheader class="justify-center px-0">
                        <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                        <v-col cols="3" >
                            <v-row justify="end">
                                <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                            </v-row>
                        </v-col> 
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group class="px-1">
                        <v-flex v-for="(item) in resultado" :key="item.id">
                            <v-list-item class="text-wrap  px-1 py-1">
                                <v-row>
                                    <v-col cols="10">
                                        <v-list-item-title>{{item.dataVisita}}</v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap font-weight-bold">{{linhaMotivo(item.tipoMotivoVisitaId, item.nomeTipoMotivoVisita, item.nomeTipoMotivoVisitaAnalitico)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-html="item.nomePaciente"></v-list-item-subtitle>
                                        <v-list-item-subtitle v-html="item.enderecoCompleto"></v-list-item-subtitle>
                                        <v-flex v-if="item.tipoDesfechoVisitaId == 1">
                                            <v-list-item-subtitle>Ação: {{item.nomeAcaoVisita}}</v-list-item-subtitle>
                                        </v-flex>
                                        <v-flex v-else-if="item.tipoDesfechoVisitaId == 2">
                                            <v-list-item-subtitle class="red--text">Visita não realizada</v-list-item-subtitle>
                                        </v-flex>
                                        <v-flex v-else>
                                            <v-list-item-subtitle class="red--text">Cidadão estava ausente</v-list-item-subtitle>
                                        </v-flex>
                                    </v-col>
                                    <v-col cols="2" >
                                    <v-container  class="fill-height" fluid>
                                            <v-row justify="center" align="center">
                                                <div>
                                                    <v-btn :disabled="item.atualizado === true" icon color="primary" @click="uploadVisita(item.id)"><v-icon>mdi-cloud-upload-outline</v-icon></v-btn>
                                                </div>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-flex>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-flex>
    </v-container>
</template>
<script>
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'
    import TituloPagina from '../components/TituloPagina'
    import store from '../store'
    import { stringDataSql2Br } from '../bibliotecas/formataValores'
    import proxyService from '../services/proxyService'

    export default {
        components: {ProgressBar, MessageBox, TituloPagina},
        data() {
          return {
            buscandoDados: true,
            filtro: 2,

            resultado: [],
                       
            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            enumEtapa: {
                emPesquisa: 0,
                emCadastro: 1
            },

            etapaAtual: 0
          }
        },
        created() {
            store.commit('habilitaUserbar', false)
        },
        mounted() {
            this.montaDados();
        },
        watch: {
            filtro() {
                this.refresh();
            },
        },
        computed: {
            mensagemErro: {
                get: function() { return this.mensagem},
                set: function(val) {
                    this.tipoMensagem = 1
                    this.mensagem = val
                }
            },
            mensagemSucesso: {
                get: function() { return this.mensagem},
                set: function(val) {
                this.tipoMensagem = 0
                this.mensagem = val
                }
            },
            tituloLista: function() {
                const _numeroRegistros = this.resultado.length
                return (_numeroRegistros == 0) ? 'Não há visitas para essa pesquisa' : (_numeroRegistros == 1) ? ` Uma visita retornada na pesquisa  ` : ` ${_numeroRegistros} visitas retornadas`
            },
        },
        methods: {            
            linhaMotivo (motivoId, nomeMotivo, motivoDetalhe) {
                switch (motivoId) {
                    case 1:
                    case 2: 
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return motivoDetalhe;
                    case 4:
                        return 'ACOMP. - ' + motivoDetalhe
                    default:
                        return nomeMotivo + ' - ' + motivoDetalhe
                }
            },
            refresh() {
                this.montaDados();
            },
            montaDados() {
                let _visitas = store.getters.visitas || [];

                this.buscandoDados = true;     
                let _dados = [];           

                const _motivosVisita = store.getters.motivosVisita;
                const _motivosAnaliticosVisita = store.getters.motivosAnaliticosVisita;
                const _acoesVisita = store.getters.acoesVisita;
                let _enderecoCompleto = '';
                
                if (this.filtro > 0) {
                    const status = this.filtro === 1 ? true : false;
                    _visitas = _visitas.filter((x) => {return x.atualizado === status})
                }
                _visitas.forEach(v => {
                    const _paciente = store.getters.cidadao(v.dados.pacienteId)
                    const _motivoAnalitico = _motivosAnaliticosVisita.find((x) => {return x.id === v.dados.tipoMotivoVisitaAnaliticoId});
                    const _motivo = _motivosVisita.find((x) => {return x.id === _motivoAnalitico.tipoMotivoVisitaId});
                    const _acao = _acoesVisita.find((x) => {return x.id === v.dados.tipoAcaoVisitaId});
                    
                    _enderecoCompleto = _paciente.nomeLogradouro + (_paciente.numeroEndereco ? ', ' + _paciente.numeroEndereco : '')
                    _enderecoCompleto += (_paciente.complementoEndereco ? ' - ' + _paciente.complementoEndereco : '')
                
                    _dados.push({
                        id: v.id,
                        atualizado: v.atualizado,
                        dataVisita: stringDataSql2Br(v.dados.dataVisita),
                        pacienteid: v.dados.pacienteId,
                        altura: v.dados.altura,
                        peso: v.peso,
                        relatorioVisita: v.relatorioVisita,
                        
                        nomePaciente: _paciente.nome,
                        enderecoCompleto: _enderecoCompleto,

                        
                        tipoMotivoVisitaId: _motivo.id,
                        nomeTipoMotivoVisita: _motivo.nome,
                        nomeTipoMotivoVisitaAnalitico: _motivoAnalitico.nome,
                        tipoDesfechoVisitaId: v.dados.tipoDesfechoVisitaId,
                        nomeDesfechoVisita: 'desfecho',
                        tipoAcaoVisitaId: v.dados.tipoAcaoVisitaId,
                        nomeAcaoVisita: _acao.nome
                    })
                });
                this.resultado = _dados;
                this.buscandoDados = false;                
            },
            async uploadVisita(id) {
                if (!store.getters.estaLogado) {
                    console.log('caralho');
                    this.mensagemErro = 'Você precisa se logar para enviar as visitas'
                    return;
                }
                if (!store.getters.estaOnLine) {
                    this.mensagemErro = 'Você deve estar online para enviar as visitas'
                    return;
                }

                const _visita = store.getters.visita(id);
                if (_visita.atualizado == true) {
                    this.mensagemErro = 'Visita já foi atualizada'
                    return;
                }

                const _strDataVisita = _visita.dados.dataVisita.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1')  // eslint-disable-line
                const _param = {
                    pacienteId: _visita.dados.pacienteId,
                    dataVisita: _strDataVisita,
                    tipoMotivoVisitaAnaliticoId: _visita.dados.tipoMotivoVisitaAnaliticoId,
                    altura: _visita.dados.altura,
                    peso: _visita.dados.peso,
                    tipoDesfechoVisitaId: _visita.dados.tipoDesfechoVisitaId,
                    tipoAcaoVisitaId: _visita.dados.tipoAcaoVisitaId,
                    relatorioVisita: _visita.dados.relatorioVisita,
                    tipoSintomas: _visita.dados.tipoSintomas
                }
                this.mensagemAguarde = 'Atualizando visita na nuvem. Aguarde...'
                await proxyService.salvaVisita(0, _param)
                .then(resp => {
                    this.mensagemAguarde = ''
                    if (resp.status != 200) {
                        this.mensagemErro = resp.message
                    } else {
                        const _param2 = {guid: id}
                        
                        this.$store.commit('visitaUploaded', _param2)

                        const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
                        delay(1000).then(() => {this.refresh();});

                        this.mensagemAguarde = ''
                        this.mensagemSucesso = 'Visita foi atualizada na nuvem com sucesso'
                    }
                })
                .catch(err => {this.mensagemAguarde = ''; this.mensagemErro = proxyService.catchPadrao(err); return;});
                this.mensagemAguarde = ''
            }
        }
    }
</script>
