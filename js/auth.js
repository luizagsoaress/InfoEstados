"use strict";

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

function googleID() {
	google.accounts.id.initialize({
		client_id: "639151273124-71p2uri5p1dvq20bq8q4oj451nqkei7q.apps.googleusercontent.com",
		callback: loginGoogle
	});

	google.accounts.id.prompt();
}

async function loginGoogle(response) {
	const id_token = response.credential;
	const res = await fetch("https://apiserver-infoestado.onrender.com/google", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id_token }),
    credentials: "include"
	});

	const data = await res.json();

	if (data.success) {
    window.location.href = "https://luizagsoaress.github.io/InfoEstados/html/main.html";
	} else {
		toastr.falha("Não foi possivel entrar com o Google nesse momento.");
	}
}

const googleBtn = document.querySelector(".google-btn");
if(googleBtn) {
  googleBtn.addEventListener("click", function(event) {
    event.preventDefault();
    googleID();
  });
}

function githubAcess() {
	const clientId = "Ov23litSgGWD80KWCFW7";
	const redirectUri = "https://luizagsoaress.github.io/InfoEstados/html/callback.html";
	const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
	window.open(authUrl, "_blank", "width=500,height=600");

	window.addEventListener("message", (event) => {
		if (event.origin !== "https://luizagsoaress.github.io") return;
		const data = event.data;
		if (data.success) {
			localStorage.setItem("token", data.token);
			localStorage.setItem("uid", data.uid);
			window.location.href = "https://luizagsoaress.github.io/InfoEstados/html/main.html";
		}
	});
}

const githubBtn = document.querySelector(".github-btn");
if(githubBtn) {
  githubBtn.addEventListener("click", function(event) {
    event.preventDefault();
    githubAcess();
  });
}

async function loginEmailSenha(email, password) {
	const res = await fetch("https://apiserver-infoestado.onrender.com/loginUser", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
    	credentials: "include",
		body: JSON.stringify({ email, password })
	});

	const data = await res.json();

	if (data.success) {
		toastr.sucesso("Entrando na sua conta...");
		setTimeout(() => {
			window.location.href = "https://luizagsoaress.github.io/InfoEstados/html/main.html";
		}, 2000);
	} else {
		console.log(data.error);
		toastr.falha("Não foi possivel fazer login nesse momento.");
	}
}

async function criarEmailSenha(email, password) {
	const res = await fetch("https://apiserver-infoestado.onrender.com/createUser", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password })
	});

	const data = await res.json();

	if (data.success) {
		loginEmailSenha(email, password);
	} else {
    	console.log(data.error);
		toastr.falha("Não foi possivel criar sua conta nesse momento.");
	}
}

async function resetarSenha(email) {
	const res = await fetch("https://apiserver-infoestado.onrender.com/recuperar", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
    credentials: "include"
	});

	const data = await res.json();

	if (data.success) {
		toastr.sucesso("Email de recuperação enviado!");
	} else {
		toastr.falha("O email informado está incorreto. Verifique e tente novamente.");
	}
}

document.addEventListener('DOMContentLoaded', function() {

	const formLogin = document.querySelector(".form-login");
	const formCadastro = document.querySelector(".form-cadastro");
	const formRecuperar = document.querySelector(".form-recuperar");

	if (formLogin) {
		formLogin.addEventListener("submit", function(event) {
			event.preventDefault();
			const email = document.querySelector(".input-email").value.trim();
			const password = document.querySelector(".input-senha").value.trim();
			loginEmailSenha(email, password);
		});
	}

	if (formCadastro) {
		formCadastro.addEventListener("submit", function(event) {
			event.preventDefault();
			const email = document.querySelector(".input-email").value.trim();
			const password = document.querySelector(".input-senha").value.trim();
			criarEmailSenha(email, password);
		});
	}

  if (formRecuperar) {
		formRecuperar.addEventListener("submit", function(event) {
			event.preventDefault();
			const email = document.querySelector(".input-email").value;
			resetarSenha(email);
		});
	}

});

window.googleID = googleID;
window.githubAcess = githubAcess;
window.loginGoogle = loginGoogle;
window.loginEmailSenha = loginEmailSenha;