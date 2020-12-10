//selector and event listener
document.getElementById("myBtn").addEventListener("click", generate);
const pokedex = document.getElementById("pokedex");
console.log(pokedex);

//variables initialization
let myArray = [];
const promises = [];
const url = "https://pokeapi.co/api/v2/pokemon/";

function generateNum() {
    let number = Math.floor(Math.random() * 150);
}
//triggered when the button is pressed

    //random number
    let number = Math.floor(Math.random() * 150);
    console.log(number)
    myArray.push(number)
    document.getElementById("output").innerHTML = myArray;
    console.log(myArray)
    
    //fetch based on the array, string interpolation
    // PROBLEM: REPETITION FOREACH IS TRIGGERD EVERYTIME
    myArray.forEach(element => promises.push(fetch(`${url}${element}`).then((res) => res.json())));
    
    //manage the response from the API
    Promise.all(promises).then((results) => {
    //converting to an object the response
    const pokemon = results.map((data) => ({ 
        name: data.name,
        id: data.id,
        image: data.sprites["front_default"],
        type: data.types.map((type) => type.type.name).join(", ")

    }));
        displayPokemon(pokemon);
        
    });
    
    //show the pokemon in the DOM
    const displayPokemon = (pokemon) => {
        console.log(pokemon);
        const pokemonHTMLstring = pokemon.map((pokemon) => ` 
        <li class="card">
            <img class="card-image" src="${pokemon.image}"/>
            <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
            <p class="card-subtitle">Type: ${pokemon.type}</p>
        </li>
        `).join("");
        pokedex.innerHTML = pokemonHTMLstring;
    };

    // save the pokemon generated in the db
    