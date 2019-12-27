import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock/lib/bodyScrollLock.es6';

const topSlider = new Swiper('#top-slider', {

	slidesPerView: 1,
	loop: true,
	pagination: {
		el: '#top-slider .swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});
const gallerySlider = new Swiper('#gallery-slider', {
	loop: true,
	loopFillGroupWithBlank: true,
	pagination: {
		el: '#gallery-slider .swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		1024: {
			slidesPerView: 3,
		},

		768: {
			slidesPerView: 3,
		},

		375: {
			slidesPerView: 1,
		},
	}
});

function mobileMenu() {
	let header = document.getElementById('header');
	let hamburger = document.getElementById('hamburger-btn');
	let headerNav = document.getElementById('header-nav');
	let menuLink = document.getElementsByClassName('header__nav-link');
	let state = false;

	hamburger.addEventListener('click', function () {
		if (state === false) {
			openMenu()
		} else {
			closeMenu()
		}
	});

	for (let i = 0; i < menuLink.length; i++) {
		menuLink[i].addEventListener('click', function () {
			closeMenu();
		})
	}

	function openMenu() {
		header.classList.add('menu-open');
		hamburger.classList.add('is-active');
		disableBodyScroll(headerNav);
		state = true;
	}

	function closeMenu() {
		header.classList.remove('menu-open');
		hamburger.classList.remove('is-active');
		enableBodyScroll(headerNav);
		state = false;
	}
}

function inputPlaceholder() {

	let inputList = document.getElementsByClassName('input');
	for (let i = 0; i < inputList.length; i++) {
		inputList[i].addEventListener('focus', (e) => {
			e.target.nextElementSibling.classList.add('active');
		});
		inputList[i].addEventListener('blur', (e) => {
			if (e.target.value !== '') return;
			e.target.nextElementSibling.classList.remove('active');
		})
	}

}

mobileMenu();
inputPlaceholder();







