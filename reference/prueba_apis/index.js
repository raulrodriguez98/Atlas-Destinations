container = document.getElementById("joke-container")

for (let i=0; i<10; i++) {
    // add a joke
    // get it 
    joke = fetch("https://api.chucknorris.io/jokes/random").then(response => response.json()).then(
        json => json.value
    ).then( function(joke) {
        // add it
        paragraph = document.createElement("p")
        paragraph.textContent = "Joke " + i + ": " + joke
        container.appendChild(paragraph)
    })
}