"use strict"

const erro = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

toastr.falha = function (mensagem, titulo = "Erro") {
    const old = toastr.options; 
    toastr.options = { ...toastr.options, ...erro }; 
    toastr.error(mensagem, titulo); 
};

const sucesso = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

toastr.sucesso = function (mensagem, titulo = "Deu certo!") {
    const old = toastr.options; 
    toastr.options = { ...toastr.options, ...sucesso }; 
    toastr.success(mensagem, titulo); 
};

async function deletarConta() {
	const res = await fetch("https://apiserver-infoestado.onrender.com/deletar", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include"
	});

	const data = await res.json();

	if (data.success) {
        toastr.sucesso("Conta deletada com sucesso!");
        setTimeout(() => {
            window.location.href = "https://luizagsoaress.github.io/InfoEstados/index.html";
        }, 2000);
	} else {
		toastr.falha("Para sua segurança, faça login novamente antes de deletar a conta.");
	}
}

async function atualizarSenha(senhaNova) {
    const res = await fetch("https://apiserver-infoestado.onrender.com/atualizarSenha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senhaNova }),
      credentials: "include"
    });

    const data = await res.json();

    if(data.success){
      toastr.sucesso("Senha alterada com sucesso.");
      setTimeout(() => {
        const divSenha = document.querySelector('.div-senha');
        divSenha.classList.remove("d-none");
        divSenha.classList.add("d-flex"); 
        const editarDiv = document.querySelector('.editar-div');
        editarDiv.classList.remove("d-flex");
        editarDiv.classList.add("d-none");
        const divEmail = document.querySelector('.div-email');
        divEmail.classList.remove("d-none");
        divEmail.classList.add("d-flex");
        const divDeletar = document.querySelector('.div-deletar');
        divDeletar.classList.remove("d-none");
        divDeletar.classList.add("d-flex");  
      }, 3000);
    } else {
      toastr.falha("Erro ao alterar senha.");
    }
}

const deletarBtn = document.querySelector('.deletar'); 

deletarBtn.addEventListener("click", async function() {
	await deletarConta();
});

const editarSenhaBtn = document.querySelector('.editar-senha');

if(editarSenhaBtn) {
  editarSenhaBtn.addEventListener("click", function(event) {
    event.preventDefault();
    const divSenha = document.querySelector('.div-senha');
    divSenha.classList.remove("d-flex");
    divSenha.classList.add("d-none"); 
    const divEmail = document.querySelector('.div-email');
    divEmail.classList.remove("d-flex");
    divEmail.classList.add("d-none");
    const divDeletar = document.querySelector('.div-deletar');
    divDeletar.classList.remove("d-flex");
    divDeletar.classList.add("d-none");
    const atualizarSenhaDiv = document.querySelector('.editar-div');
    atualizarSenhaDiv.classList.remove("d-none");
    atualizarSenhaDiv.classList.add("d-flex"); 
  });
}

const confirmarAtSenha = document.querySelector(".confirmar");

if(confirmarAtSenha){
    confirmarAtSenha.addEventListener("click", async function(event) {
      event.preventDefault();
        const senhaNova = document.getElementById("senhaNova").value.trim();
        await atualizarSenha(senhaNova);
    });
}

const banBtn = document.querySelector(".ban");

if(banBtn){
    banBtn.addEventListener("click", async function(event) {
      event.preventDefault();
      toastr.falha("Não é possivel alterar o email.");
    });
}

async function pegarUsuario(){
    const res = await fetch("https://apiserver-infoestado.onrender.com/getUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
    });
    const data = await res.json();
    
    if(data.success){
    	return data;
    }  else {
      let firebaseError = data.error;
      toastr.falha(firebaseError);
      return;
    }
}

async function verificaToken(){
  const res = await fetch("https://apiserver-infoestado.onrender.com/verificaToken", {
    method: "POST",
    credentials: "include"
  });
  return res.ok; 
}

async function carregarDados() {
    let data = '';
    const verificacaoUsuario = await verificaToken();

    if(!verificacaoUsuario) {
      window.location.href = 'https://luizagsoaress.github.io/InfoEstados/index.html';
      return;
    }
    else data = await pegarUsuario();
      
    if(!data) window.location.href = 'https://luizagsoaress.github.io/InfoEstados/index.html';
    
    let email = data.email;

    const inputEmail = document.querySelector('.input-email');
  
    if(email) inputEmail.placeholder = email;
}

document.addEventListener("DOMContentLoaded", async function() {
	carregarDados();
});

