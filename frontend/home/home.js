let slideIndex = 0;
const slides = document.querySelectorAll('.slideshow-slide');
const dots = document.querySelectorAll('.dot');

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    // Reset slideIndex if out of bounds
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    // Hide all slides
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });

    // Display the current slide with fade effect
    slides[slideIndex - 1].classList.add('active');

    // Update dots for navigation
    dots.forEach((dot) => {
        dot.classList.remove('active');
    });
    dots[slideIndex - 1].classList.add('active');
}

function showSlides() {
    // Hide all slides
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });

    // Increment slideIndex and reset if necessary
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    // Display the current slide with fade effect
    slides[slideIndex - 1].classList.add('active');

    // Update dots for navigation
    dots.forEach((dot) => {
        dot.classList.remove('active');
    });
    dots[slideIndex - 1].classList.add('active');

    // Call showSlides() recursively
    setTimeout(showSlides, 3000); 
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the slideshow
    showSlides();

    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Retrieved user:', user);

    if (user && user.Username) {
        const joinLink = document.getElementById('join-link');
        joinLink.innerHTML = `
        <div class="dropdown">
        <span id="user-dropdown" class="dropdown-toggle">${user.Username}</span>
        <div class="dropdown-menu" id="dropdown-menu">
            <a href="#" id="logout-link">Logout</a>
        </div>
        </div>
        `;
        
        // Function to toggle dropdown menu
        function toggleDropdown() {
            const dropdownMenu = document.getElementById('dropdown-menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        }

        // Event listener to toggle dropdown on click
        document.addEventListener('click', function(event) {
            const userDropdown = document.getElementById('user-dropdown');
            if (event.target === userDropdown) {
                toggleDropdown();
            } else {
                const dropdownMenu = document.getElementById('dropdown-menu');
                if (!dropdownMenu.contains(event.target)) {
                    dropdownMenu.style.display = 'none';
                }
            }
        });

        function logout() {
            localStorage.removeItem('user');
            window.location.href = 'home.html'; 
        }

        document.getElementById('logout-link').addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Logout clicked');
            logout();
});

    } else {
        console.log('No user found in localStorage.');
    }
});
