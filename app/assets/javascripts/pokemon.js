// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


PokemonApp.Pokemon = function(pokemonUri) {
    this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.prototype.render = function() {
    console.log("Rendering pokemon: #" + this.id);
    var self = this;
    $.ajax({
        url: "/api/pokemon/" + this.id,
        success: PokemonApp.Pokemon.handler
    });
};

PokemonApp.Pokemon.idFromUri = function(pokemonUri) {
    var uriSegments = pokemonUri.split("/");
    var secondLast = uriSegments.length - 2;

    return uriSegments[secondLast];
};


PokemonApp.Pokemon.handler = function(response) {
    self.info = response;

    $(".js-pkmn-name").text(self.info.name);
    $(".js-pkmn-number").text(self.info.pkdx_id);
    $(".js-pkmn-height").text(self.info.height);
    $(".js-pkmn-weight").text(self.info.weight);

    var img_uri = "http://pokeapi.co/media/img/" + self.info.pkdx_id + ".png";
    $(".js-pkmn-img").attr('src', img_uri);

    var generation = self.info.descriptions[0].name;
    var generationUri;
    for (var i = 0; i <= self.info.descriptions.length - 1; i += 1) {
        if ((self.info.descriptions[i].name).localeCompare(generation) == 1) {
            generation = self.info.descriptions[i].name;
            generationUri = self.info.descriptions[i].resource_uri;
        }
    }
    PokemonApp.Pokemon.prototype.renderImg(generationUri);
    $(".js-pkmn-generation").text(generation);
    $(".js-pokemon-modal").modal("show");

};

PokemonApp.Pokemon.prototype.renderImg = function(generationUri){
    $.ajax({
        url: "http://pokeapi.co/" + generationUri + "",
        success: function(response) {
            self.info = response;
            $('.js-pkmn-description').text(self.info.description);
        }
    });
}

$(document).on("ready", function() {

    $('.js-show-pokemon').on('click', function() {
        var $button = $(event.currentTarget);
        var pokemonUri = $button.data('pokemon-uri');

        var pokemon = new PokemonApp.Pokemon(pokemonUri);
        pokemon.render();
    });
});
