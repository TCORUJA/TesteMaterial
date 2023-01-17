// ----------------------------------------------------------------------------------
// Word Search
// Dependências:
// - game-helper.js
// - Biblioteca Wordfind (https://github.com/bunkat/wordfind/blob/master/Readme.md):
//   para gerar o caça-palavras e marcar as palavras corretas.
// - Word Search jQuery (https://codepen.io/LoueeD/pen/WQxLYp?editors=1000):
//   para fazer as interações e jogabilidade.
// ----------------------------------------------------------------------------------
$(document).ready(function () {
	// Pega a lista de palavras
	// var wordlist = ['SEITON', 'SEIRI', 'SEISO', 'SEIKETSU', 'SHITSUKE'];
	// var wordlist = ['apple', 'grape', 'pizza', 'cake', 'sandwich'];
	var wordlist = $('.wordfind .word-list .word').map(function () {
			return $(this).text().toLowerCase();
		})
	// console.log('WL:'+wordlist)

	// Configurações do jogo
	var puzzle = wordfind.newPuzzle(wordlist, {
		allowedMissingWords: 0,
		// maxGridGrowth: 5,
		// fillBlanks: 'LAETITIA',
		// allowExtraBlanks: "random",
		maxAttempts: 100
	});

	// Cria o grid de letras e coloca as palavras
	// aleatoriamente testando as melhores possibilidades
	var drawPuzzle = function (el, puzzle) {
		var output = '';

		// for each row in the puzzle
		for (var i = 0, height = puzzle.length; i < height; i++) {

			// append a div to represent a row in the puzzle
			var row = puzzle[i];

			output += '<div>';
			// for each element in that row
			for (var j = 0, width = row.length; j < width; j++) {
				output += '<div class="letter" x="' + j + '" y="' + i + '">';
				output += row[j] || '&nbsp;';
				output += '</div>';
			}
			// close our div that represents a row
			output += '</div>';
		}

		$(el).html(output);
		// console.log(output);
	};
	drawPuzzle('.wordfind .grid', puzzle);

	// Marca as palavras corretas no grid "solucionando" o jogo e possibilitando interações.
	var markup = function (puzzle) {
		var solution = wordfind.solve(puzzle, wordlist).found;
		// console.log('Solution: ' + solution)

		for (var i = 0, len = solution.length; i < len; i++) {
			var word = solution[i].word,
				orientation = solution[i].orientation,
				x = solution[i].x,
				y = solution[i].y,
				next = wordfind.orientations[orientation];

			for (var j = 0, size = word.length; j < size; j++) {
				var nextPos = next(x, y, j);

				$('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').addClass(word);
				$('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').attr("data-word", function () {
					var attr = $(this).attr('data-word');
					if (typeof attr !== typeof undefined && attr !== false) {
						// console.log("tem")
						return attr + " " + word;
					} else {
						// console.log("não tem")
						return word;
					}
				});
				// console.log("W: " + $('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').attr("data-word"))
			}
		}
	};
	markup(puzzle);

	// --- The Game ---

	// Variables
	var wordsToFind = $('.wordfind .word-list .word').length,
		found = 0,
		clicking = false,
		colors = ['red', 'pink', 'yellow', 'cyan', 'purple', 'green', 'orange'],
		maxColors = 7,
		word,
		hasDataWord,
		selectedWords;

	// Functions
	function turnStart(target) {
		clicking = true;
		target.addClass('highlight');

		hasDataWord = target.attr('data-word');

		console.log('%c--- TURN START ---', 'color: #bada55')

		if (typeof hasDataWord !== typeof undefined && hasDataWord !== false) {
			return selectedWords = target.attr("data-word").split(" ")
		} else {
			return selectedWords = false
		}
	}
	function turnOver() {
		if (clicking) {
			console.log('%c--- TURN END ---', 'color: #ffda00')
			console.log(" ")
			clicking = false;
			$('.wordfind .grid .letter').removeClass('highlight');
		}
	}
	function playing(target) {
		if (clicking) {
			var $this = target;
			console.log("> Selected Words: " + selectedWords)

			$.each(selectedWords, function (index, value) {
				console.log("%c> Move - Word in Progress: "+"%c[" + index + "] " + value, 'color: #999', 'color: #f0f')

				hasDataWord = target.attr('data-word');
				if (typeof hasDataWord !== typeof undefined && hasDataWord !== false) {
					var lattr,
						dw = $this.attr('data-word').split(" ");

					$.each(dw, function (index, value) {
						if (typeof value !== typeof undefined && value !== false) {
							// console.log("> OK - Letter Data: [" + index + "] " + dw[index])
							return lattr = dw[index];
						} else {
							// console.log("> FAIL - Letter Data: [" + index + "] " + dw[index])
							return false;
						}
					});

					// console.log("lattr: " + lattr)

					if (lattr === value) {
						word = selectedWords[index];

						console.log("> OK - Letter Data: " + lattr + " = Value: " + value + " | Word = " + word)
					}
				} else {
					console.log("> FAIL - Letter Data: " + lattr + " =/= Value: " + value)
					word = false;
				}
			});

			// overlapWord = $this.hasClass(word);

			if (word) {
				console.log(">> Word still is " + word)

				// Toggle highlight to box on click
				$this.addClass('highlight');

				var wordLen = word.length, // How long is the word.
					$box = $('.wordfind .grid .letter.' + word); // Get all box's with word attribute.

				if ($('.wordfind .grid .letter.' + word + '.highlight').length == wordLen) {
					var random = Math.floor(Math.random() * maxColors);
					console.log("Random Color - No: " + random + " - Color: " + colors[random])
					// Word is fully highlighted, remove highlight and add class fount + [color]
					$box.removeClass('highlight').addClass('found txt-accent-2 m-txt-' + colors[random]);
					colors.splice(random, 1);
					maxColors--;

					// Add found class to the list item that contains "word"
					$('.wordfind .word-list .word:contains("' + word + '")').addClass('found');
					clicking = false;

					$('.wordfind .grid .letter').removeClass('highlight');
					found++;

					console.log('%c--- TURN END ---', 'color: #ffda00')
					console.log(" ")
					console.log('=> Score: '+ found + '/' + wordsToFind);

				}
			} else {
				console.log("No Words ¯|_(ツ)_/¯")
				console.log('=> Score: ' + found + '/' + wordsToFind);
			}

			if (found == wordsToFind) {
				// alert('Winner!');
				// $('#restart').show();
				game.lock('.game.wordfind', 'on')
				game.overlay('.game.wordfind', 'on-restart')
				console.log('=> Score: ' + found + '/' + wordsToFind);
			}
		}
	}

	// Events
	// -- Clicking
	$('.wordfind .grid .letter').on("mousedown", function () {
		turnStart($(this))
	});
	// -- Click Leave
	$(document).on("mouseup", function () {
		turnOver();
	})
	// -- Click & Move
	$('.wordfind .grid .letter').on("mouseover mouseenter", function () {
		playing($(this));
	});



	// $('#restart').click(function () {
	// 	$('.wordfind .grid .letter').attr('class', 'box');
	// 	$('#list li').removeClass('found');
	// 	$('#restart').hide();
	// 	found = 0;
	// });
	// -- Start
	$(".game.wordfind .start").on("click", function () {
		game.overlay('.game.wordfind', 'off-start')

		setTimeout(function () {
			$(".game.wordfind").removeClass("show-all")
			game.lock('.game.wordfind', 'off')
		}, 1000);
	});
	// -- Restart
	$(".game.wordfind .restart").on("click", function () {
		game.overlay('.game.wordfind', 'off-restart')

		points = 0;

		$(".game.wordfind .flip-card").removeClass("flip match")

		// setTimeout(function () {
			setTimeout(function () {
				game.lock('.game.wordfind', 'off')
			}, 2000);
		// }, 500);
	});
});