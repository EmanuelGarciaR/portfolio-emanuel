const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(item => {
            item.classList.remove('nav__link--active');

            this.classList.add('nav__link--active')
        });
    });
})

