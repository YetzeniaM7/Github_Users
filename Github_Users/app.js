const input = document.querySelector('#input');
const list = document.querySelector('#list');

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this , args);
    }, delay);
  };
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

const showSuggestionsDebounced = debounce (showSuggestions, 500);

input.addEventListener('input', () => {
  const value = input.value;
  showSuggestionsDebounced(value);
});
