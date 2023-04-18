const app = new Vue({
    el: '#app',
    data: {
        pokemonList: [],
        searchTerm: '',
        selectedPokemon: null,
        showPokemonList: false,
        selectedPokemonTop: 0,
        totalPokemon: 0,
    },
    created: function() {

        fetch('https://pokeapi.co/api/v2/pokemon/')
            .then(response => response.json())
            .then(data => {
                this.totalPokemon = `Total Pokemon: ${data.count}`;
                return Promise.all(data.results.map(pokemon => fetch(pokemon.url).then(response => response.json())));
            })
            .then(pokemonDataList => {
                this.pokemonList = pokemonDataList.map(pokemonData => {
                    return {
                        name: pokemonData.name,
                        image: pokemonData.sprites.front_default,
                        height: pokemonData.height,
                        weight: pokemonData.weight,
                    };
                });
            });
    },
    computed: {
        filteredPokemon: function() {

            if (this.searchTerm) {
                return this.pokemonList.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
                );
            } else {
                return this.pokemonList;
            }
        },
    },
    methods: {
        clickPokemon: function (pokemon, event) {

            this.selectedPokemon = pokemon;

            const card = event.target.closest('.pokemon-card');
            if (card) {
                const rect = card.getBoundingClientRect();
                this.selectedPokemonTop = `${rect.top + rect.height}px`;
            }
        },
        deletePokemon: function (name) {

            const index = this.pokemonList.findIndex(pokemon => pokemon.name === name);
            if (index !== -1) {
                this.pokemonList.splice(index, 1);
            }
        },
        togglePokemonList: function () {

            this.showPokemonList = !this.showPokemonList;
        },
        closePokemonCard: function () {

            this.selectedPokemon = null;
        },
        focusInput: function () {

            if (this.showPokemonList) {
                this.showPokemonList = false;
            } else {
                this.searchTerm = '';
                this.showPokemonList = true;
                this.$refs.search.focus();
            }
        },
    }
});