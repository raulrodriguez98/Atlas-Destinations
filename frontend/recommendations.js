// change this variable when deploying the system
deployed = false;

IP = deployed ? '18.191.243.66' : 'localhost';
API_URL = 'http://' + IP;

const weatherURL = "http://api.weatherapi.com/v1/current.json?key=7dc2c6b4b31d4f93a5f175018232604"
container = document.getElementById('recommendations')

destination = fetch(API_URL + ":3000/api/recommended").then(response => response.json()).then(function(json){
	for (var i=0; i<json.length; i++){
		recomendacion = document.createElement("div")
		paragraph = document.createElement("h2")
		paragraph.textContent = i+1 + ". " + json[i].name + ', ' + (json[i].original_search ? json[i].original_search : json[i].country)
		recomendacion.appendChild(paragraph)

		contenedor_horizontal = document.createElement("div")
		contenedor_horizontal.classList.add("recommendation")
		izda = document.createElement("div")
		izda.classList.add("izda")

		des = document.createElement("p")
		des.textContent = json[i].desc
		izda.appendChild(des)

		link = document.createElement("a")
		link.href = json[i].wiki
		link.textContent = json[i].wiki
		izda.appendChild(link)

		let tiempo = document.createElement("p")
		izda.appendChild(tiempo)
		fetch(weatherURL + "&q=" + json[i].lat +","+ json[i].long).then(response => response.json()).then(function(json){
			tiempo.textContent = 'Current weather conditions: ' + json.current.temp_c + " Cº, " + json.current.condition.text
		})

		img = document.createElement("img")
		img.src = json[i].img
		img.height = 400
		img.width = 600

		contenedor_horizontal.appendChild(izda)
		contenedor_horizontal.appendChild(img)
		recomendacion.appendChild(contenedor_horizontal)
		container.appendChild(recomendacion)
	} 
})