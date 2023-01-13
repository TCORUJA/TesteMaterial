// console.log("activities.js loaded");
$(document).ready(function () {
	var tries = 0,
		points = 0,
		qcount = 1,
		nextBtn = $(".exercicios .questions-nav .next");

	var score = (function () {
		var altSelect,
			altCorrect;

		var check = function (as, ac) {
			altSelect = as;
			altCorrect = ac;
			if (altSelect === altCorrect) {
				// console.log("Acertou! -> s: "+ altSelect + " = c: "+altCorrect);
				return 1;
			} else {
				// console.log("Errou! -> s: " + altSelect + " = c: " + altCorrect);
				return 0;
			}
		}

		var percent = function (corrects, selecteds) {
			var calc = (100 * corrects) / selecteds,
				finalPercent = parseFloat(calc.toFixed(2));

			return finalPercent;
		}

		return {
			check: check,
			percent: percent
		}
	})();

	function InViewport(el) {
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		);
	}

	function scrollTo(target) {
		var targetOffset = target.offset().top;
		var offset = window.innerHeight-100;
		$("html, body").animate({
			scrollTop: targetOffset-offset
		}, 1000);
		// console.log("Scroll: " + targetOffset);
	}

	$(".exercicios .questions .alt").on("click", function () {
		var sc = $(".exercicios #screen-"+qcount);
		// console.log(sc);
		if (sc.hasClass("uk-active")) {
			// console.log("Tries: " + tries + " | Points: " + points + " | Screen: #screen-" + qcount);

			altSelect = $(this).data("a");
			altCorrect = $(".exercicios .questions-nav .screen-"+qcount).data("correct");

			if (!sc.hasClass("finished")) {
				tries++;

				if (score.check(altSelect, altCorrect)) { // certo
					$(".exercicios .questions #screen-"+qcount).addClass("finished");
					$(".exercicios .questions-nav .next").removeClass("opacity-0");

					$(".exercicios .questions #screen-"+qcount+" .alt .alt-feedback").addClass("wrong");
					$(this).children(".alt-feedback").removeClass("wrong").addClass("correct");

					$(".exercicios .questions-nav .screen-"+qcount).next(".uk-disabled").removeClass("uk-disabled");

					points++;
					qcount++;
					// console.log("Tries: " + tries + " | Points: " + points + " | Screen: #screen-" + qcount);
				} else { // errado
					$(this).children(".alt-feedback").addClass("wrong");
				}
			}
			// console.log("Tries: " + tries + " | Points: " + points);
		}
		setTimeout(function () {
			if (!nextBtn.hasClass("opacity-0") && !InViewport(nextBtn)) {
				scrollTo(nextBtn);
			}
			// console.log("Scroll /o/ - " + InViewport(nextBtn))
		}, 500)
	});

	$('.exercicios .questions-nav a').on("click", function (event) {
		event.preventDefault();
		var $t = $(this);
		if ($t.hasClass('next')) {
			$(".exercicios .questions-nav .next").addClass("opacity-0");
			UIkit.switcher($('.exercicios .uk-subnav')).show('next');
		} else if (!$t.parent().hasClass('uk-active') && !$t.parent().hasClass('uk-disabled')) {
			$(".exercicios .questions-nav .next").addClass("opacity-0");
		}
	});

	$(".exercicios .feedback-final").on("show", function () {
		var pf = score.percent(points, tries) || 0;
		// console.log("Porcentagem Final: "+ pf +"%");

		$(".exercicios .feedback-final .tries-txt").html("<strong>" + tries + "</strong>");
		$(".exercicios .feedback-final .points-txt").html("<strong>" + points + "</strong>");
		$(".exercicios .feedback-final .percent-txt").html("<strong>" + pf + "</strong>");
		$(".exercicios .feedback-final .donut-svg #d-two-svg .circle-svg").css("stroke-dasharray", (pf == 100 ? 110 : pf)+" 100");
	});
});