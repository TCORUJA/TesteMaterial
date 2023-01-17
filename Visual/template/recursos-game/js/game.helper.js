// ----------------------------------------------------------------------------------
// Game Helper
// Simples funções para os jogos e recursos interativos do MWU
// ----------------------------------------------------------------------------------
var game = (function () {
	// Game Lock / Overlay
	var lock = function (t, action, callback) {
		var target = $(t);
		switch (action) {
			case "on":
				target.addClass('blocked');
				break;
			case "off":
				target.removeClass('blocked');
				break;
		}
		if (callback) {
			callback();
		}
	}
	var overlay = function (t, action, callback) {
		var target = $(t);
		switch (action) {
			case "on": // ativa o overlay
				target.addClass('game-overlay');
				break;
			case "on-start": // ativa o overlay e o botão start aparece
				target.addClass('game-overlay');
				target.find(".start").removeClass("hidden").addClass("uk-animation-slide-bottom");
				break;
			case "on-restart": // ativa o overlay e o botão restart aparece
				target.addClass('game-overlay');
				target.find(".restart").removeClass("hidden").addClass("uk-animation-slide-bottom");
				break;
			case "off": // desativa o overlay
				target.removeClass('game-overlay');
				break;
			case "off-start": // desativa o overlay e o botão start some
				target.removeClass('game-overlay');
				target.find(".start").addClass("hidden");
				break;
			case "off-restart": // desativa o overlay e o botão restart some
				target.removeClass('game-overlay');
				target.find(".restart").addClass("hidden");
				break;
		}
		if (callback) {
			callback();
		}
	}
	// Check (Pontuação "A = B?")
	var check = function (a, b) {
		if (a === b) {
			return 1;
		} else {
			return 0;
		}
	}
	// Shuffle (Embaralhamento)
	var shuffle = function (targets, data) {
		var itens = $(targets).map(function () {
			return $(this).attr(data);
		}).get();
		console.log("Shuffle Links A: " + itens);

		function arrayShuffle(array) {
			for (var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
			return array;
		};
		itens = arrayShuffle(itens);
		console.log("Shuffle Links B: " + itens);

		$.each(itens, function (index, value) {
			$(targets).eq(index).attr(data, value);
			console.log("Shuffle " + data + " - " + index + " : " + value);
		});
	}

	return {
		lock: lock,
		overlay: overlay,
		check: check,
		shuffle: shuffle
	}
})();