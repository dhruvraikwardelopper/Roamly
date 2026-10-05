const swiper = new Swiper(".mySwiper", {
    slidesPerView: 10,
    spaceBetween: 5,
    
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 2000, // 2 seconds
        disableOnInteraction: false,
    },
    breakpoints: {
        1200: {
            slidesPerView: 8,
        },

        902: {
            slidesPerView: 6,
        },

        768: {
            slidesPerView: 4,
        },

        0: {
            slidesPerView: 3,
        }
    }
});