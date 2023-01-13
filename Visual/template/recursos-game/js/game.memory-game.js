// ----------------------------------------------------------------------------------
// Memory Game
// Dependências: game-helper.js
// ----------------------------------------------------------------------------------
$(document).ready(function () {
	var points = 0,
		finalScore = ($('.memory-game .flip-card').length) / 2;
	// Core
	function flipCard(target) {
		if (!target.hasClass("match") && !target.hasClass("selected")) {
			game.lock('.memory-game', 'on')

			target.addClass("flip selected");

			if ($(".memory-game").hasClass("active")) {
				altB = target.attr("data-n");
				console.log("altB: " + altB);

				if (game.check(altA, altB)) {

					points++;
					console.log("POINTS: " + points);

					setTimeout(function () {
						$(".memory-game .selected").addClass("match uk-animation-scale-down");

						setTimeout(function () {
							$(".memory-game .selected").removeClass("selected uk-animation-scale-down");

							if (points >= finalScore) {
								console.log("PARABÉNS!");

								$(".memory-game").removeClass("active")
								game.overlay('.memory-game', 'on-restart')
								// $(".memory-game .restart").removeClass("hidden").addClass("uk-animation-slide-bottom");
							} else {
								$(".memory-game").removeClass("active");
								game.lock('.memory-game', 'off')
							}

						}, 500);
					}, 500);
					console.log("MATCH: " + altA + " = " + altB);

				} else {

					$(".memory-game").removeClass("active");
					setTimeout(function () {
						$(".memory-game .selected").addClass("uk-animation-shake");
					}, 300);
					setTimeout(function () {
						$(".memory-game .selected").removeClass("flip selected uk-animation-shake");
						game.lock('.memory-game', 'off')
					}, 1000);

				}
			} else {
				$(".memory-game").addClass("active");
				setTimeout(function () {
					game.lock('.memory-game', 'off')
				}, 300);

				altA = target.attr("data-n");
				console.log("altA: " + altA);
			}
		}
	}
	// Events
	$(".memory-game .flip-card").on("click tap", function () {
		flipCard($(this));
	});

	// Start
	$(".memory-game .start").on("click tap", function () {
		game.shuffle(".memory-game .flip-card", "data-n")
		game.overlay('.memory-game', 'off-start')
		$(".memory-game").addClass("show-all")

		setTimeout(function () {
			$(".memory-game").removeClass("show-all")
			game.lock('.memory-game', 'off')
		}, 1000);
	});
	// Restart
	$(".memory-game .restart").on("click tap", function () {
		game.overlay('.memory-game', 'off-restart')

		points = 0;

		$(".memory-game .flip-card").removeClass("flip match")
		game.shuffle(".memory-game .flip-card", "data-n")

		setTimeout(function () {
			$(".memory-game").addClass("show-all")

			setTimeout(function () {
				$(".memory-game").removeClass("show-all")
				game.lock('.memory-game', 'off')
			}, 2000);
		}, 500);
	});
});