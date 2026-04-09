// Hero Carousel
const slides = [
  {
    subtitle: 'Limited Time Offer',
    title: '20% Off on All Abayas',
    description: 'Celebrate style with exclusive savings on our premium abaya collection. Use code ABAYA20 at checkout.',
    primaryLink: '/shop',
    secondaryLink: '/collections'
  },
  {
    subtitle: 'Premium Collection',
    title: 'Elegant Abayas for Every Occasion',
    description: 'Discover our exclusive range of luxury abayas crafted with finest fabrics and attention to detail.',
    primaryLink: '/shop',
    secondaryLink: '/collections'
  },
  {
    subtitle: 'Artisan Quality',
    title: 'Handcrafted Excellence',
    description: 'Each abaya is meticulously crafted by skilled artisans using premium materials.',
    primaryLink: '/shop/artisan',
    secondaryLink: '/craftsmanship'
  }
];

let currentSlide = 0;
let slideInterval;

// DOM Elements
const heroSection = document.getElementById('heroSection');
const heroSubtitle = document.getElementById('heroSubtitle');
const heroTitle = document.getElementById('heroTitle');
const heroDescription = document.getElementById('heroDescription');
const heroDots = document.getElementById('heroDots');
const prevBtn = document.querySelector('.hero-prev');
const nextBtn = document.querySelector('.hero-next');
const heroSlides = document.querySelectorAll('.hero-slide');

// Initialize carousel
function initCarousel() {
  updateSlide();
  startAutoPlay();
}

// Update slide content and active states
function updateSlide() {
  // Update content
  const slide = slides[currentSlide];
  heroSubtitle.textContent = slide.subtitle;
  heroTitle.textContent = slide.title;
  heroDescription.textContent = slide.description;
  
  // Update primary button
  const primaryBtn = document.querySelector('.btn-primary');
  primaryBtn.href = slide.primaryLink;
  
  // Update secondary button
  const secondaryBtn = document.querySelector('.btn-secondary');
  secondaryBtn.href = slide.secondaryLink;
  
  // Update active slide image
  heroSlides.forEach((slideEl, index) => {
    slideEl.classList.toggle('active', index === currentSlide);
  });
  
  // Update dots
  const dots = heroDots.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Go to next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlide();
}

// Go to previous slide
function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlide();
}

// Go to specific slide
function goToSlide(index) {
  currentSlide = index;
  updateSlide();
  resetAutoPlay();
}

// Start auto-play
function startAutoPlay() {
  slideInterval = setInterval(nextSlide, 7000);
}

// Reset auto-play (called when user interacts)
function resetAutoPlay() {
  clearInterval(slideInterval);
  startAutoPlay();
}

// Event listeners for carousel
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
}

// Dot navigation
if (heroDots) {
  heroDots.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
      const slideIndex = parseInt(e.target.dataset.slide);
      goToSlide(slideIndex);
    }
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    // Update icon
    const isOpen = mobileMenu.classList.contains('active');
    mobileMenuBtn.innerHTML = isOpen
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="5" y2="5"></line><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="19" y2="19"></line></svg>`;
  });
}

// Close mobile menu when clicking a link
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="5" y2="5"></line><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="19" y2="19"></line></svg>`;
    });
  });
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
    resetAutoPlay();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
    resetAutoPlay();
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initCarousel);