<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE VISITA" @cbAnterior="$router.back()"/>
        
        <v-flex v-show="buscandoDados==false">
            <PesquisaPorNome  :aberto="statusPainel==1" :cidadeId="cidadePadrao.id" :habilitaPesquisa="!isLoadingGrid" tituloData="" 
                              @cbAbriu="cbAbrePainelNome"  @cbBusca="cbBuscaPorPacienteId" 
            />
            
            <PesquisaPorLocalidadeSintomas  :aberto="statusPainel==2" :habilitaPesquisa="!isLoadingGrid"  
                                            :habilitaBairro="true" :habilitaNomeRua="true" :habilitaNumeroResidencia= "true" :habilitaComplementoEndereco= "true"
                                            :habilitaCorteVisita="true" tituloData="" 
                                            @cbAbriu="abrePanelOutros" @cbBusca="cbBuscaPorOutros" @cbFimBuscaDados="cbFimBuscaDados"  @cbMensagemAguarde="cbMensagemAguarde" @cbMensagemErro="cbMensagemErro"/>

            <v-card flat class="pt-0 mt-0" tile v-if="gridPronto" >
                <v-list three-line>
                    <v-subheader class="justify-center px-0">
                        <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                        <v-col cols="3" ><v-row justify="end"><v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn></v-row></v-col> 
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group color="primary" >
                        <v-flex v-for="(item) in infoPesquisa.lista" :key="item.id">
                            <v-list-item class="px-1">
                                <v-row>
                                    <v-col cols="10">
                                        <v-list-item-content>
                                            <v-list-item-title v-html="item.nome"></v-list-item-title>
                                            <v-list-item-subtitle v-html="enderecoCidadaoConcatena(item.nomeLogradouro, item.numeroEndereco, item.complementoEndereco)"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-html="item.nomeMicroArea"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-html="item.nomeEstadoSaude"></v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-container class="fill-height" fluid>
                                            <v-row justify="center" align="center">
                                                <v-btn icon color="primary" @click="incluiVisita(item.id)"><v-icon>mdi-thermometer-plus</v-icon></v-btn>
                                            </v-row>
                                            <v-row justify="center" align="center">
                                                <v-btn icon color="primary" @click="editaCidadao(item.id)"><v-icon>mdi-account-arrow-right-outline</v-icon></v-btn>
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
    import PesquisaPorNome from '../components/PesquisaCidadaoPorNome'
    import TituloPagina from '../components/TituloPagina'
    import PesquisaPorLocalidadeSintomas from '../components/PesquisaCidadaoPorLocalidadeSintomas'
    import {stringDataBr2Sql} from '../bibliotecas/formataValores'
    
    export default {
        components: {
            PesquisaPorNome, PesquisaPorLocalidadeSintomas, TituloPagina
        },
        data() {
          return {
            statusPainel: 1, //0-fechados; 

            buscandoDados: true,
            gridPronto: false,

            isLoading: false,
            isLoadingGrid: false,

            cidadePadrao: null,
            
            infoPesquisa: {
                tipo: -1,
                pacienteId: 0,
                bairroId: 0,
                logradouroId: 0,
                unidadeSaudeId: 0,
                microAreaId: 0,
                bairros: [],
                logradouros: [],
                unidadesSaude: [],
                microAreas: [],
                lista: [],
                sintomas: [],
                comorbidades: [],
                doencas: [],
                dataInicioVisita: '',
                dataFimVisita: '',
                ordenacao: 0
            },
                        
            
            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao;
        },
        watch: {
            model (val) {
                if (val.length > 5) {
                    this.$nextTick(() => this.model.pop())
                }
            },
            mensagemAguarde (val) {
                this.$emit('cbMensagemAguarde', val)
                this.isLoading = (val == '') ? false : true
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
            mensagemSuccesso (val) {
                this.$emit('cbMensagemSucesso', val)
            }
        },
        computed: {
            tituloLista: function() {
                const _numeroRegistros = this.infoPesquisa.lista.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um cidadão retornado na pesquisa  ` : ` ${_numeroRegistros} cidadãos retornados`
            },
        },       
        methods: {
            cbFimBuscaDados() {
                this.buscandoDados = false
            },
            cbMensagemAguarde(v) {
                this.mensagemAguarde = v
            },
            cbMensagemErro(v) {
                this.mensagemErro = v
            },
            cbAbrePainelNome(v) {
                if (v) {
                    this.statusPainel = 1
                }
            },
            abrePanelOutros(v) {
                if (v) {
                    this.statusPainel = 2
                }
            },
            montaGridPorId() {

                this.isLoadingGrid = true;
                let _cidadaos = this.$store.getters.cidadaos;
                this.infoPesquisa.lista = _cidadaos.filter(x => x.id === this.infoPesquisa.pacienteId );
                this.gridPronto = true
                this.mensagemAguarde = ''
                this.fechaPainel()
                this.isLoadingGrid = false
            },
            montaGridPorOutros() {
                this.mensagemAguarde = ''
                this.isLoadingGrid = true
                let contador = 0;
                let _dataFimVisita = this.infoPesquisa.dataFimVisita

                if (_dataFimVisita)
                    _dataFimVisita = stringDataBr2Sql(_dataFimVisita)
            
                const filtroOk = (cidadao) => {
                    if (contador >= 150) {
                        return false
                    }   
                    if ((_dataFimVisita) && (cidadao.dataUltimaVisita)) {
                        if (cidadao.dataUltimaVisita >= _dataFimVisita) {
                            return false
                        };
                    }

                    if (this.infoPesquisa.logradouroId) {
                        if (cidadao.logradouroId !== this.infoPesquisa.logradouroId) {
                            return false
                        };
                    }

                    if (this.infoPesquisa.bairroId) {
                        if (cidadao.bairroId !== this.infoPesquisa.bairroId){
                            return false;
                        }
                    }
                    if (this.infoPesquisa.numeroEndereco) {
                        if (cidadao.numeroEndereco !== this.infoPesquisa.numeroEndereco){
                            return false;
                        }
                    }
                    if ((this.infoPesquisa.sintomas) && (this.infoPesquisa.sintomas.length > 0)) {
                        if ((cidadao.sintomas) && (cidadao.sintomas.length > 0)) {
                            let achou = false;
                            for (let i=0; i < this.infoPesquisa.sintomas.length; ++i) {
                                for (let j=0; j < cidadao.sintomas.length; ++j) {
                                    if (this.infoPesquisa.sintomas[i].id === cidadao.sintomas[j].id) {
                                        achou = true;
                                        break;
                                    }
                                }
                            }
                            if (!achou){
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }         
                    if ((this.infoPesquisa.comorbidades) && (this.infoPesquisa.comorbidades.length > 0)) {
                        if ((cidadao.comorbidades) && (cidadao.comorbidades.length > 0)) {
                            let achou = false;
                            for (let i=0; i < this.infoPesquisa.comorbidades.length; ++i) {
                                for (let j=0; j < cidadao.comorbidades.length; ++j) {
                                    if (this.infoPesquisa.comorbidades[i].id === cidadao.comorbidades[j].id) {
                                        achou = true;
                                        break;
                                    }
                                }
                            }
                            if (!achou){
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }         
                     
                    if ((this.infoPesquisa.doencas) && (this.infoPesquisa.doencas.length > 0)) {
                        if ((cidadao.doencas) && (cidadao.doencas.length > 0)) {
                            let achou = false;
                            for (let i=0; i < this.infoPesquisa.doencas.length; ++i) {
                                for (let j=0; j < cidadao.doencas.length; ++j) {
                                    if (this.infoPesquisa.doencas[i].id === cidadao.doencas[j].id) {
                                        achou = true;
                                        break;
                                    }
                                }
                            }
                            if (!achou){
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }         
                    ++contador;
                    return true;
                }
                let _cidadaos = this.$store.getters.cidadaos;
                
                this.infoPesquisa.lista = _cidadaos.filter(filtroOk);
                if (this.infoPesquisa.ordenacao == 1) {
                    this.infoPesquisa.lista.sort((a, b) => {
                        const a_ = (a.nomeLogradouro + 'N' + a.numeroEndereco).toUpperCase(); 
                        const b_ = (b.nomeLogradouro + 'N' + b.numeroEndereco).toUpperCase(); 
                                               
                        return a_ == b_ ? 0 : a_ > b_ ? 1 : -1
                    });
                }

                this.gridPronto = true
                this.mensagemAguarde = ''
                this.fechaPainel()
                this.isLoadingGrid = false
            },
            cbBuscaPorPacienteId (param) {
                // Guarda o parametro
                this.infoPesquisa.pacienteId = param.pacienteId;

                this.montaGridPorId();
            },
            cbBuscaPorOutros (v) {
                // guarda parametros
                this.infoPesquisa.pacienteId = 0;
                this.infoPesquisa.unidadeSaudeId = v.unidadeSaudeId
                this.infoPesquisa.microAreaId = v.microAreaId
                this.infoPesquisa.bairroId = v.bairroId
                this.infoPesquisa.logradouroId = v.logradouroId
                this.infoPesquisa.numeroEndereco = v.numeroEndereco
                this.infoPesquisa.complementoEndereco = v.complementoEndereco
                this.infoPesquisa.sintomas = v.sintomas
                this.infoPesquisa.comorbidades = v.comorbidades
                this.infoPesquisa.doencas = v.doencas
                this.infoPesquisa.dataInicioVisita = null
                this.infoPesquisa.dataFimVisita = v.dataMaiorVisita
                this.infoPesquisa.ordenacao = v.ordenacao

                // Monta Grid
                this.montaGridPorOutros();
            },
            editaCidadao(pacienteId) {
                this.$emit('cbEditaCidadao', pacienteId)
            },
            enderecoCidadaoConcatena (nomeLogradouro, numeroEndereco, complementoEndereco) {
                let _retorno = nomeLogradouro + (numeroEndereco ? ', ' + numeroEndereco : '')
                _retorno += (complementoEndereco ? ' - ' + complementoEndereco : '')
                return _retorno
            },
            fechaPainel () {
                this.statusPainel = 0
            },
            async incluiVisita(pacienteId) {
                this.$emit('cbNovaVisita', pacienteId)
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            refresh() {
                if ((this.infoPesquisa.pacienteId == 0) || (this.infoPesquisa.pacienteId == null)) {
                    this.montaGridPorOutros();
                }
                else {
                    this.montaGridPorId();
                }
            },
        }
    }
</script>
<style scoped>
  .nota_texto {
    color:goldenrod;
    font-weight: bold;
    font-style: italic;
  }
  .v-btn {
      color: lightslategray;
  }
</style>