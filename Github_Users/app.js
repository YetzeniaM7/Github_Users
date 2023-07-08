//Declaro variables con un queryselector leyendo los valores que contienen los elementos a usar
const input = document.querySelector('#input');
const button = document.querySelector('#button');
const table = document.querySelector('#table');
const suggestions = document.querySelector('#suggestions');
const error = document.querySelector('#error');
const errorMessage = document.querySelector('#error-message');
const closeError = document.querySelector('#close-error');
let timeoutId;


// Funci贸n debounce para retrasar la ejecuci贸n de una funci贸n
function debounce(func, delay) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
}

//Se agrega la siguiente funci贸n con el proposito de que, cuando el cliente escriba un nombre de usuario, 
//se le mostraran 3 sugerencia relacionado a ese usuario

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

//Se agrega la siguiente funci贸n con el proposito de que, cuando el cliente escriba un nombre de usuario, 
//o presione el boton buscar devuelva los valores a la tabla

async function showSuggestions(value) {
   const response = await fetch(`https://api.github.com/search/users?q=${value}+in:login&per_page=3`);
   const json = await response.json();
   table.innerHTML = `
   <tr>
      <th>ID</th>
      <th>Foto</th>
      <th>Usuario</th>
      <th>Empresa</th>
      <th>Nombre</th>
      <th>Cant. Repositorios</th>
   </tr>`;
   if (json.items && json.items.length > 0) {
      // Mostrar la tabla
      table.style.display = 'table';
      // Ocultar el mensaje de error
      error.style.display = 'none';
      for (const item of json.items) {
         let x = `${item.login}`;
         let test = await read_users(x);
         const tr = document.createElement('tr');
         tr.innerHTML = `
         <td>${item.id}</td>
         <td><img src="${item.avatar_url}" width="100px"></td>
         <td>${item.login}</td>
         <td>${test.company}</td>
         <td>${test.name}</td>
         <td margin-right="50px">${test.public_repos}</td>`;
        table.appendChild(tr);
      }
   } else {
      // Ocultar la tabla
      table.style.display = 'none';
      // Mostrar el mensaje de error
      errorMessage.textContent = `No se encontraron resultados para "${value}"`;
      error.style.display = 'block';
   }
}
  
// Agregar un controlador de eventos click al bot贸n para cerrar el mensaje de error
closeError.addEventListener('click', () => {
   error.style.display = 'none';
});

//Agregar un controlador de eventos change para cuando cambie los datos del input devuelva la data a la tabla
input.addEventListener('change', () => {
   const value = input.value;
   debounce(() => showSuggestions(value), 300);
});

//Agregar un nuevo evento para pasarle el valor a la funcion showSearchSuggestions
input.addEventListener('input', () => {
  const value = input.value;
  debounce(() => showSearchSuggestions(value), 150);
});

//Agregar un nuevo controlador click
button.addEventListener('click', () => {
  const value = input.value;
  debounce(() => showSuggestions(value), 300);
});

//Se agrega la funci贸n con el objetivo de visualizar la cantidad de repositorio, 
//al igual que la compa帽ia del ususario, en caso que no tenga agregada, se reflejara N/A, y no (NULL)
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
