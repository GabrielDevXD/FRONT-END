const baseURL = 'http://localhost:3000/roupas';

async function findAllroupas() {
  const response = await fetch(`${baseURL}/find-roupas`);

  const roupas = await response.json();

  roupas.forEach((roupas) => {
    document.getElementById('roupasList').insertAdjacentHTML(
      'beforeend',
      `<div class="row">
            <div class="roupasListaItem" id="roupasListaItem_${roupas.id}">
              <h2>${roupas.nome}</h2>
              <div class="roupasListaItem__preco">R$ ${roupas.preco}</div>
              <p>${roupas.descricao}</p>
              <img class="roupasListaItem__foto" src=${roupas.foto}
              <div class="roupaslistaitem__buttons">
              <button class ="editar btn"onclick="abrirModal(${roupas.id})">Editar</button>
              <button class ="apagar btn"onclick="abrirModalDelete(${roupas.id})">Apagar</button>
              </div>
            </div>`,
    );
  });
}

async function FindByIdRoupas() {
  const id = document.querySelector('#idroupas').value;

  const response = await fetch(`${baseURL}/find-roupas/${id}`);
  const roupas = await response.json();
  const divopacidade = (document.querySelector('#roupasList').style.opacity =
    '0');
  const roupaEscolhidaDiv = document.querySelector('#roupaEscolhida');

  roupaEscolhidaDiv.innerHTML = `<div class="roupasListaItem">
  <div>
      <div class="roupasListaItem__nome">${roupas.nome}</div>
      <div class="roupasListaItem__preco">R$ ${roupas.preco}</div>
      <div class="roupasListaItem__descricao">${roupas.descricao}</div>
    </div>
      <img class="roupasListaItem__foto" src=${
        roupas.foto
      } alt=${`roupas de ${roupas.preco}`} />
  </div>`;
}
findAllroupas();

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector('#title-header-modal').innerHTML =
      'Atualizar uma roupas';
    document.querySelector('.test').innerHTML = 'Atualizar';

    const response = await fetch(`${baseURL}/find-roupas/${id}`);
    const roupas = await response.json();

    document.querySelector('#nome').value = roupas.nome;
    document.querySelector('#preco').value = roupas.preco;
    document.querySelector('#descricao').value = roupas.descricao;
    document.querySelector('#foto').value = roupas.foto;
    document.querySelector('#id').value = roupas.id;
  } else {
    document.querySelector('#title-header-modal').innerHTML =
      'Cadastrar uma roupas';
    document.querySelector('.test').innerHTML = 'Cadastrar';
  }
  document.querySelector('.modal-overlay').style.display = 'flex';
}

function fecharModalCadastro() {
  document.querySelector('.modal-overlay').style.display = 'none';

  document.querySelector('#nome').value = '';
  document.querySelector('#preco').value = '';
  document.querySelector('#descricao').value = 0;
  document.querySelector('#foto').value = '';
  document.querySelector('#id').value = '';
}

// updatazada
async function addroupas() {
  const id = document.querySelector('#id').value;
  const nome = document.querySelector('#nome').value;
  const preco = document.querySelector('#preco').value;
  const descricao = document.querySelector('#descricao').value;
  const foto = document.querySelector('#foto').value;

  const roupas = {
    id,
    nome,
    preco,
    descricao,
    foto,
  };

  const modo = id > 0;

  const endpoint = baseURL + (modo ? `/update/${id}` : `/create`); 

  const response = await fetch(endpoint, {
    method: modo ? 'put' : 'post',
    headers: {
      'content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(roupas),
  });

  const newroupas = await response.json();

  const html = `
  <div class="row">
            <div class="roupasListaItem" id="roupasListaItem_${roupas.id}">
              <h2>${newroupas.nome}</h2>
              <div class="roupasListaItem__preco">R$ ${newroupas.preco}</div>
              <p>${newroupas.descricao}</p>
              <img class="roupasListaItem__foto" src=${newroupas.foto}
              <div class="roupaslistaitem__buttons">
              <button class ="editar btn"onclick="abrirModal(${newroupas.id})">Editar</button>
              <button class ="apagar btn"onclick="abrirModalDelete(${newroupas.id})">Apagar</button>
              </div>
            </div>
  `;

  if (modo == true) {
    document.querySelector(`#roupasListaItem_${id}`).outerHTML = html;
  }
  if (modo == false) {
    document.querySelector('#roupasList').insertAdjacentHTML('beforeend', html);
  }

  fecharModalCadastro();
}


function abrirModalDelete(id) {
  document.querySelector('#overlay-delete').style.display = 'flex';

  const btnDelete = document.querySelector('#teste');

  btnDelete.addEventListener('click', function () {
    deleteroupas(id);
  });
}

function fecharModalDelete() {
  document.querySelector('#overlay-delete').style.display = 'none';
}

async function deleteroupas(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  const result = await response.json();


  document.querySelector('#roupasList').innerHTML = '';

  fecharModalDelete();
  findAllroupas();
}
