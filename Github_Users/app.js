const input = document.querySelector('#input');
const list = document.querySelector('#list');

let timeoutId;

// Función debounce para retrasar la ejecución de una función
function debounce(func, delay) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
}

//Se agrega la siguiente función con el proposito de que, cuando el cliente escriba un nombre de usuario, se le mostraran 3 sugerencia relacionado a ese nombre
async function showSearchSuggestions(value) {
    const response = await fetch(`https://api.github.com/search/users?q=${value}+in:login&per_page=3`);
    const json = await response.json();
    suggestions.innerHTML = '';
    if (json.items) {
      for (const item of json.items) {
        const option = document.createElement('option');
        option.value = item.login;
        suggestions.appendChild(option);
    }
  }
}

async function showSuggestions(value) {
  const response = await fetch(`https://api.github.com/search/users?q=${value}+in:login&per_page=3`);
  const json = await response.json();
  const table = document.querySelector('#table');
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Foto</th>
      <th>Usuario</th>
      <th>Empresa</th>
      <th>Nombre</th>
      <th>Cant. Repositorios</th>
    </tr>`;
  for (const item of json.items) {
    let x = `${item.login}`;
    let test = await read_users(x);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td><img src="${item.avatar_url}" width="50px"></td>
      <td>${item.login}</td>
      <td>${test.company}</td>
      <td>${test.name}</td>
      <td>${test.public_repos}</td>`;
    table.appendChild(tr);
  }
  console.log(`Buscando usuario con nombre: ${value}`);
}

input.addEventListener('input', () => {
  const value = input.value;
  debounce(() => showSearchSuggestions(value), 300);
});

button.addEventListener('click', () => {
  const value = input.value;
  debounce(() => showSuggestions(value), 300);
});

//Se agrega la función con el objetivo de visualizar la cantidad de repositorio, al igual que la compañia del ususario, en caso que no tenga agregada, se reflejara N/A, y no (NULL)
async function read_users(value_username){
  let company;
  await fetch('https://api.github.com/users/'+ value_username)
    .then(response => response.json())
    .then(json => {
      company = {
        company: json.company || "N/A",
        name: json.name || "N/A",
        public_repos: json.public_repos
      };
    });
  return company;
};
