// General Global Variables
var $html = document.getElementsByTagName('html')[0],
    $body = document.getElementsByTagName('body')[0];

var $ajaxcontent = document.getElementsByClassName('ajax-content')[0],
    $ajaxstyle = document.getElementsByClassName('ajax-style')[0],
    $ajaxscript,
    animationcomplete = false,
    filerequested = false,
    $newcontent,
    $newtop,
    $newbottom;

$ajaxcontent.classList.add('show');

// Basic Nav Drawer interactions
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
    filerequested = false;
    animationcomplete = false;
    $ajaxcontent.classList.add('hide');
    $body.classList.add('loading');
    // Animation completion code below
    setTimeout(function() {
        if (filerequested) changeContent();
        animationcomplete = true;
    }, 720);
    // XMLHttpRequest below to fetch the other page
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var $wrapper = document.createElement('div');
            $wrapper.innerHTML = xhr.responseText;
            $newcontent = $wrapper.getElementsByClassName('ajax-content')[0],
            $newstyle = $wrapper.getElementsByClassName('ajax-style')[0],
            $newscript = $wrapper.getElementsByClassName('ajax-script')[0];
            if (!$newcontent) {
                error();
                $ajaxcontent.classList.remove('hide');
                return false;
            }
            if (url.substring(0,4) != 'http') history.pushState(null, null, url); // Checking if user pressed back or not
            filerequested = true;
            if (animationcomplete) changeContent();
        }
        else if (this.readyState == 4) {
            error();
            $ajaxcontent.classList.remove('hide');
            $body.classList.remove('loading');
        }
    };
}
function changeContent() {
    $body.classList.remove('loading');
    $ajaxcontent.style.position = 'absolute';
    $ajaxcontent.insertAdjacentElement('afterend', $newcontent);
    $ajaxcontent.parentNode.removeChild($ajaxcontent);
    $ajaxstyle.insertAdjacentElement('afterend', $newstyle);
    $ajaxstyle.parentNode.removeChild($ajaxstyle);
    var script = document.createElement('script');
    script.classList.add('ajax-script');
    script.innerHTML = $newscript.innerText;
    $body.appendChild(script);
    $ajaxscript.parentNode.removeChild($ajaxscript);
    $ajaxcontent = $newcontent;
    $ajaxstyle = $newstyle;
    $ajaxscript = document.getElementsByClassName('ajax-script')[0];
    $ajaxcontent.classList.add('show');
    dropdownCheck();
    rippleCheck();
}
window.onpopstate = function() {
    changePage(window.location.href);
};
function removeListener() {} // Empty function to be changed int the page itselt

// All click listeners combined into one single one
document.addEventListener('click', function(e) {
	var $elem = e.target;
	while ($elem && !$elem.classList.contains('dropdown') && !$elem.classList.contains('menu') && !$elem.classList.contains('scrim') && (!$elem.tagName == 'A' || $elem.target || !$elem.href)) {
		$elem = $elem.parentElement;
	}
    if (!$elem) return false;
    if ($elem.tagName == 'A' && !$elem.target && $elem.href) {
        if ($elem.getAttribute('href').substring(0,4) == 'http') return false;
        if (navigator.userAgent.indexOf('Mac OS X') != -1) {
            if (e.metaKey) return false;
        }
        else if (e.ctrlKey) return false;
        e.preventDefault();
        removeListener(); // This function is to remove all existing listeners on the current page since AJAX navigation makes the site a single page application and javascript does not change. By default, the function is empty, so redefine it in the script section of the HTML page.
        $scrim.click(); // To close the nav drawer
        changePage($elem.getAttribute('href'));
    }
    else if ($elem.classList) {
        // Click the menu to open the nav drawer
        if ($elem.classList.contains('menu')) {
            navAppear = true;
            $navdrawer.classList.add('active');
        	$navdrawer.removeAttribute('style');
        	$scrim.removeAttribute('style');
        	$html.style.overflow = 'hidden';
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
// An easing function for use in the dropdown transition and opening or closing the navdrawer after the user lifts off his finger after dragging
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
function dropdownTransition(iterations,$elem,start,end) {
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
        if (end != 0) $dropdowncontent.style.visibility = 'hidden';
        $currentelement = false;
        animation = false;
    }
}

// Scrolling listener for stuff like the navbar hide action and parallax effect (if have)
var $navbar = document.getElementsByClassName('navbar')[0],
    latestY = window.pageYOffset,
    previousY,
    windowHeight = window.innerHeight,
    resize,
    isIE = navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1,
    mousemove = true,
    $parallax = false; // By default there is no $parallax element and mousemove variable for the carousel. Add the $parallax element in the script tag on pages with the element. There is no need to define mousemove though.

// Resize listener to detect window size changes
window.addEventListener('resize', function() {
	resize = true;
	windowHeight = window.innerHeight;
});

// Detect if mouse is hovering above the navbar or if mouse is aroung the spot of the navbar if navbar is hidden
var $navdetecthover = document.getElementsByClassName('nav-detect-hover')[0],
    navhover = false;
$navbar.addEventListener('pointerenter', navEnter);
$navdetecthover.addEventListener('pointerenter', navEnter);
function navEnter(e) {
    if (e.pointerType == 'touch') return false;
    navhover = true;
    $navbar.classList.remove('hide');
}
$navbar.addEventListener('pointerleave', navLeave);
$navdetecthover.addEventListener('pointerleave', navLeave);
function navLeave(e) {
    if (e.pointerType == 'touch' && document.getElementsByClassName('carousel')[0]) $parallax.click();
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
		if ($parallax && latestY <= windowHeight && isIE == false) {
			$parallax.style.transform = 'translate3d(0,' + Math.round(Math.pow(latestY,.85)/(2*Math.pow(windowHeight,-.15))*1e2)/1e2 + 'px,0)';
		}
        if ($parallax && latestY <= windowHeight) {
			$parallax.style.opacity = 1 - latestY/windowHeight;
        }
	}
	if (mousemove && latestY < 10 && $parallax) {
		$navbar.classList.remove('hide');
		$parallax.classList.add('mousemove');
	}
	else if ($parallax) {
		if (!mousemove && latestY < 10 && !navhover) $navbar.classList.add('hide');
		$parallax.classList.remove('mousemove');
	}
	if (latestY > previousY && latestY >= 10 && !navhover) {
		$navbar.classList.add('hide');
	}
	if (latestY >= 10 && latestY < previousY || latestY != previousY && previousY == null) {
		$navbar.classList.remove('hide');
	}
	previousY = latestY;
	requestAnimationFrame(scrolling);
}
scrolling();


// Draggable nav drawer
var $dragnavdrawer = document.getElementsByClassName('drag-nav-drawer')[0],
    initialX = 0, // The starting x-coordinate
    actualX = 0, // The actual x-coordinate of the finger when dragging
    navX = 0, // Similar to above but maximum can only be the nav drawer's width (most of the ime 300px), while actualX can go beyond that. This is to prevent the nav drawer from being dragged to far right and creating an obvious gap on the left
    previousNavX = 0, // The previous value of navX. It is carried over to check for the direction of movement
    diffX = 0, // The diference between previousNavX and current NavX
    dragging = false, // check if user is draggging or not
    navdrawerwidth = $navdrawer.offsetWidth, // Nav Drawer's width. It may change at narrow screen sizes.
    navTranslate, // The x-coordinate to be used for the nav drawer itself
    iterations = 0, // Variables below are used for the transition for the navdrawer (whether it opens or closes) after the user removes finger from the screen
    start,
    total,
    ripplebug; // This is a variable to help in solving a bug where clicking a link in the nav drawer closes the nav drawer

// First checks if passive event listeners are supported. Passive event listeners help to improve touch latency and overall performance.
var supportsPassive = false;
document.createElement("div").addEventListener("test", function() {}, {
	get passive() {
		supportsPassive = true;
		return false;
	}
});
document.addEventListener('touchstart', startDrag, supportsPassive ? {passive: true} : false);
document.addEventListener('touchmove', mainDrag, supportsPassive ? {passive: true} : false);
document.addEventListener('touchend', endDrag, supportsPassive ? {passive: true} : false);
document.addEventListener('touchcancel', endDrag, supportsPassive ? {passive: true} : false);
// The dragging function. Runs 60 times a second
function navDragging() {
	if (dragging == 'started') {
		requestAnimationFrame(navDragging);
		return false;
	}
	if (dragging) navTranslate = navX - navdrawerwidth;
	$navdrawer.style.transform = 'translate3d(' + navTranslate + 'px,0,0)';
	$scrim.style.opacity = Math.round((navTranslate + navdrawerwidth)/navdrawerwidth*1e2)/1e2;
	if (dragging) {
		iterations = 0;
		requestAnimationFrame(navDragging);
	}
	// When dragging the nav drawer into view but force is not enough OR dragging it out of view and force is enough
	else if (diffX <= -2 || -2 < diffX && diffX < 2 && navX < navdrawerwidth/2) {
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
		actualX = Math.round(e.touches[0].clientX*10)/10;
		if (actualX >= initialX) navX = navdrawerwidth;
		else navX = Math.round(e.touches[0].clientX*10)/10 - initialX + navdrawerwidth;
		diffX = navX - previousNavX;
		previousNavX = navX;
	}
}
// Finger leaves the screen
function endDrag(e) {
	if (e.target == $dragnavdrawer) {
		dragging = false;
        $navdrawer.classList.remove('dragging');
		if (diffX >= 2 || -2 < diffX && diffX < 2 && navX > navdrawerwidth/2) navAppear = true;
	}
	if (navAppear) {
		if (dragging = 'started') ripplebug = true;
		dragging = false;
        $navdrawer.classList.remove('dragging');
		if (diffX < -2 || -2 < diffX && diffX < 2 && navX <= navdrawerwidth/2) navAppear = false;
	}
}


// Mouse hover effect + Ripple Effect
var $ripplelist = document.querySelectorAll('.nav-drawer ul li a, button'), // The elements to which a ripple effect is added to
    rippledown = false, // a boolean which states if the button is creatly being held and the ripple is activ
    x, // x-coordinate of ripple circle's centre
    y, // y-coordinate of ripple circle's centre
    rippletimer = 0; // To prevent the ripple from disappearing to fast if the click was very fast

// Activate the ripple effect be adding a 'div' with the class of 'ripple' to every element in the $ripplelist. Also adds the event listeners.
function rippleCheck() {
    $ripplelist = document.querySelectorAll('.nav-drawer ul li a, button');
    for (var i = 0; i < $ripplelist.length; i++) {
        if ($ripplelist[i].tagName == 'A') var $ripple = $ripplelist[i].parentElement.lastElementChild;
        else var $ripple = $ripplelist[i].lastElementChild.lastElementChild;
        if ($ripple.classList) {
            if ($ripple.classList.contains('ripple')) return false;
        }
        var $div = document.createElement('DIV');
        $div.className = 'ripple';
    	if ($ripplelist[i].tagName == 'A') $ripplelist[i].parentElement.appendChild($div);
    	else $ripplelist[i].lastElementChild.appendChild($div);
    	$ripplelist[i].addEventListener('pointerdown', function(e) {
    		rippleDown(this, e);
    	});
    	$ripplelist[i].addEventListener('pointerup', function(e) {
    		rippleUp(this, e);
    	});
    	$ripplelist[i].addEventListener('pointerleave', function(e) {
    		rippleUp(this, e);
    		hover(this, e, 'leave');
    	});
    	$ripplelist[i].addEventListener('pointerenter', function(e) {
    		hover(this, e, 'enter');
    	});
    }
}
rippleCheck();
// This hover effect is needed to replace CSS ':hover' because ':hover' also happens with touchscreens which isn't ideal. Hover effects can only happen with a mouse.
function hover(element, e, direction) {
	if (e.pointerType == 'touch') return false;
	if (direction == 'enter') element.classList.add('hover');
	else element.classList.remove('hover');
}
function rippleDown(element, e) {
	rippledown = true;
	if (element.tagName == 'A') var target = element.parentElement.lastElementChild;
	else var target = element.lastElementChild.lastElementChild;
	if (rippletimer) {
		clearTimeout(rippletimer);
		timer2 = rippletimer;
		target.classList.remove('appear');
	}
	target.classList.remove('fade-out', 'finish');
	x = Math.round(e.clientX - element.getBoundingClientRect().left);
	y = Math.round(e.clientY - element.getBoundingClientRect().top);
	var radius = Math.max(Math.sqrt(x*x + y*y),
	                      Math.sqrt(x*x + (element.offsetHeight-y)*(element.offsetHeight-y)),
					      Math.sqrt((element.offsetWidth-x)*(element.offsetWidth-x) + y*y),
				 	      Math.sqrt((element.offsetWidth-x)*(element.offsetWidth-x) + (element.offsetHeight-y)*(element.offsetHeight-y)));
	target.style.height = target.style.width = radius * 2 + 'px';
	target.style.top = y + 'px';
	target.style.left = x + 'px';
	target.classList.add('appear');
	rippletimer = setTimeout(function() {
		target.classList.add('finish');
		if (target.classList.contains('fade-out')) target.classList.remove('appear');
		rippletimer = 0;
	}, 400);
}
function rippleUp(element, e) {
	rippledown = false;
	if (element.tagName == 'A') var target = element.parentElement.lastElementChild;
	else var target = element.lastElementChild.lastElementChild;
	target.classList.add('fade-out');
	if (!rippletimer) target.classList.remove('appear');
	setTimeout(function() {
		if (rippledown == false && target.classList.contains('appear')) {
			target.classList.add('finish');
			target.classList.remove('appear');
		}
	}, 400);
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
