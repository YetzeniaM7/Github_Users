const input = document.querySelector('#input');
const button = document.querySelector('#button');
const table = document.querySelector('#table');
const suggestions = document.querySelector('#suggestions');

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

//Modo oscuro
document.getElementById("luna").addEventListener("click", function() {
   document.body.classList.add("dark-mode");
});

//Remover modo oscuro
document.getElementById("sol").addEventListener("click", function() {
   document.body.classList.remove("dark-mode");
});

$("#input").autocomplete({
   source: function(request, response) {
       $.getJSON(`https://api.github.com/search/users?q=${request.term}+in:login&per_page=3`, function(data) {
           response($.map(data.items, function(item) {
               return {
                   label: item.login,
                   value: item.login
               };
           }));
       });
   },
   position: { my: "left top", at: "left bottom" },
   select: function(event, ui) {
       showSuggestions(ui.item.value);
   }
});

            
