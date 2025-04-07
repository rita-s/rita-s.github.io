document.addEventListener('DOMContentLoaded', function() {
    // ===== FORM HANDLING =====
    const form = document.getElementById("waitlist-form");
    const formStatus = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");
    const emailInput = document.getElementById("email-input");
    const heroCta = document.querySelector('.hero-cta');
    // Name overlay elements
    const nameOverlay = document.getElementById("name-overlay");
    const popupNameInput = document.getElementById("popup-name-input");
    const continueButton = document.getElementById("continue-button");

    // Google Apps Script Web App URL
    const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwEzGvECtCZYB4DyCpXCwoH7OSVocRTXqLr7cQd9S2tDtPPFxMylLlUmp_x5B7dK-lL/exec";

    // Initialize EmailJS with your public key
    emailjs.init("Prr_jnDigwS9iFzd-");

    // Check if user already joined (using localStorage)
    const checkAlreadyJoined = () => {
        const joinedDate = localStorage.getItem('lifeosx_joined');
        const userEmail = localStorage.getItem('lifeosx_email');
        const userName = localStorage.getItem('lifeosx_name');
        if (joinedDate && userEmail) {
            // User already joined
            heroCta.classList.add('already-joined');
            emailInput.value = userEmail;
            emailInput.setAttribute('readonly', true);
            submitButton.textContent = "Already Joined ✓";
            formStatus.textContent = userName ?
                `Hi ${userName}, you're on our waitlist!` :
                "You're on our waitlist!";
            formStatus.classList.add('success');
            return true;
        }
        return false;
    };
    // Check on page load
    if (checkAlreadyJoined()) {
        console.log("User already joined the waitlist");
    }
    // Show name popup
    function showNamePopup() {
        nameOverlay.style.display = "flex";
        setTimeout(() => {
            popupNameInput.focus();
        }, 100);
    }
    // Hide name popup
    function hideNamePopup() {
        nameOverlay.style.display = "none";
    }

    // Submit the form function
    function submitFormWithName(name = "") {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        const userEmail = emailInput.value;

        console.log("Submitting waitlist form for:", userEmail);

        // Direct URL request with image
        const img = document.createElement('img');
        img.width = 1;
        img.height = 1;
        img.src = WEBAPP_URL +
            "?email=" + encodeURIComponent(userEmail) +
            "&name=" + encodeURIComponent(name) +
            "&timestamp=" + new Date().getTime();
        img.style.display = 'none';
        document.body.appendChild(img);

        // Always assume success after timeout
        setTimeout(function() {
            // Send welcome email
            sendWelcomeEmail(name, userEmail);

            // Update UI
            handleSuccessfulSubmission(userEmail, name);

            // Remove the image
            document.body.removeChild(img);
        }, 2000);
    }

    // EmailJS function to send welcome email
    function sendWelcomeEmail(name, email) {
        // Verify we have a valid email
        if (!email || email.trim() === '') {
            console.error("Cannot send email: recipient email is empty");
            return;
        }

        console.log("Attempting to send email to:", email);

        // Prepare template parameters with explicit from_name
        const templateParams = {
            name: name || "there",
            to_name: name || "there",
            email: email,
            to_email: email,
            recipient: email,
            from_name: "Waitlist LifeOSX",  // Explicitly set sender name
            websiteLink: "https://lifeosx.com"
        };

        console.log("EmailJS params:", templateParams);

        // Send email using your Mailjet service and template
        emailjs.send("service_4uklwo2", "template_kxyvt7i", templateParams, "Prr_jnDigwS9iFzd-")
            .then(function(response) {
                console.log("Email sent successfully:", response);
            })
            .catch(function(error) {
                console.error("Email failed to send:", error);

                // Try a second attempt with simplified parameters
                const simpleParams = {
                    to_name: name || "there",
                    email: email,
                    from_name: "Waitlist LifeOSX"
                };

                console.log("Trying simplified params:", simpleParams);

                emailjs.send("service_4uklwo2", "template_kxyvt7i", simpleParams, "Prr_jnDigwS9iFzd-")
                    .then(response => console.log("Second attempt successful:", response))
                    .catch(err => console.error("Second attempt also failed:", err));
            });
    }

    // Common function to handle successful submission
    function handleSuccessfulSubmission(userEmail, name) {
        // Save to localStorage
        localStorage.setItem('lifeosx_joined', new Date().toISOString());
        localStorage.setItem('lifeosx_email', userEmail);
        if (name) {
            localStorage.setItem('lifeosx_name', name);
        }
        // Update UI
        submitButton.textContent = "Joined ✓";
        formStatus.textContent = name ?
            `Thanks for joining our waitlist, ${name}!` :
            "Thanks for joining our waitlist!";
        formStatus.classList.add('success');
        formStatus.classList.remove('error');
        heroCta.classList.add('already-joined');
        emailInput.setAttribute('readonly', true);
    }

    // Handle "Continue" button click
    if (continueButton) {
        continueButton.addEventListener("click", function() {
            const name = popupNameInput.value.trim();
            hideNamePopup();
            submitFormWithName(name);
        });
    } else {
        console.error("Continue button not found in the DOM");
    }

    // Close popup when clicking outside
    if (nameOverlay) {
        nameOverlay.addEventListener("click", function(e) {
            if (e.target === nameOverlay) {
                hideNamePopup();
                // Submit with empty name if they click outside
                submitFormWithName("");
            }
        });
        // Close popup when pressing Escape key
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && nameOverlay.style.display === "flex") {
                hideNamePopup();
                // Submit with empty name if they press escape
                submitFormWithName("");
            }
        });
    } else {
        console.error("Name overlay not found in the DOM");
    }

    // Handle form submission
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            // Don't show popup if user already joined
            if (heroCta.classList.contains('already-joined')) {
                return;
            }
            // Validate email before showing popup
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                formStatus.textContent = "Please enter a valid email address";
                formStatus.classList.add('error');
                formStatus.classList.remove('success');
                return;
            }
            // Show the name popup instead of submitting directly
            showNamePopup();
        });
    } else {
        console.error("Form not found in the DOM");
    }

    // ===== COUNTDOWN TIMER FUNCTIONALITY =====
    // Set the target date: 52 days from March 25, 2025
    const startDate = new Date(2025, 2, 21); // March 21, 2025 (Month is 0-indexed)
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
        if(daysElement) daysElement.textContent = days < 10 ? '0' + days : days;
        if(hoursElement) hoursElement.textContent = hours < 10 ? '0' + hours : hours;
        if(minutesElement) minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
        if(secondsElement) secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    // Initial call
    if (daysElement && hoursElement && minutesElement && secondsElement) {
        updateCountdown();
        // Update every second
        const interval = setInterval(updateCountdown, 1000);
    }
    // ===== MOBILE MENU FUNCTIONALITY =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        // Clone navigation links and header actions
        const navLinks = document.querySelector('.nav-links')?.cloneNode(true);
        const headerActions = document.querySelector('.header-actions')?.cloneNode(true);
        if (navLinks && headerActions) {
            // Append to mobile menu
            mobileMenu.appendChild(navLinks);
            mobileMenu.appendChild(headerActions);
            // Append mobile menu to header
            document.querySelector('.header .container')?.appendChild(mobileMenu);
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
        }
    }
});