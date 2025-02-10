const search = document.getElementById("search-btn");
var selectedResult = null;

search.onclick = async function(){
	let other_search = document.getElementById("search-bar");
	other_search.value = '';
	let input = document.getElementById("input-busqueda")
	let text = input.value;
	
	if (text == ''){
		return;
	}

	let url = `http://localhost:3000/api/proximity?name=${text}`;
	let response = await fetch(url);

	if(response.status == 200){
		data = await response.json();
		nombre = data.geoname;
		pais = data.country;
		destinos = data.destinations;

		notification = `
		<div id="exito">
		<b>${nombre}, ${pais}</b>
		<p id="noti-paragraph">${destinos.length} resultados</p>
		</div>
		`;
		notifications = document.getElementById("notification-container");
		notifications.innerHTML = notification;

		// Añadir monumentos o zonas de interés a la izquierda
		resultados = document.getElementById("resultados");

		while (resultados.firstChild) {
		  resultados.removeChild(resultados.firstChild);
		}

		let nombre2 = document.getElementById("nombre-detalle");
		let img2 = document.getElementById("img-detalle");
		let desc2 = document.getElementById("desc-detalle");
		nombre2.textContent = "";
		img2.src = null;
		desc2.textContent = "";

		destinos.forEach(destino => {
			let div = document.createElement("div");
			div.classList.add("resultado");
			div.innerHTML = `
			<b>${destino.name}</b>
			<p>${destino.categories.replaceAll(",",", ").replaceAll("_"," ")}</p>
			`
			resultados.appendChild(div);

			// Añadir detalles a la derecha
			div.onclick = async () => {
				
				if (selectedResult != null){
					selectedResult.classList.remove("seleccionado");
				}
				selectedResult = div;
				div.classList.add("seleccionado");

				let nombre = document.getElementById("nombre-detalle");
				let img = document.getElementById("img-detalle");
				let desc = document.getElementById("desc-detalle");
				let url = `http://localhost:3000/api/properties?xid=${destino.xid}`;
				destino = await fetch(url).then(response => (response.json()))
				nombre.textContent = destino.name;
				img.src = destino.img;
				desc.textContent = destino.desc;
			}
		})
	}
	else{
		notifications = document.getElementById("notification-container");
		notifications.innerHTML = `<div id="fracaso">Ńo se ha encontrado este lugar.</div>`
	}
};


searchBar = document.getElementById("input-busqueda");
searchBar.addEventListener('keydown', function(event){
  if (event.key === 'Enter') {
    search.onclick();
  }
});

const search_bar = document.getElementById("search-bar");
const search_btn = document.getElementById("btn-busqueda");

search_btn.onclick = function(){
	searchBar.value = search_bar.value;
	search.onclick();
};

search_bar.addEventListener('keydown', function(event){
  if (event.key === 'Enter') {
    search_btn.onclick();
  }
});

window.onload = function() {
  // Código a ejecutar cuando la página se carga completamente
  const url = new URL(window.location.href);
  const queryValue = url.searchParams.get('searchTerm');
  if (queryValue){
  	searchBar.value = queryValue;
  	search.onclick();
  }
};