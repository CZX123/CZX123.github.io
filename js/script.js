// General global variables
var $html = document.getElementsByTagName('html')[0],
	$body = document.getElementsByTagName('body')[0];

var $ajaxcontent = document.getElementsByClassName('ajax-content')[0],
	$ajaxstyle = document.getElementsByClassName('ajax-style')[0],
	$ajaxscript,
	animationcomplete = false,
	filerequested = false,
	$newcontent,
	$newtop,
	$newbottom,
	newtitle,
	oldUrl = window.location.href,
	pageswitchY = window.pageYOffset, // The scroll value which helps prevent jumping when switching pages
	pageswitching; // A boolean to prevent spamming

var carouselimg = document.querySelectorAll(".parallax-wrapper .carousel img");
if (!imgcount) var imgcount = 0;
function imgLoad() {
	imgcount += 1;
	if (imgcount == carouselimg.length) {
		imgcount = 0;
		$body.classList.add("loaded");
	}
}

// First checks if passive event listeners are supported. Passive event listeners help to improve touch latency and overall performance.
var supportsPassive = false;
document.createElement("div").addEventListener("test", function () { }, {
	get passive() {
		supportsPassive = true;
		return false;
	}
});

// Support for tabbing
window.onkeyup = function(e) {
	if (e.keyCode == 9) $body.classList.add('tabbing');
}
window.addEventListener('mousedown', function() {
	$body.classList.remove('tabbing');
}, supportsPassive ? { passive: true } : false);

// Basic nav drawer interactions
var $navdrawer = document.getElementsByClassName('nav-drawer')[0],
	$scrim = document.getElementsByClassName('scrim')[0],
	navAppear = false; // check if nav drawer is currently in view

// Toggle class when a dropdown is clicked
// This is placed in front so that the function can be called when window resizes
var $dropdown = document.querySelectorAll('.nav-drawer ul li.dropdown, section.main button.dropdown'),
	$dropdowncontent,
	d, // d is the number of dropdowns - 1
	$currentelement,
	animation;

function changePage(url) {
	if (pageswitching) {
		if (url.substring(0,4) == 'http') history.pushState(null, null, oldUrl);
		return false;
	}
	$body.classList.remove('indeterminate');
	pageswitchY = latestY;
	oldUrl = window.location.href;
	pageswitching = true;
	filerequested = false;
	animationcomplete = false;
	$ajaxcontent.classList.add('hide');
	$body.classList.add('loading');
	$body.classList.add('indeterminate');
	// Animation completion code below
	setTimeout(function() {
		if (filerequested) changeContent();
		animationcomplete = true;
	}, 280);
	// XMLHttpRequest below to fetch the other page
	try {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			window.scrollTo(0, pageswitchY);
			var $wrapper = document.createElement('div');
			$wrapper.innerHTML = xhr.responseText;
			$newcontent = $wrapper.getElementsByClassName('ajax-content')[0],
				$newstyle = $wrapper.getElementsByClassName('ajax-style')[0],
				$newscript = $wrapper.getElementsByClassName('ajax-script')[0];
			newtitle = $wrapper.getElementsByTagName('title')[0].innerText;
			if (!$newcontent) {
				error();
				$body.classList.remove('loading');
				$ajaxcontent.classList.remove('hide');
				return false;
			}
			if (url.substring(0, 4) != 'http') history.pushState(null, null, url); // Checking if user pressed back or not
			oldUrl = window.location.href;
			filerequested = true;
			if (animationcomplete) changeContent();
		};
		xhr.onerror = xhr.onabort = function() {
			error();
			$ajaxcontent.classList.remove('hide');
			$body.classList.remove('loading');
			pageswitching = false;
		};
		xhr.open("GET", url);
		xhr.send();
	}
	catch(e) {
		error();
		$ajaxcontent.classList.remove('hide');
		$body.classList.remove('loading');
		pageswitching = false;
		if (url.substring(0,4) == 'http') history.pushState(null, null, oldUrl);
	}
}
function changeContent() {
	removeListener(); // This function is to remove all existing listeners on the current page since AJAX navigation makes the site a single page application and javascript does not change. By default, the function is empty, so redefine it in the script section of the HTML page.
	window.scrollTo(0,0);
	document.title = newtitle;
	$ajaxcontent.style.position = 'absolute';
	$ajaxcontent.insertAdjacentElement('afterend', $newcontent);
	$ajaxcontent.parentNode.removeChild($ajaxcontent);
	$ajaxstyle.insertAdjacentElement('afterend', $newstyle);
	$ajaxstyle.parentNode.removeChild($ajaxstyle);
	$ajaxscript.parentNode.removeChild($ajaxscript);
	var script = document.createElement('script');
	script.classList.add('ajax-script');
	script.text = $newscript.innerText;
	// IMPORTANT: In Internet Explorer, the script's content (script.text) is all on one line instead of being cleanly formatted like other browsers. Since all of it is on one line, NO SINGLE LINE COMMENTS ARE ALLOWED! (basically this is an example of a single line comment). NO '//' characters are allowed, since anything after this 2 // will be a comment and ignored.
	$body.appendChild(script);
	$ajaxcontent = $newcontent;
	$ajaxstyle = $newstyle;
	$ajaxcontent.classList.add('show');
	setTimeout(function() {
		$body.classList.remove('loading');
	}, 300);
	setTimeout(function() {
		$ajaxcontent.classList.remove('show');
	}, 400);
	$ajaxscript = document.getElementsByClassName('ajax-script')[0];
	var split = window.location.href.split('/'),
		filename = split.pop(),
		$currentactive = $navdrawer.getElementsByClassName('active'),
		$newactive = $navdrawer.querySelector('a[href="' + filename + '"]');
	if (!filename) {
		$body.classList.add('img-loading');
		$newactive = $navdrawer.querySelector('a[href="/"]');
	}
	for (var c = 0, l = $currentactive.length; c < l; c++) {
		$currentactive[0].classList.remove('active');
		$currentactive = $navdrawer.getElementsByClassName('active');
	}
	$newactive.parentElement.classList.add('active');
	var $activedropdown = $newactive.parentElement.parentElement.parentElement.previousElementSibling;
	if ($activedropdown) $activedropdown.classList.add('active');
	dropdownCheck();
	rippleCheck();
	$navbar.classList.remove('hide');
	pageswitching = false;
}
window.onpopstate = function() {
	changePage(window.location.href);
};
function removeListener() {} // Empty function to be changed in the page itself

// All click listeners combined into a single one
document.addEventListener('click', function(e) {
	var $elem = e.target;
	while ($elem && !$elem.classList.contains('dropdown') && !$elem.classList.contains('menu') && !$elem.classList.contains('scrim') && (!$elem.tagName == 'A' || $elem.target || !$elem.href)) {
		$elem = $elem.parentElement;
	}
	if (!$elem) return false;
	if ($elem.tagName == 'A' && !$elem.target && $elem.href) {
		var firstfour = $elem.getAttribute('href').substring(0,4);
		if (firstfour == 'http' || firstfour == 'mail') return false;
		if (navigator.userAgent.indexOf('Mac OS X') != -1) {
			if (e.metaKey) return false;
		}
		else if (e.ctrlKey) return false;
		e.preventDefault();
		$scrim.click(); // To close the nav drawer
		changePage($elem.getAttribute('href'));
	}
	else if ($elem.classList) {
		// Click the menu to open the nav drawer
		if ($elem.classList.contains('menu')) {
			if (navAppear) navAppear = false;
			else navAppear = true;
			$navdrawer.classList.toggle('active');
			$navdrawer.removeAttribute('style');
			$scrim.removeAttribute('style');
			if (navAppear) $html.style.overflow = 'hidden';
			else $html.removeAttribute('style');
		}
		// Click the scrim to close the nav drawer
		else if ($elem.classList.contains('scrim')) {
			navAppear = false;
			$navdrawer.classList.remove('active');
			$navdrawer.removeAttribute('style');
			$scrim.removeAttribute('style');
			$html.removeAttribute('style');
		}
		else if ($elem.classList.contains('dropdown')) {
			$dropdowncontent = $elem.nextElementSibling.children[0];
			if ($elem.hasAttribute('data-fetch') || $dropdowncontent == $currentelement && animation) return false;
			$elem.classList.toggle('dropdown-open');
			$dropdowncontent.style.visibility = '';
			if ($elem.classList.contains('dropdown-open')) dropdownTransition(0,$dropdowncontent,-$dropdowncontent.offsetHeight,0);
			else dropdownTransition(0,$dropdowncontent,0,-$dropdowncontent.offsetHeight);
		}
	}
});
// An easing function for use in the dropdown transition and opening or closing the nav drawer after the user lifts off his finger after dragging
function easeOutCubic(t, b, c, d) {
	return Math.round((-c*((t=t/d-1)*t*t*t - 1) + b)*10)/10;
}
// Selects all dropdowns and checks for class of dropdown-open, then adds the respective styles
function dropdownCheck() {
	$dropdown = document.querySelectorAll('.nav-drawer ul li.dropdown, section.main button.dropdown');
	for (var d = 0; d < $dropdown.length; d++) {
		$dropdowncontent = $dropdown[d].nextElementSibling.children[0];
		if ($dropdown[d].classList.contains('dropdown-open')) $dropdowncontent.style.marginTop = '0';
		else {
			$dropdowncontent.style.marginTop = (-$dropdowncontent.offsetHeight) + 'px';
			$dropdowncontent.style.visibility = 'hidden';
		}
	}
}
dropdownCheck();
function dropdownTransition(iterations, $elem, start, end) {
	/*
	var dropdowntotal = 36,
		diff = end - start;
	if ($elem.tagName == 'UL') dropdowntotal = 24;
	iterations++;
	$elem.style.marginTop = easeOutCubic(iterations, start, diff, dropdowntotal) + 'px';
	if (iterations < dropdowntotal) {
		animation = requestAnimationFrame(function() {
			dropdownTransition(iterations,$elem,start,end);
		});
		$currentelement = $elem;
	}
	else {
		$currentelement = false;
		animation = false;
	}
	*/
	if ($elem.tagName == 'UL') TweenLite.to($elem, .5, { marginTop: end, ease: Strong.easeOut });
	else TweenLite.to($elem, .8, { marginTop: end, ease: Strong.easeOut });
}

// Scrolling listener for stuff like the navbar hide action and parallax effect (if have)
var $navbar = document.getElementsByClassName('navbar')[0],
	latestY = window.pageYOffset,
	previousY,
	windowHeight = window.innerHeight,
	resize,
	mousemove = true,
	$parallax = false, // By default there is no $parallax element and mousemove variable for the carousel. Add the $parallax element in the script tag on pages with the element. There is no need to define mousemove though.
	parallaxY;

// Resize listener to detect window size changes
window.addEventListener('resize', function() {
	resize = true;
	windowHeight = window.innerHeight;
});

// Detect if mouse is hovering above the navbar or if mouse is aroung the spot of the navbar if navbar is hidden
var $navdetecthover = document.getElementsByClassName('nav-detect-hover')[0],
	navhover = false,
	navtouch,
	navtouchtimer;

$navbar.addEventListener('mouseenter', navEnter);
$navdetecthover.addEventListener('mouseenter', navEnter);

$navbar.addEventListener('touchstart', function() {
	clearTimeout(navtouchtimer);
	navtouch = true;
}, supportsPassive ? { passive: true } : false);
$navdetecthover.addEventListener('touchstart', function() {
	clearTimeout(navtouchtimer);
	navtouch = true;
}, supportsPassive ? { passive: true } : false);

function navEnter(e) {
	if (navtouch) return false;
	navhover = true;
	$navbar.classList.remove('hide');
}

$navbar.addEventListener('mouseleave', navLeave);
$navdetecthover.addEventListener('mouseleave', navLeave);

$navbar.addEventListener('touchend', function() {
	navtouchtimer = setTimeout(function() {
		navtouch = false;
	}, 400);
}, supportsPassive ? { passive: true } : false);
$navdetecthover.addEventListener('touchend', function() {
	navtouchtimer = setTimeout(function() {
		navtouch = false;
	}, 400);
}, supportsPassive ? { passive: true } : false);

function navLeave(e) {
	if (navtouch && document.getElementsByClassName('carousel')[0] && $parallax) $parallax.click();
	navhover = false;
}

// The scrolling function that gets called 60 times a second to ensure smooth performance. The $parallax refers to the top element which would have a parallax effect when scrolling down. $parallax needs to be initialised separately for each individual page which needs it
function scrolling() {
	latestY = window.pageYOffset;
	if (latestY != previousY || resize) {
		if (resize) {
			resize = false;
			dropdownCheck();
		}
		if ($parallax && latestY <= windowHeight) {
			$parallax.style.transform = 'translate3d(0,' + Math.round(-latestY / 2 * 100) / 100 + 'px,0)';
			$parallax.style.opacity = Math.round((1 - latestY / windowHeight) * 100) / 100;
		}
	}
	if (mousemove && latestY < 20 && $parallax) {
		$navbar.classList.remove('hide');
		$parallax.classList.add('mousemove');
	}
	else if ($parallax) {
		if (!mousemove && latestY < 20 && !navhover) $navbar.classList.add('hide');
		$parallax.classList.remove('mousemove');
	}
	if (latestY > previousY && latestY >= 20 && !navhover) {
		$navbar.classList.add('hide');
	}
	if (latestY >= 5 && latestY < previousY || latestY != previousY && previousY == null) {
		$navbar.classList.remove('hide');
	}
	if ($parallax && latestY < 5) $parallax.parentElement.classList.remove('shadow');
	else if ($parallax) $parallax.parentElement.classList.add('shadow');
	previousY = latestY;
	requestAnimationFrame(scrolling);
}
scrolling();


// Draggable nav drawer
var $dragnavdrawer = document.getElementsByClassName('drag-nav-drawer')[0],
	initialX = 0, // The starting x-coordinate
	actualX = 0, // The actual x-coordinate of the finger when dragging
	navX = 0, // Similar to above but maximum can only be the nav drawer's width (most of the time 300px), while actualX can go beyond that. This is to prevent the nav drawer from being dragged to far right and creating an obvious gap on the left
	previousNavX = 0, // The previous value of navX. It is carried over to check for the direction of movement
	diffX = 0, // The diference between previousNavX and current NavX
	dragging = false, // Check if user is draggging or not
	navdrawerwidth = $navdrawer.offsetWidth, // Nav drawer's width. It may change at narrow screen sizes.
	navTranslate, // The x-coordinate to be used for the nav drawer itself
	iterations = 0, // Variables below are used for the transition for the navdrawer (whether it opens or closes) after the user removes finger from the screen
	start,
	total,
	ripplebug, // This is a variable to help in solving a bug where clicking a link in the nav drawer closes the nav drawer
	navdrawerscrolling,
	navdrawerscrollingtimer;

// A listener to detect whether navdrawer is being scrolled so as to prevent dragging of navdrawer
$navdrawer.children[0].addEventListener('scroll', function() {
	clearTimeout(navdrawerscrollingtimer);
	navdrawerscrolling = true;
	if (!dragging) {
		navdrawerscrollingtimer = setTimeout(function() {
			if (!dragging) navdrawerscrolling = false;
		}, 300);
	}
});

document.addEventListener('touchstart', startDrag, supportsPassive ? {passive: true} : false);
document.addEventListener('touchmove', mainDrag, supportsPassive ? {passive: true} : false);
document.addEventListener('touchend', endDrag, supportsPassive ? {passive: true} : false);
document.addEventListener('touchcancel', endDrag, supportsPassive ? {passive: true} : false);
// The dragging function. Runs 60 times a second
function navDragging() {
	if (navdrawerscrolling) {
		dragging = false;
		navAppear = true;
		iterations = 0;
		$navdrawer.style.transform = '';
		$scrim.style.opacity = '';
		$navdrawer.classList.remove('dragging');
		diffX = 3;
		requestAnimationFrame(navDragging);
		return false;
	}
	else if (dragging == 'started') {
		requestAnimationFrame(navDragging);
		return false;
	}
	else if (dragging) navTranslate = navX - navdrawerwidth;
	$navdrawer.style.transform = 'translate3d(' + navTranslate + 'px,0,0)';
	$scrim.style.opacity = Math.round((navTranslate + navdrawerwidth)/navdrawerwidth*1e2)/1e2;
	if (dragging) {
		iterations = 0;
		requestAnimationFrame(navDragging);
	}
	// When dragging the nav drawer into view but force is not enough OR dragging it out of view and force is enough
	else if (diffX <= -2 || -2 < diffX && diffX < 2 && navX < navdrawerwidth/2) {
		navAppear = false;
		start = navTranslate;
		total = 220;
		if (diffX >= 4 || diffX < -4) total = Math.round(-2 * Math.abs(diffX) + 220);
		if (diffX >= 100 || diffX <= -100) total = 20;
		navTranslate = easeOutCubic(iterations, start, 0 - navdrawerwidth - start, total);
		iterations++;
		if (iterations < total && start != -navdrawerwidth) requestAnimationFrame(navDragging);
		else {
			iterations = 0;
			$navdrawer.removeAttribute('style');
			$scrim.removeAttribute('style');
			$navdrawer.classList.remove('active');
			$html.removeAttribute('style');
		}
	}
	// When dragging the nav drawer into view and force is enough OR dragging it out of view but force is not enough
	else {
		navAppear = true;
		start = navTranslate;
		total = 220;
		if (diffX >= 4 || diffX < -4) total = Math.round(-2 * Math.abs(diffX) + 220);
		if (diffX >= 100 || diffX <= -100) total = 20;
		navTranslate = easeOutCubic(iterations, start, -start, total);
		iterations++;
		if (iterations < total && start != 0 && !ripplebug) requestAnimationFrame(navDragging);
		else {
			iterations = 0;
			$navdrawer.removeAttribute('style');
			$scrim.removeAttribute('style');
		}
		if (ripplebug) ripplebug = false;
	}
}
// The initial touch
function startDrag(e) {
	// If user's touch is on the left edge on the screen
	if (e.target == $dragnavdrawer) {
		dragging = true;
		$navdrawer.classList.add('dragging'); // This class is to enable the CSS to create an element that covers the links in the nav drawer to prevent accidental touches
		navdrawerwidth = $navdrawer.offsetWidth;
		actualX = previousNavX = navX = Math.round(e.touches[0].clientX*10)/10;
		requestAnimationFrame(navDragging);
		$navdrawer.classList.add('active');
	}
	// If nav drawer is already open and user's touch is anywhere on the screen
	if (navAppear) {
		dragging = 'started';
		navdrawerwidth = $navdrawer.offsetWidth;
		actualX = initialX = Math.round(e.touches[0].clientX*10)/10;
		// previousNavX = navX = Math.round(e.touches[0].clientX*10)/10 - initialX + navdrawerwidth; Simplified
		previousNavX = navX = navdrawerwidth;
		diffX = 0;
		cancelAnimationFrame(navDragging);
		navDragging();
	}
}
// Dragging
function mainDrag(e) {
	if (e.target == $dragnavdrawer) {
		$navdrawer.style.transition = 'none';
		$scrim.style.transition = 'none';
		actualX = Math.round(e.touches[0].clientX*10)/10;
		if (actualX >= navdrawerwidth) navX = navdrawerwidth;
		else navX = actualX;
		diffX = navX - previousNavX;
		previousNavX = navX;
		$html.style.overflow = 'hidden';
	}
	if (navAppear) {
		dragging = true;
		$navdrawer.style.transition = 'none';
		$scrim.style.transition = 'none';
		if (!navdrawerscrolling) {
			actualX = Math.round(e.touches[0].clientX*10)/10;
			if (actualX >= initialX) navX = navdrawerwidth;
			else navX = Math.round(e.touches[0].clientX*10)/10 - initialX + navdrawerwidth;
			diffX = navX - previousNavX;
			previousNavX = navX;
		}
	}
}
// Finger leaves the screen
function endDrag(e) {
	if (e.target == $dragnavdrawer) {
		dragging = false;
		$navdrawer.classList.remove('dragging');
		navdrawerscrolling = false;
	}
	if (navAppear) {
		if (dragging = 'started') ripplebug = true;
		dragging = false;
		$navdrawer.classList.remove('dragging');
		navdrawerscrolling = false;
	}
}


// Mouse hover effect + ripple effect
var $ripplelist = document.querySelectorAll('.nav-drawer ul li a, button'), // The elements to which a ripple effect is added to
	rippledown = false, // A boolean which states if the button is creatly being held and the ripple is active
	x, // x-coordinate of ripple circle's centre
	y, // y-coordinate of ripple circle's centre
	ripplecount = -1,
	rippletimerarray = [], // To prevent the ripple from disappearing to fast if the click was very fast
	$rippleelementsarray = [],
	touch,
	touchtimer;

// Activate the ripple effect be adding a 'div' with the class of 'ripple' to every element in the $ripplelist. Also adds the event listeners.
function rippleCheck() {
	$ripplelist = document.querySelectorAll('.nav-drawer ul li a, button, a.button');
	for (var i = 0; i < $ripplelist.length; i++) {
		var $ripple = $ripplelist[i].parentElement.lastElementChild;
		if ($ripplelist[i].tagName == 'A' && $ripplelist[i].classList) {
			if ($ripplelist[i].classList.contains('button')) $ripple = $ripplelist[i].lastElementChild;
		}
		else $ripple = $ripplelist[i].lastElementChild.lastElementChild;
		if ($ripple) {
			if ($ripple.classList) {
				if ($ripple.classList.contains('ripple')) continue;
			}
		}
		if ($ripplelist[i].hasAttribute('disabled')) continue;
		var $div = document.createElement('DIV');
		$div.className = 'ripple';
		if ($ripplelist[i].tagName == 'A') {
			if ($ripplelist[i].classList) {
				if ($ripplelist[i].classList.contains('button')) $ripplelist[i].appendChild($div);
				else $ripplelist[i].parentElement.appendChild($div);
			}
			else $ripplelist[i].parentElement.appendChild($div);
		}
		else $ripplelist[i].lastElementChild.appendChild($div);
		if ('PointerEvent' in window) {
			$ripplelist[i].addEventListener('pointerdown', function(e) {
				rippleDown(this, [e.clientX - this.getBoundingClientRect().left,
				                  e.clientY - this.getBoundingClientRect().top]);
			});
			$ripplelist[i].addEventListener('pointerup', function(e) {
				rippleUp(this);
			});
			$ripplelist[i].addEventListener('pointerleave', function(e) {
				rippleUp(this);
				hover(this, e, 'leave');
			});
			$ripplelist[i].addEventListener('pointerenter', function(e) {
				hover(this, e, 'enter');
			});
		}
		else {
			$ripplelist[i].addEventListener('mousedown', function(e) {
				if (!touch) rippleDown(this, [e.clientX - this.getBoundingClientRect().left,
				                              e.clientY - this.getBoundingClientRect().top]);
			});
			$ripplelist[i].addEventListener('mouseup', function(e) {
				if (!touch) rippleUp(this);
			});
			$ripplelist[i].addEventListener('mouseleave', function(e) {
				if (!touch) {
					rippleUp(this);
					hover(this, e, 'leave');
				}
			});
			$ripplelist[i].addEventListener('mouseenter', function(e) {
				if (!touch) hover(this, e, 'enter');
			});
			$ripplelist[i].addEventListener('touchstart', function(e) {
				clearTimeout(touchtimer);
				touch = true;
				rippleDown(this, [e.touches[0].clientX - this.getBoundingClientRect().left,
				                  e.touches[0].clientY - this.getBoundingClientRect().top]);
			}, supportsPassive ? { passive: true } : false);
			$ripplelist[i].addEventListener('touchend', function(e) {
				rippleUp(this);
				touchtimer = setTimeout(function() {
					touch = false;
				}, 400);
			}, supportsPassive ? { passive: true } : false);
			$ripplelist[i].addEventListener('touchmove', function(e) {
				rippleUp(this);
				touchtimer = setTimeout(function() {
					touch = false;
				}, 400);
			}, supportsPassive ? { passive: true } : false);
			$ripplelist[i].addEventListener('touchcancel', function(e) {
				rippleUp(this);
				touchtimer = setTimeout(function() {
					touch = false;
				}, 400);
			}, supportsPassive ? { passive: true } : false);
		}
	}
}
rippleCheck();
// This hover effect is needed to replace CSS ':hover' because ':hover' also happens with touchscreens which isn't ideal. Hover effects can only happen with a mouse.
function hover(element, e, direction) {
	if (e.pointerType) if (e.pointerType == 'touch') return false;
	if (direction == 'enter') element.classList.add('hover');
	else element.classList.remove('hover');
}
function rippleDown(element, e) {
	rippledown = true;
	// The target refers to the ripple element found inside (or beside) the element
	// 1st case: element is a link element <a> and it does not have a class of 'button'
	var target = element.parentElement.lastElementChild;
	// 2nd case: element is a link element <a> and it does have a class named 'button'
	if (element.tagName == 'A' && element.classList) {
		if (element.classList.contains('button')) target = element.lastElementChild;
	}
	// 3rd case: element is a button
	else target = element.lastElementChild.lastElementChild;
	for (var i = ripplecount; i > -1; i--) {
		if ($rippleelementsarray[i] == element) {
			rippletimerarray[ripplecount] = 0;
			target.classList.remove('appear');
			break;
		}
		else if (!$rippleelementsarray[i]) {
			if (i == ripplecount) { // Empty both arrays and reset count when no ripples are happening
				ripplecount = -1;
				rippletimerarray = [];
				$rippleelementsarray = [];
			}
			break;
		}
	}
	target.classList.remove('fade-out');
	target.classList.remove('finish');
	x = Math.round(e[0]);
	y = Math.round(e[1]);
	var radius = Math.ceil(Math.max(Math.sqrt(x*x + y*y),
	                                Math.sqrt(x*x + (element.offsetHeight-y)*(element.offsetHeight-y)),
	                                Math.sqrt((element.offsetWidth-x)*(element.offsetWidth-x) + y*y),
	                                Math.sqrt((element.offsetWidth-x)*(element.offsetWidth-x) + (element.offsetHeight-y)*(element.offsetHeight-y))
	                                ) * 10
                          ) / 10;
	target.style.height = target.style.width = radius * 2 + 'px';
	target.style.top = y - radius + 'px';
	target.style.left = x - radius + 'px';
	target.classList.add('appear');
	ripplecount += 1;
	var pastripplecount = ripplecount;
	rippletimerarray[ripplecount] = setTimeout(function() {
		target.classList.add('finish');
		if (target.classList.contains('fade-out')) target.classList.remove('appear');
		$rippleelementsarray[pastripplecount] = 0;
		rippletimerarray[pastripplecount] = 0;
	}, 400);
}
function rippleUp(element) {
	rippledown = false;
	var target = element.parentElement.lastElementChild;
	if (element.tagName == 'A' && element.classList) {
		if (element.classList.contains('button')) target = element.lastElementChild;
	}
	else target = element.lastElementChild.lastElementChild;
	target.classList.add('fade-out');
	if (!rippletimerarray[ripplecount]) {
		target.classList.remove('appear');
		$rippleelementsarray[ripplecount] = 0; // Just in case
		rippletimerarray[ripplecount] = 0; // Just in case
	}
	else rippletimerarray[ripplecount] = element;
}

var $error = document.getElementsByClassName('error')[0],
	errortimer;

function error() {
	if (errortimer) {
		$error.classList.remove('show');
		setTimeout(function() {
			$error.classList.add('show');
		}, 240);
	}
	else $error.classList.add('show');
	clearTimeout(errortimer);
	errortimer = setTimeout(function() {
		$error.classList.remove('show');
		errortimer = 0;
	}, 3000);
}
