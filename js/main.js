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

document.addEventListener("click", (e) => {
	if (e.target && e.target.id === "erro-mensagem") {
		e.preventDefault();
		Swal.update({
			footer: `<span style="color:#b2341d; font-weight:bold;">Código de erro: ${firebaseError}</span>`
		});
	}
});

async function addDocUsuario(estado, id) {
	try {
		const res = await fetch("https://apiserver-infoestado.onrender.com/adicionarEstados", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ estado, id }),
			credentials: "include"
		});
	} catch (e) {
		console.error("Erro ao adicionar: ", e);
	}
}

async function carregarEstados() {
	try {
		const res = await fetch("https://apiserver-infoestado.onrender.com/carregarEstados", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include"
		});

		const estados = await res.json();
		console.log(estados);

		const divDesenho = document.querySelector('.div-desenho');
		if (divDesenho != null) {
			divDesenho.innerHTML = '';
		} if(estados.estados.length <= 0) {
			return;
		}

		estados.estados.forEach((e) => {
			desenharEstadoDiv(e.estado, e.id);
		});

		chamadaApiOrdenar();
	} catch (e) {
		console.error("Erro:", e);
	}
}

const estadoSelect = document.querySelector('.estados');

async function chamadaApiOrdenar() {
	const container = document.querySelector('.div-desenho');
	const nomes = Array.from(container.children).map(div => div.id);
	const res = await fetch("https://apiserver-infoestado.onrender.com/api/ordenar", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ itens: nomes })
	});

	const data = await res.json();
	const resposta = data.resultado;

	resposta.forEach(nome => {
		const div = document.getElementById(nome.trim());
		if (div) {
			container.appendChild(div);
		}
	});
}

async function desenharEstadoDiv(estado, idPersonalizado = null) {
	const btn = document.createElement("button");
	btn.id = idPersonalizado || estado;
	btn.style.display = "block";
	btn.style.margin = "0";
	btn.style.width = "100%";
	btn.style.height = "60px";
	btn.style.padding = "0 22px";
	btn.style.background = "#e2ede065";
	btn.style.border = "1px solid #9be08f";
	btn.style.cursor = "pointer";
	btn.style.transition = "all 0.25s ease";
	btn.style.fontWeight = "700";
	btn.style.fontSize = "1rem";
	btn.style.color = "black";
	btn.style.boxSizing = "border-box";
	btn.textContent = estado;
	const divDesenho = document.querySelector('.div-desenho');
	divDesenho.appendChild(btn);
	addDocUsuario(estado, btn.id);

	btn.addEventListener("click", async function(event) {
		const res = await fetch("https://luizagsoaress.github.io/InfoEstados/json/info.json", {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		});

		const data = await res.json();
		const info = data.categorias[estado];
		const infoModalBody = document.querySelector('.infoModalBody');
		infoModalBody.innerHTML = '';

		const h1 = document.createElement("h1");
		h1.style.fontSize = "1.3rem";
		h1.style.fontWeight = "600";
		h1.style.color = "black";
		h1.textContent = info.subtitulo;

		infoModalBody.appendChild(h1);

		const conteudoJson = [ {
				titulo: "Informações:",
				campos: [
					info.descricao.capital,
					[info.descricao.governador[0], info.descricao.governador[1] + " [2025]"],
				]
			},
			{
				titulo: "População:",
				campos: [
					info.descricao.populacao.populacao_ultimo_censo,
					info.descricao.populacao.populacao_estimada,
					info.descricao.populacao.densidade_demografica,
					info.descricao.populacao.total_de_veiculos,
				]
			},
			{
				titulo: "Educação:",
				campos: [
					info.descricao.educacao.ideb_anos_iniciais,
					info.descricao.educacao.ideb_anos_finais,
					info.descricao.educacao.matriculas_fundamental,
					info.descricao.educacao.matriculas_ensino_medio,
					info.descricao.educacao.docentes_ensino_fundamental,
					info.descricao.educacao.docentes_ensino_medio,
					info.descricao.educacao.numero_estabelecimento_fundamental,
					info.descricao.educacao.numero_estabelecimento_medio,
				]
			},
			{
				titulo: "Trabalho e Rendimento:",
				campos: [
					info.descricao.trabalho_e_rendimento.rendimento_nominal,
					info.descricao.trabalho_e_rendimento.pessoas_16oumais_ocupadas_semana_referencia,
					info.descricao.trabalho_e_rendimento.pessoas_16oumais_trabalho_formal,
					info.descricao.trabalho_e_rendimento.pessoas_14oumais_ocupadas_semana_referencia,
					info.descricao.trabalho_e_rendimento.rendimento_real_medio,
					info.descricao.trabalho_e_rendimento.pessoal_ocupado_administracao,
				]
			},
			{
				titulo: "Economia:",
				campos: [
					info.descricao.economia.indice_desenvolvimento_humano,
					info.descricao.economia.total_receita_bruta,
					info.descricao.economia.total_receita_empenhadas,
					info.descricao.economia.numero_agencia,
					info.descricao.economia.depositos_prazo,
					info.descricao.economia.depositos_vista,
				]
			},
			{
				titulo: "Território:",
				campos: [
					info.descricao.territorio.numero_municipios,
					info.descricao.territorio.area_unidade_territorial,
					info.descricao.territorio.area_urbanizada,
				]
			},
		];

		conteudoJson.forEach(section => {
			const h1 = document.createElement("h1");
			h1.style.color = "black";
			h1.style.fontSize = "1.0rem";
			h1.style.fontWeight = "900";
			h1.style.margin = "1.0rem 0.4rem";
			h1.textContent = section.titulo;
			infoModalBody.appendChild(h1);

			section.campos.forEach(campo => {
				const p = document.createElement("p");
				p.style.textAlign = "left";
				p.style.margin = "0.3rem 0.8rem";
				const termo = document.createElement("span");
				termo.style.fontWeight = "900";
				termo.textContent = campo[0] + " ";
				const termo2 = document.createElement("span");
				termo2.textContent = campo[1];
				p.appendChild(termo);
				p.appendChild(termo2);
				infoModalBody.appendChild(p);
			});
		});

		const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('.infoModal'));
		modal.show();
	});
}

const btnAdd = document.querySelector('.btn-add');
const btnInverso = document.querySelector('.btn-inverso');

document.querySelector('.btn-adicionar').addEventListener("click", function() {
	const divId = document.querySelector('.estados').options[document.querySelector('.estados').selectedIndex].text;
	if (document.getElementById(divId)) {
		toastr.falha("Você já adicionou este estado.");
		return;
	}
	let estadoSelect = document.querySelector('.estados').value;
	if (!estadoSelect) {
		document.querySelector('.alert-danger').style.display = "flex";
		setTimeout(() => {
			document.querySelector('.alert-danger').style.display = "none";
		}, 3000);
	} else {
		form2.style.display = "none";
		divDesenho.style.display = "flex";
		btnAdd.style.display = "flex";
		btnInverso.style.display = "flex";
		estadoSelect = document.querySelector('.estados').options[document.querySelector('.estados').selectedIndex].text;
		desenharEstadoDiv(estadoSelect);
		setTimeout(() => chamadaApiOrdenar(), 100);
	}
});

document.querySelector('.searchBox').addEventListener("keyup", function(event) {
	const termo = event.target.value.toLowerCase().trim();
	const botoes = document.querySelectorAll(".div-desenho button");
	if (termo === "") {
		botoes.forEach(btn => {
			btn.style.backgroundColor = "#e2ede065";
		});
		return;
	}

	botoes.forEach(btn => btn.style.backgroundColor = "white");
	for (let btn of botoes) {
		if (btn.id.toLowerCase().includes(termo)) {
			btn.scrollIntoView({ behavior: "smooth", block: "center" });
			btn.style.transition = "background-color 0.5s";
			btn.style.backgroundColor = "#9bcc925b";
			break;
		}
	}
});

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
    }else data = await pegarUsuario();
      
    if(!data) window.location.href = 'https://luizagsoaress.github.io/InfoEstados/index.html';
}

const form1 = document.querySelector('.form1');
const form2 = document.querySelector('.form2');
const divDesenho = document.querySelector('.div-desenho');

document.addEventListener('DOMContentLoaded', function() {
	carregarDados();
	carregarEstados();

	if (localStorage.getItem("situacao") === "success") {
		localStorage.removeItem("situacao");
	}

	if (btnAdd && form1 && form2) {
		btnAdd.addEventListener("click", function(event) {
			event.preventDefault();
      		form2.style.display = "flex";
			divDesenho.style.display = "none";
			btnAdd.style.display = "none";
			btnInverso.style.display = "none";
		});
	}

	document.querySelector('.btn-mapa').addEventListener("click", function(event) {
		event.preventDefault();
		const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('.mapaModal'));
		modal.show();
	});

	btnInverso.addEventListener("click", function() {
		const container = document.querySelector('.div-desenho');
		const divs = Array.from(container.children);
		divs.reverse().forEach(div => container.appendChild(div));
	});
});
