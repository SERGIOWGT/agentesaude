<template>
  <v-container fill-height>
    <v-flex>
      <v-bottom-sheet v-model="showFormTrocaSenha" inset  max-width="500px">
        <v-sheet class="text-center">
          <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">TROCA DE SENHA</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-subtitle class="text-start text-subtitle-1">{{mensagemDialog}}</v-card-subtitle>
                <v-card-text class="text-start"> Informe seu nova senha e depois repita essa senha usando os campos abaixo.</v-card-text>
                <v-form ref="myForm" class="pt-5 mx-3" v-model="formTrocaSenhaValido">
                  <v-text-field class="pt-2" clearable 
                    label="Nova Senha"
                    v-model="senhaNova"
                    prepend-icon="mdi-lock"
                    :counter="tamanhoMaximoSenha"
                    :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
                    :type="!senhaNovaNaoVisivel ? 'password' : 'text'"
                    :append-icon="senhaNovaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (senhaNovaNaoVisivel = !senhaNovaNaoVisivel)"
                    @click:append="senhaNovaNaoVisivel = !senhaNovaNaoVisivel"
                  />
                  <v-text-field class="pt-2 pb-3" dense clearable 
                    label="Repita a Senha"
                    prepend-icon="mdi-lock"
                    v-model="senhaRepetida"
                    counter
                    :type="!senhaRepetidaNaoVisivel ? 'password' : 'text'"
                    :append-icon="senhaRepetidaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (senhaRepetidaNaoVisivel = !senhaRepetidaNaoVisivel)"
                    @click:append="senhaRepetidaNaoVisivel = !senhaRepetidaNaoVisivel"
                    :rules="[rotinasLogin.SenhaRules.mesmaSenha(senhaNova)]"
                  />
                </v-form>
            </v-card-text>
            <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
              <v-spacer></v-spacer>
              <v-btn text small color="secundary" @click="showFormTrocaSenha=false" :disabled="isLoading">Fechar </v-btn>
              <v-btn text small color="primary" :disabled="!formTrocaSenhaValido || isLoading" v-on:click="trocaSenha()">Troca Senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-bottom-sheet>
      <v-bottom-sheet v-model="showFormEsqueciSenha" inset  max-width="500px">
        <v-sheet class="text-center">
          <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">RENVIO DE SENHA</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-subtitle class="text-start text-subtitle-1">{{mensagemDialog}}</v-card-subtitle>
                <v-card-text class="text-start"> Informe o seu email no campo abaixo para enviarmos sua senha.</v-card-text>
                <v-form ref="myForm" class="pt-5 mx-3" v-model="formEsqueciSenhaValido">
                  <v-text-field 
                    :disabled="isLoading"
                    v-model="email"
                    :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
                    :label="nomeChave"
                    required
                    clearable
                    prepend-icon="mdi-account-circle"
                ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
              <v-spacer></v-spacer>
              <v-btn text small color="secundary" @click="showFormEsqueciSenha=false" :disabled="isLoading">Fechar </v-btn>
              <v-btn text small color="primary" :disabled="!formEsqueciSenhaValido || isLoading" v-on:click="esqueceuSenha()">Envia Senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-bottom-sheet>
    </v-flex>
    <v-container>
      <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
      <ProgressBar :mensagem="mensagemAguarde"/>
      <v-row class="justify-center pt-15 pb-15 px-3">
        <transition name="roll">
          <v-img v-if="bounce" class="shrink mr-2" contain src="../assets/logoTelaAbertura.jpeg"/>
        </transition>
      </v-row>
      <v-flex v-if="telaPronta">
        <v-form class="my-2 px-2 " v-model="formValido" >
          <v-text-field 
            :disabled="isLoading"
            v-model="email"
            :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
            :label="nomeChave"
            required
            clearable
            prepend-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field 
            :disabled="isLoading"
            label="Senha"
            clearable
            v-model="senha"
            :counter="tamanhoMaximoSenha"
            :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
            :type="!senhaNaoVisivel ? 'password' : 'text'"
            prepend-icon="mdi-lock"
            :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
            :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
            @click:append="senhaNaoVisivel = !senhaNaoVisivel"
          />
          <v-row class="justify-center pt-5 mt-5">
              <v-btn :disabled="isLoading || !formValido" class="white--text teal lighten-2 botao-arredondado" v-on:click="autentica()">Acessar</v-btn>
          </v-row>
          <v-row dense class="justify-center pt-8" >
              <v-btn text :disabled="isLoading"  v-on:click="mostraformEsqueciSenha()"><span class="teal--text text--lighten-2 text-caption">Esqueceu sua senha?&nbsp; Clique aqui</span></v-btn>
          </v-row>
          <v-row class="justify-center pt-3" v-if="permiteRegistroUsuario">
            <v-btn text :disabled="isLoading"><span class="texto text-caption"> Sua primeira vez?&nbsp; Crie aqui seu usuário</span></v-btn>
          </v-row>
        </v-form>
      </v-flex>
    </v-container>
  </v-container>
</template>
<script>
import MessageBox from '../lastec.components/lastec-messagebox'
import ProgressBar from '../lastec.components/lastec-progressbar'
import sso from '../services/ssoService'
import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'

export default {
    props: {
        tokenSistema: String
    },
    components:{
      ProgressBar, MessageBox
    },
    data() {
      return {
        rotinasLogin: RotinasLogin,

        emAbertura: true,
        nomeSistema: ''  ,
        bounce: false,

        telaPronta: false,
        
        showFormTrocaSenha: false,
        showFormEsqueciSenha: false,
        formEsqueciSenhaValido: false, 
        formTrocaSenhaValido: false, 
        formValido: false, 
        isLoading: true,
        senhaNaoVisivel: false,
        senhaNovaNaoVisivel: false,
        senhaRepetidaNaoVisivel: false,

        email: '',
        senha: '',
        senhaNova: '',
        senhaRepetida: '',
        
        urlImagemLogin: '',
        tamanhoMinimoSenha: 0,
        tamanhoMaximoSenha: 0,
        nomeChave:  '',
        formatoChave:  '',
        formatoSenha:  '',
        mensagemErroFormatoSenha: '',
        permiteRegistroUsuario: false,

        tipoMensagem: 0,
        mensagemDialog: '',
        mensagem: '',
        mensagemAguarde: ''
      }
    },
    mounted() {
      this.bounce = true
      const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
      delay(1000).then(() => this.listaConfiguracao())

      if (this.tokenSistema) {
        this.email = localStorage.getItem(`${this.tokenSistema}_us`) || ''
      }
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
        async autentica() {
            this.isLoading =true;
            this.mensagemAguarde =  'Autenticando usuário! Aguarde...'
            let _erro = false;
            const _resp = await sso.autentica(this.tokenSistema, this.email, this.senha) 
                                .catch (err => {
                                    _erro = true;
                                    this.mensagemAguarde =  '';
                                    this.isLoading =false; 
                                    this.mensagemErro =  'Autenticando usuário: ' + sso.catchPadrao(err)});

            if (_erro) return;

            this.isLoading =false;
            this.mensagemAguarde =  ''

            const _data = _resp.data;
            if (_data.primeiroAcesso) {
                this.showFormTrocaSenha = true
                this.mensagemDialog = 'Você precisa de trocar de senha pois é seu primeiro acesso.'
                return
            }
            if (_data.senhaExpirada) {
                this.showFormTrocaSenha = true
                this.mensagemDialog = 'Você precisa de trocar de senha pois sua senha está expirada.'
                return
            }
            if (_data.bloqueado) {
                this.showFormTrocaSenha = true
                this.mensagemDialog = 'Você precisa de trocar de senha pois sua senha está bloqueada'
                return
            }
            if (!_data.usuarioGuid) {
                this.mensagemErro = 'Chave do usuário não encontrada!'
                return
            }

            const param = {
                email: this.email,
                usuarioId: _data.usuarioId,
                token: _data.token,
                nomeUsuario: _data.nomeUsuario,
                permissionamento: _data.permissionamento,
                usuarioGuid: _data.usuarioGuid,
                sistemaId: _data.sistemaId
            }
            localStorage.setItem(`${this.tokenSistema}_us`, this.email);
            this.$emit('cbAutenticado', param);
        },
        async listaConfiguracao() {
            let _erro = false;
            this.isLoading = true
            this.mensagemAguarde = "Preparando ambiente. Aguarde..."
            let _resp = await sso.listaConfiguracao(this.tokenSistema)            
                .catch (err => {
                    _erro = true;
                    this.mensagemAguarde = ''; 
                    this.mensagemErro= sso.catchPadrao(err); 
                });

            if (_erro) return;
            
            this.isLoading = false
            this.mensagemAguarde = ''
            this.sistemaId =  _resp.data.sistemaId;
            this.permiteRegistroUsuario = _resp.data.permiteRegistroUsuario;
            this.urlImagemLogin = _resp.data.urlImagemLogin;
            this.nomeChave = _resp.data.nomeChave;
            this.formatoChave = _resp.data.formatoChave;
            this.tamanhoMaximoSenha =  _resp.data.tamanhoMaximoSenha;
            this.tamanhoMinimoSenha = _resp.data.tamanhoMinimoSenha;
            this.formatoSenha = _resp.data.formatoSenha;
            this.mensagemErroFormatoSenha = _resp.data.mensagemErroFormatoSenha;

            /*
            let param = {
                sistemaId: this.sistemaId,
                nomeSistema: resposta.data.nomeSistema,
                plataformaId: resposta.data.plataformaId,
                nomePlataforma: resposta.data.nomePlataforma,
                urlImagemLogin: this.urlImagemLogin,
                tamanhoMaximoSenha: this.tamanhoMaximoSenha,
                tamanhoMinimoSenha: this.tamanhoMinimoSenha,
                formatoSenha: this.formatoSenha,
                mensagemErroFormatoSenha: this.mensagemErroFormatoSenha
            }
            this.$store.commit('setaConfiguracaoSistema', param)
            */
            this.telaPronta= true
        },
        async esqueceuSenha() {
            this.isLoading =true;
            this.mensagemAguarde =  'Solicitando envio da senha! Aguarde...'
            await sso.esqueceuSenha(this.tokenSistema, this.email, this.senha, this.senhaNova)
            .then (resp => {
            this.mensagemAguarde =  ''
            this.isLoading =false;
            if (resp.status == 204){
                this.mensagemSucesso = 'Solicitação feita com sucesso. Verifique o e-mail.'
                this.showFormEsqueciSenha = false
            } else {
                this.mensagemErro =  resp.message
            } 
            })
            .catch (err => {
            this.mensagemAguarde =  '';
            this.isLoading =false; 
            this.mensagemErro =  sso.catchPadrao(err)
            });
        },
        async trocaSenha() {
            this.isLoading =true;
            this.mensagemAguarde =  'Trocando a senha! Aguarde...'
            await sso.trocaSenha(this.tokenSistema, this.email, this.senha, this.senhaNova)
            .then (resp => {
            this.mensagemAguarde =  ''
            this.isLoading =false;
            if (resp.status == 204){
                this.mensagemSucesso = 'Senha trocada com sucesso. A partir de agora, use a senha nova'
                this.showFormTrocaSenha = false
            } else {
                this.mensagemErro =  resp.message
            } 
            })
            .catch (err => {
            this.mensagemAguarde =  '';
            this.isLoading =false; 
            this.mensagemErro =  sso.catchPadrao(err)
            });
        },
        mostraformEsqueciSenha() {
            this.showFormEsqueciSenha =true
        },
    }
}

</script>

<style scoped>
  .container {
    background-color:#FFFFFF !important; /* light-blue darken-1*/
  }
  
  .botao-arredondado{
    width: 90%;
    border-radius:10px!important;
  } 
  .arredondado{
    width: 90%;
    border-bottom-left-radius: 50px 50px; 
    border-bottom-right-radius: 50px 50px;
  } 

  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in 1s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .roll-enter-active {
    animation: roll-in .9s;
  }
  .roll-leave-active {
    animation: roll-in 9s reverse;
  }
  @keyframes roll-in {
    0% {
      transform: scale(0) rotateZ(0deg) translateX(-250px);
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: scale(1) rotateZ(360deg) translateX(0px);
      opacity: 1;
    }
  }
</style>
