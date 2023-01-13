// console.log("main.js loaded");
var uni = (function () {
	var template = $("body").data("template");
	switch (template) {
		case 'grd':
			// Active Template Class
			$("body").addClass(template);
			// $("body").addClass("scroll-nav");
			// console.log("Template: "+template);
		break;
		case 'pos':
			$("body").addClass(template);
			// $("body").addClass("switcher-nav");
			if ($("body").hasClass("switcher-nav")) {
				var prevScreen = $(".content-index li[class*='active'] a").data("switcher");
				var activeScreen = $(".content-index li[class*='active'] a").data("switcher");
			}
			// console.log("Template: " + template);
		break;
		case 'pos100':
			$("body").addClass(template);
			// $("body").addClass("switcher-nav");
			if ($("body").hasClass("switcher-nav")) {
				var prevScreen = $(".content-index li[class*='active'] a").data("switcher");
				var activeScreen = $(".content-index li[class*='active'] a").data("switcher");
			}
			// console.log("Template: " + template);
		break;
	}

	var hideTopbar = function () {
		var wstPrev = $(window).scrollTop()
		$(window).scroll(function () {
			var wstNow = $(window).scrollTop();

			// console.log('scrolling ', wstPrev, wstNow, dh);

			if (wstPrev > wstNow) {
				$('.top-bar').removeClass('hide');
			} else {
				$('.top-bar').addClass('hide');
			}
			wstPrev = wstNow;

			return hideTopbar;
		});
	}

	// Cover Start Animation
	var coverAnimate = function () {
		$("#cover").addClass("uk-animation-slide-top uk-animation-reverse");
		$("#main-content").addClass("uk-animation-fade");

		// UIkit.switcher($('.content-index')).show(screen);

		setTimeout(function () {
			$("#cover").addClass("hidden");
			$("#uni").removeClass("cover-lock");
		}, 1000);

		uni.activeNav(0);
		uni.loopNav(0);

		return coverAnimate;
	}

	// Scroll Navigation
	var scrollNav = function () {
		$.scrollify({
			section: '.section',
			sectionName: 'section',
			easing: "easeOutExpo",
			standardScrollElements: ".scroll-defaut",
			// interstitialSection: "",
			offset: 0,
			scrollSpeed: 500,
			scrollbars: true,
			setHeights: true,
			overflowScroll: true,
			updateHash: false,
			touchScroll: false,
			before: function (index, sections) {
				// console.log("Before Index: " + index);
			},
			after: function (index, sections) {
				// console.log("After Index: " + index);
				$.scrollify.update()
			},
			afterResize: function () {
				// console.log("After Render: Update");
				$.scrollify.update();
			},
			afterRender: function () {
				// console.log("After Render: Update");
				$.scrollify.update();
			}
		});

		// Atualiza o tamanho das seções de acordo com o conteúdo
		// $(window).resize(function () {
		// 	$.scrollify.update();
		// });
		$(".section").on("click", function () {
			$.scrollify.update();
		});

		return scrollNav;
	}

	var switcherNav = function () {
		// console.log("Screen: " + activeScreen);
		// console.log("Prev Screen: " + prevScreen);
		// console.log(" -- START -- ");

		prevScreen = $(".content-index li[class*='active'] a").data("switcher");

		// Screen Switch
		$(".nav-switcher [data-switcher]").on("click", function (e) {
			e.preventDefault();
			var n = $(this).data("switcher");

			// console.log("Screen: " + activeScreen);
			// console.log("Prev Screen: " + prevScreen);
			// console.log(" ");

			if (n !== "undefined" || n !== "") {
				UIkit.switcher($('.content-index')).show(n);
				activeScreen = $(".content-index li[class*='active'] a").data("switcher");

				// console.log("Screen: " + activeScreen);
				// console.log("Prev Screen: " + prevScreen);

				if (activeScreen !== prevScreen) {
					uni.activeNav(activeScreen);
					uni.loopNav(activeScreen);
					$(document).scrollTop(0);

					// console.log("=/=");

					prevScreen = activeScreen;
					// console.log("Screen: " + activeScreen);
					// console.log("Prev Screen: " + prevScreen);
				}
			}
		});

		return switcherNav;
	}

	var activeNav = function (n) {
		$(".nav-switcher [data-switcher]").removeClass("active");
		$(".nav-menu li [data-switcher=" + n + "]").addClass("active");

		return activeNav;
	}

	var loopNav = function (n) {
		// console.log(":B");
		if ($(".content-nav").hasClass("no-loop")) {
			var firstScreen = $(".content-index li").first().index();
			var lastScreen = $(".content-index li").last().index();
			// console.log("FS: " + firstScreen + " | LS: " + lastScreen);
			if (n === lastScreen) {
				$(".content-nav a").removeClass("hidden");
				$(".content-nav .next").addClass("hidden");
				// console.log("Ultima tela: " + n);
			} else if (n === firstScreen) {
				$(".content-nav a").removeClass("hidden");
				$(".content-nav .previous").addClass("hidden");
				// console.log("Primeira Tela: " + n);
			} else {
				$(".content-nav a").removeClass("hidden");
				// console.log("Outra Tela: " + n);
			}
		}

		return loopNav;
	}

	// Content Controller
	var contentController = function () {
		var contents = $("#main-content > .section")
			.map(function () { return this.id; }) // convert to set of IDs
			.get();

		// console.log("CC IDs " + contents);

		var contentLinks = $("#uni .nav-menu:first [class*='nav-link'] a")
			.map(function () { return $(this).attr("href").replace("#", ""); }) // convert to set of IDs
			.get(); // convert to instance of Array (optional)

		// console.log("CC Links " + contentLinks);

		var contentOff = $("#main-content > .section[data-cc='off']")
			.map(function () { return this.id; }) // convert to set of IDs
			.get();

		// console.log("CC OFF ARR: ["+contentOff+"]");

		function compareArrays(arr1, arr2) {
			return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0
		};

		if (!compareArrays(contents, contentLinks)) {
			$.grep(contentLinks, function (el) {
				if ($.inArray(el, contents) == -1) {
					contentOff.push(el);
					// console.log("CC OFF ARR: [" + contentOff + "]");
				}
			});
		}

		$.each(contentOff, function (index, value) {
			// console.log("CC Link OFF EL: " + contentLinks.indexOf(value) + " : " + value);
			// console.log("CC ID OFF EL: " + contents.indexOf(value) + " : " + value);

			if (contentLinks.indexOf(value) > -1) {
				contentLinks.splice(contentLinks.indexOf(value), 1);
			}
			if (contents.indexOf(value) > -1) {
				contents.splice(contents.indexOf(value), 1);
			}

			$("#"+value).remove();
			$("[class*='nav-link'] [href$='#"+value+"']").parent().remove();
			// console.log("CC IDs " + contents);
			// console.log("CC Links " + contentLinks);
			// console.log("CC OFF ARR: [" + contentOff + "] | CC OFF Length: " + contentOff.length);
		});

		$.each(contentLinks, function (index, value) {
			// console.log("CC Links " + index + " : " + value);
			$("[class*='nav-link'] [href$='#" + value + "']").attr("data-switcher", index);
		});

		$.each(contents, function (index, value) {
			// console.log("CC IDs: " + index + " : " + value);
			$("#"+value).addClass("ok");
		});

		// console.log("CC Links " + contentLinks);
		// console.log("CC IDs " + contents);

		return contentController;
	}

	// Players Audio & Video
	var players = Plyr.setup('.js-player');

	// Scroll to Target
	jQuery.fn.extend({
		scrollTo: function (speed, easing) {
			return this.each(function () {
				var targetOffset = $(this).offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				}, speed, easing);
			});
		}
	});

	// Height Calc
	var heightCalc = function () {
		$('[data-sizev="fit-content"]').each(function () {
			var inner = $('[data-sizev="fit-content"] [data-sizev="target"]');
			$('[data-sizev="fit-content"]').height(inner.outerHeight(true));
			// console.log("H:" + $(this).innerHeight());
			// $(this).height(inner.outerHeight(true));
			// $(this).width(inner.outerWidth(true));
		});

		return heightCalc;
	}
	$(window).on('resize', function () {
		heightCalc();
	});

	// ---

	return {
		coverAnimate: coverAnimate,
		hideTopbar: hideTopbar,
		activeNav: activeNav,
		loopNav: loopNav,
		scrollNav: scrollNav,
		switcherNav: switcherNav,
		contentController: contentController,
		heightCalc: heightCalc
	}
}());
// Start Scroll from Beginning
$(window).on('beforeunload', function () {
	$(window).scrollTop(0);
});
// Start Document
$(document).ready(function () {
	// === START ===
	uni.contentController();
	// console.log("> start");

	// === NAVEGAÇÂO ===

	// NAVEGAÇÃO SLIDES (SWITCHER)
	if ($("body").hasClass("switcher-nav")) {
		// console.log("> switcher-nav");
		uni.switcherNav();
	}

	// NAV OFF-CANVAS - Controles da Navegação
	$(".nav-off-canvas").sidenav({
		// Desativa/Ativa o scrollify na navegaçã mobile
		onOpenEnd: function () {
			$(".nav-oc-trigger").addClass("open");
			if ($("body").hasClass("scroll-nav")) {
				$.scrollify.disable();
			}
			// console.log('side nav is open');
		},
		onCloseEnd: function () {
			$(".nav-oc-trigger").removeClass("open");
			if ($("body").hasClass("scroll-nav")) {
				$.scrollify.enable();
			}
			// console.log('side nav is close');
		}
	});
	// Nav-oc-trigger on/off
	$(".nav-off-canvas li").on("click", function () {
		$(".nav-off-canvas").sidenav("close");
	});
	$(".nav-oc-trigger .close").on("click", function () {
		$(".nav-off-canvas").sidenav("close");
	});
	// Fix bug of sidenav link "close"
	$(".nav-oc-trigger").on("click", function (e) {
		e.preventDefault();
	});

	// NAV FLUTUANTE
	$('.fixed-action-btn').floatingActionButton({
		hoverEnabled: false
	});

	// NAVEGAÇÃO SCROLL
	if ($("body").hasClass("scroll-nav")) {
		// console.log("> scroll-nav");
		uni.scrollNav();
	}

	// COVER - Animação da Capa (jQuery-Scroll-Trigger)
	if ($("#cover").hasClass("cover-animate")) {
		// console.log("> cover-animate");
		$('#cover').scrolltrigger({
			swipeMode: true,
			swipeUp: function () {
				uni.coverAnimate();
				// console.log("SWUP");
			},
			scrollDown: function () {
				uni.coverAnimate();
				// console.log("SCDOWN");
			}
		});

		$(".scroll-arrow").on("click", function (e) {
			e.preventDefault();
			uni.coverAnimate();
		});
	}

	// TOPBAR - Hide topbar on scroll
	if ($("body").hasClass("top-bar-hidden")) {
		// console.log("> top-bar-hidden");
		uni.hideTopbar();
	}

	// Dinamic Height Calculation
	uni.heightCalc();

	// Materialize Calls
	// M.AutoInit(); // Materialize 'All Components' Start (não funciona bem)
	$(".modal").modal();
	$(".dropdown-button").dropdown();
	$(".dropdown-trigger").dropdown();
	$(".carousel.carousel-slider").carousel({
		fullWidth: true,
		indicators: true
	});
	$(".materialboxed").materialbox({
		onOpenStart: function () {
			$(".top-bar").addClass("opacity-0");
			$(".content-nav").addClass("opacity-0");
		},
		onCloseStart: function () {
			$(".top-bar").removeClass("opacity-0");
			$(".content-nav").removeClass("opacity-0");
		}
	});
	$('.collapsible').collapsible();

	// Lightbox Transparent Image Fix
	$("[uk-lightbox] a").on("click", function () {
		var imgSrc = $(this).children("img").attr("src"),
			transparentImg = $(this).children("img").hasClass("transparent-img");
		// console.log("SRC: " + imgSrc);

		$(document).on('itemshow', $("[uk-lightbox]"), function () {
			if (transparentImg) {
				// console.log("it works: .uk-lightbox img[src*='" + imgSrc + "']");
				setTimeout(function () {
					$(".uk-lightbox img[src*='" + imgSrc + "']").addClass("transparent-img transition");
				}, 50);
			}
		});
	});

	// Topics Nav Sync
	$(".topics-nav li").on("click", function () {
		var i = ($(this).index()+1);
		$(document).scrollTop(0);
		setTimeout(function () {
			$(".topics-nav li").removeClass("uk-active");
			$(".topics-nav li:nth-child("+i+")").addClass("uk-active");
		}, 200);
	});

	// MathJax
	if ($("body").hasClass("mathjs")) {
		window.MathJax = {
			tex: {
				inlineMath: [
					['$', '$'],
					['\\(', '\\)']
				]
			},
			svg: {
				fontCache: 'global'
			}
		};

		(function () {
			var polyfill = document.createElement('script');
			polyfill.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
			polyfill.async = true;
			document.body.appendChild(polyfill);

			var mjx = document.createElement('script');
			mjx.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js';
			mjx.async = true;
			document.body.appendChild(mjx);
		})();
	}

	// DESAFIO
	$('.desafio .collapsible.expandable').collapsible({
		accordion: false
	});
	$(".desafio .collapsible-header").on("click", function () {
		if (!$(".desafio .challenge-fields").hasClass("active")) {
			$(".desafio .challenge-fields").addClass("active");
		} else {
			$(".desafio .challenge-fields").addClass("finished");
			$(".desafio .challenge-fields .challenge-answer .challenge-text").attr("disabled", "disabled");
		}
	});
});