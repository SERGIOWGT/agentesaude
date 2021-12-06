<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>   
        <ProgressBar :mensagem="mensagemAguarde"/>     
        <v-flex>
            <IdentificaVisita 
                v-show="operacaoAtual == enumOperacao.pesquisa"
                @cbNovaVisita= 'novaVisita'
                @cbEditaCidadao='editaCidadao'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            /> 
            <CadastraVisita
                v-if="operacaoAtual == enumOperacao.cadastroVisita"
                :pacienteId='pacienteId'
                @cbFimCadastro='fimCadastroVisita'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            />
            <ConsultaCidadao 
                v-if="operacaoAtual == enumOperacao.consultaCidadao"
                :pacienteId='pacienteId'
                @cbFimCadastro='fimCadastroCidadao'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            />
        </v-flex>
    </v-container>
</template>
<script>
    import IdentificaVisita from '../components/VisitaIdentifica';
    import MessageBox from '../lastec.components/lastec-messagebox';
    import ProgressBar from '../lastec.components/lastec-progressbar';
    import ConsultaCidadao from '../components/CidadaoConsulta';
    import CadastraVisita from '../components/VisitaCadastra';
    
    export default {
        components: {
            IdentificaVisita, MessageBox, ProgressBar, ConsultaCidadao, CadastraVisita
        },
        data() {
          return {
            enumOperacao: {
                pesquisa: 0,
                cadastroVisita: 1,
                cadastroCidadao: 2,
                consultaCidadao: 3
            },
            operacaoAtual: 0,
            pacienteId: 0,

            somenteConsultaPaciente: true,

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: ''
          }
        },
        created() {
            this.$store.commit('habilitaUserbar', false)
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
        },
        methods: {
            cbMensagemAguarde(msg) {
                this.mensagemAguarde = msg
            },
            cbMensagemErro(msg) {
                this.tipoMensagem = 1
                this.mensagem = msg
            },
            cbMensagemSucesso(msg) {
                this.tipoMensagem = 0
                this.mensagem = msg
            },
            novaVisita(pacienteId) {
                this.pacienteId = pacienteId
                this.operacaoAtual = this.enumOperacao.cadastroVisita
            },
            editaCidadao(pacienteId) {
                this.pacienteId = pacienteId
                //this.operacaoAtual = (this.somenteConsultaPaciente) ? this.enumOperacao.consultaCidadao : this.enumOperacao.cadastroCidadao
                this.operacaoAtual = this.enumOperacao.consultaCidadao;
            },
            fimCadastroCidadao(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa
                this.mensagemAguarde = ''

                if (volta == false) 
                    this.mensagemSucesso = 'Cidadão ' + (this.pacienteId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' 
            },
            fimCadastroVisita(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa
                this.mensagemAguarde = ''

                if (volta == false) 
                    this.mensagemSucesso = 'Visita incluída com sucesso!' 
            }
        }
    }
</script>