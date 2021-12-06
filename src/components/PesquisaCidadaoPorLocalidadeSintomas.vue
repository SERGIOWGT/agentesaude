<template>
    <v-expansion-panels focusable class="pt-0 mt-0" v-model="abrePainel">
        <v-expansion-panel class="mt-2"> 
        <v-expansion-panel-header  class="blue-grey lighten-5 teal--text  px-3">
            <v-row no-gutters>
                <v-col cols="12">
                PESQUISA POR LOCALIDADE E SINTOMAS
                </v-col>
                <v-col
                cols="1"
                class="text--secondary"
                >
                <v-fade-transition leave-absolute>
                    <span
                    key="0"
                    >
                    </span>
                </v-fade-transition>
                </v-col>
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-row>
                <v-col cols="12" class="px-1 pb-0 pt-4">
                    <v-form ref="form" class="mx-0" v-model="formularioValido">
                        <v-flex v-if="tituloData != ''">
                            <v-row ><v-col class="pt-2 pb-0" cols="6"><small>{{tituloData}}</small></v-col></v-row> 
                            <v-row> 
                                <v-col cols="6" class="pt-2">
                                    <v-text-field dense required clearable
                                    label="Início"
                                    v-model="dataInicio"
                                    v-mask="'##/##/####'"
                                    :rules="[regras.Data.valida(true)]"
                                ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="pt-2">
                                    <v-text-field dense required clearable
                                    label="Fim"
                                    v-model="dataFim"
                                    v-mask="'##/##/####'"
                                    :rules="[regras.Data.valida(true)]"
                                ></v-text-field>
                                </v-col>

                            </v-row>
                        </v-flex>
                        <v-text-field class="pb-0 pt-3" dense disabled 
                            label="Unidade de saúde"
                            v-model="nomeUnidadeSaude"
                        ></v-text-field>
                        
                        <v-text-field class="pb-0 pt-2" dense disabled
                            label="Micro Àrea"
                            v-model="nomeMicroArea"
                         ></v-text-field>
 
                        <v-flex v-if="this.habilitaBairro" >
                            <v-autocomplete @input="setaBairro"
                                dense
                                clearable
                                hide-no-data
                                label="Bairro"
                                :items="bairros"
                                item-value="id"
                                item-text="nome"
                            ></v-autocomplete> 
                        </v-flex>
                        <v-flex v-if="this.habilitaNomeRua" >
                            <!-- :disabled="infoPesquisa.bairroId === 0 || infoPesquisa.bairros.length === 0 " -->
                            <v-autocomplete @input="setaLogradouro"
                                dense
                                clearable
                                hide-no-data
                                label="Nome da rua"
                                :disabled="bairroId === 0  "
                                :items="logradouros"
                                item-value="id"
                                item-text="nome"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex v-if="this.habilitaNumeroResidencia" >
                            <v-text-field class="mt-2"
                                dense required clearable
                                label="Número da residência"
                                v-model="numeroEndereco"
                                counter
                                maxlength="10"
                            ></v-text-field>
                        </v-flex>
                        <v-flex v-if="this.habilitaComplementoEndereco" >
                            <v-text-field class="mt-2"
                                dense
                                label="Complemento do Endereço"
                                required
                                clearable
                                v-model="complementoEndereco"
                                counter
                                maxlength="20"
                            ></v-text-field>
                        </v-flex>
                        <v-combobox
                            v-model="sintomas"
                            :items="todosSintomas"
                            :search-input.sync="syncSintoma"
                            hide-selected
                            label="Escolha até 5 sintomas"
                            item-value="id"
                            item-text="nome"
                            multiple
                            persistent-hint
                            small-chips
                            clearable
                        >
                            <template v-slot:no-data>
                                <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                    Não há resultados para "<strong>{{ search }}</strong>". 
                                    </v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>
                        <v-combobox
                            v-model="comorbidades"
                            :items="todasComorbidades"
                            :search-input.sync="syncComorbidade"
                            hide-selected
                            label="Escolha até 5 Comorbidades"
                            item-value="id"
                            item-text="nome"
                            multiple
                            persistent-hint
                            small-chips
                            clearable
                        >
                            <template v-slot:no-data>
                                <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                    Não há resultados para "<strong>{{ search }}</strong>". 
                                    </v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>
                        
                        <v-combobox 
                            v-model="doencas"
                            :items="todasDoencas"
                            :search-input.sync="syncDoenca"
                            hide-selected
                            label="Escolha até 5 doenças"
                            item-value="id"
                            item-text="nome"
                            multiple persistent-hint small-chips clearable
                        >
                            <template v-slot:no-data>
                                <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                    Não há resultados para "<strong>{{ search }}</strong>". 
                                    </v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>
                        <v-flex v-if="this.habilitaCorteVisita" >
                            <v-text-field 
                                dense required clearable
                                label="Pacientes não visitados desde*"
                                v-model="dataMaiorVisita"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                            ></v-text-field>
                        </v-flex>
                        <v-radio-group  label="Ordena por: " class="py-0 my-0" dense v-model="ordenacao" row >
                            <v-col cols="3"  class="py-1 my-1 pl-0"><v-radio value="N" label="Nome"></v-radio></v-col>
                            <v-col cols="3" class="py-1 my-1"><v-radio value="E" label="Endereço"></v-radio></v-col>
                        </v-radio-group>
                    </v-form>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text small color="primary" @click="$refs.form.reset()"> Limpar </v-btn>
                <v-btn text small color="red" :disabled="!pesquisaLiberada || !habilitaPesquisa || isLoading" @click="busca()"> Buscar </v-btn>
            </v-card-actions>
        </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script>
    import regrasCampos from '../bibliotecas/regrasCampos'
    import {data2String} from '../bibliotecas/formataValores'

    export default {
        props: {
            aberto: Boolean,
            habilitaPesquisa: Boolean,
            habilitaBairro: Boolean,
            habilitaNomeRua: Boolean,
            habilitaNumeroResidencia: Boolean,
            habilitaComplementoEndereco: Boolean,
            habilitaCorteVisita: Boolean,
            tituloData: String
        },
        data() {
            return {
                regras: regrasCampos,

                formularioValido: false,
                abrePainel: null,

                bairroId: 0,
                logradouroId: 0,

                cidadeId:0,
                unidadeSaudeId: 0,
                microAreaId: 0,
                
                nomeUnidadeSaude: '',
                nomeMicroArea: '',

                numeroEndereco: '',
                complementoEndereco: '',
                dataInicioVisita: '',
                dataFimVisita: '',

                isLoading: false,

                bairros: [],
                logradouros: [],
                lista: [],
                sintomas: [],
                comorbidades: [],
                doencas: [],

                dataMaiorVisita: '16/10/2021',
                ordenacao: 'N',

                todosSintomas: [],
                todasComorbidades: [],
                todasDoencas: [],

                syncSintoma: null,
                syncComorbidade: null,
                syncDoenca: null,
            }
            
        },
        created() {
            const cidadePadrao = this.$store.getters.cidadePadrao;
            this.cidadeId = cidadePadrao.id
            const unidadeSaudePadrao = this.$store.getters.unidadeSaudePadrao;
            this.nomeUnidadeSaude = unidadeSaudePadrao.nome;
            const microAreaPadrao = this.$store.getters.microAreaPadrao
            this.nomeMicroArea = microAreaPadrao.nome;
            this.microAreaId = microAreaPadrao.id

            if (this.tituloData) {
                this.dataFim = data2String(new Date(), 'BR')
                this.dataInicio = data2String(new Date(new Date()-(30*24*60*60*1000)), 'BR')
            }
        },      
        watch: {
            aberto(v) {
                 if (v) {
                    if (this.abrePainel == null) {
                        this.abrePainel = 0
                    }
                } else {
                    if (this.abrePainel == 0){
                        this.abrePainel = null
                    }
                }
            },
            abrePainel(v) {
                this.$emit('cbAbriu', v == null ? false : true)
            },
        },  
        computed: {
            mensagemAguarde: {
                get () {
                    return ''
                },
                set (v) {
                    this.$emit('cbMensagemAguarde', v)
                }
            },
            mensagemErro: {
                get () {
                    return ''
                },
                set (v) {
                    this.$emit('cbMensagemErro', v)
                }
            },
            pesquisaLiberada () {
                return this.formularioValido && (!this.isEmpty(this.bairroId) || !this.isEmpty(this.logradouroId))
            },
            search: {
                get () {
                    return this.queryTerm
                },
                set () {
                }
            },
        },
        mounted() {
            this.todasDoencas = this.$store.getters.doencas;
            this.todosSintomas = this.$store.getters.sintomas;
            this.todasComorbidades = this.$store.getters.comorbidades;
            this.bairros = this.$store.getters.bairros;

            this.mensagemAguarde = ''
            this.$emit('cbFimBuscaDados')
        },   
        methods: {
            busca() {
                const param = {
                    unidadeSaudeId: this.unidadeSaudeId,
                    microAreaId: this.microAreaId,
                    bairroId: this.bairroId,
                    logradouroId: this.logradouroId,
                    sintomas: this.sintomas,
                    comorbidades: this.comorbidades,
                    doencas: this.doencas,
                    numeroEndereco: this.numeroEndereco,
                    complementoEndereco: this.complementoEndereco,
                    dataMaiorVisita: this.dataMaiorVisita,
                    dataInicioVisita: this.dataInicio,
                    dataFimVisita: this.dataFim,
                    ordenacao: this.ordenacao == "N" ? 0 : 1
                }

                this.$emit('cbBusca', param)
            },
            setaLogradouro(id) {
                this.logradouroId = id;
            },
            setaBairro(id) {
                if (id == null) {
                    this.bairroId = 0
                    this.logradouros = []
                } else {
                    this.bairroId = id
                    const _logradouros = this.$store.getters.logradouros;
                    this.logradouros = _logradouros.filter(x => {return x.bairroId === id})
                }
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
        }
    }
</script>