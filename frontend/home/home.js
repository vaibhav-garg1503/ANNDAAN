let slideIndex = 0;
const slides = document.querySelectorAll('.slideshow-slide');
const dots = document.querySelectorAll('.dot');

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
    setTimeout(showSlides, 3000); // Change slide every 3 seconds (adjust as needed)
}

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

// Initialize the slideshow
showSlides();
