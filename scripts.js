document.addEventListener('DOMContentLoaded', function() {
    // Set the target date: 52 days from March 25, 2025
    const startDate = new Date(2025, 2, 25); // March 25, 2025 (Month is 0-indexed)
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + 52);

    // Elements
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');

    // Update the countdown every second
    function updateCountdown() {
        const currentDate = new Date();
        const timeRemaining = targetDate - currentDate;

        if (timeRemaining <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            clearInterval(interval);
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Update HTML elements
        daysElement.textContent = days < 10 ? '0' + days : days;
        hoursElement.textContent = hours < 10 ? '0' + hours : hours;
        minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    // Initial call
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);
});

// Add this to your scripts.js file
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';

    // Clone navigation links and header actions
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    const headerActions = document.querySelector('.header-actions').cloneNode(true);

    // Append to mobile menu
    mobileMenu.appendChild(navLinks);
    mobileMenu.appendChild(headerActions);

    // Append mobile menu to header
    document.querySelector('.header .container').appendChild(mobileMenu);

    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('visible');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('visible');
            document.body.classList.remove('menu-open');
        });
    });
});