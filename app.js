// Product data
const products = [
    {
        id: 1,
        name: "Celestial Ring",
        price: 89,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
        category: "rings",
        description: "Delicate silver band with star motif",
        arCompatible: true
    },
    {
        id: 2,
        name: "Layered Chain Necklace",
        price: 129,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        category: "necklaces",
        description: "Multi-chain sterling silver necklace",
        arCompatible: true
    },
    {
        id: 3,
        name: "Minimalist Hoops",
        price: 65,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
        category: "earrings",
        description: "Classic silver hoop earrings",
        arCompatible: true
    },
    {
        id: 4,
        name: "Textured Cuff Bracelet",
        price: 95,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
        category: "bracelets",
        description: "Statement silver cuff with unique texture",
        arCompatible: true
    },
    {
        id: 5,
        name: "Modern Cross Pendant",
        price: 110,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
        category: "necklaces",
        description: "Contemporary silver cross necklace",
        arCompatible: true
    },
    {
        id: 6,
        name: "Stacking Ring Set",
        price: 149,
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
        category: "rings",
        description: "Set of 3 stackable silver rings",
        arCompatible: true
    }
];

// AI Generated Designs data
const aiGeneratedDesigns = [
    {
        id: "ai_1",
        name: "Lunar Eclipse Ring",
        prompt: "Minimalist ring inspired by moon phases",
        style: "Minimalist",
        material: "925 Sterling Silver",
        price: 95,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
        category: "rings",
        description: "AI-generated design based on lunar cycles",
        arCompatible: true,
        isAiGenerated: true
    },
    {
        id: "ai_2",
        name: "Geometric Harmony Necklace",
        prompt: "Modern necklace with interconnected triangles",
        style: "Modern",
        material: "925 Sterling Silver",
        price: 140,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        category: "necklaces",
        description: "Mathematically inspired pendant design",
        arCompatible: true,
        isAiGenerated: true
    },
    {
        id: "ai_3",
        name: "Vintage Bloom Earrings",
        prompt: "Delicate flower earrings with vintage charm",
        style: "Vintage",
        material: "Silver with Rose Gold Plating",
        price: 105,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
        category: "earrings",
        description: "Classic floral motifs reimagined",
        arCompatible: true,
        isAiGenerated: true
    }
];

// AR Instructions for different jewelry types
const arInstructions = {
    rings: "Hold your hand steady with fingers spread for accurate ring placement",
    earrings: "Face the camera directly with good lighting for precise earring positioning",
    necklaces: "Position camera at chest level for best necklace placement results",
    bracelets: "Extend your wrist towards the camera for optimal bracelet fit simulation"
};

// Global state
let cart = [];
let wishlist = [];
let currentFilter = 'all';
let currentDesignStep = 1;
let selectedJewelryType = '';
let designPrompt = '';
let selectedStyle = '';
let selectedMaterial = '';
let currentTryOnProduct = null;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const searchModal = document.getElementById('searchModal');
const quickViewModal = document.getElementById('quickViewModal');
const tryOnModal = document.getElementById('tryOnModal');
const cartBtn = document.getElementById('cartBtn');
const searchBtn = document.getElementById('searchBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const arBtn = document.getElementById('arBtn');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    initializeEventListeners();
    initializeDesignStudio();
    updateCounts();
});

// Event Listeners
function initializeEventListeners() {
    // Modal controls
    document.getElementById('closeCart').addEventListener('click', () => closeModal(cartModal));
    document.getElementById('closeSearch').addEventListener('click', () => closeModal(searchModal));
    document.getElementById('closeQuickView').addEventListener('click', () => closeModal(quickViewModal));
    document.getElementById('closeTryOn').addEventListener('click', () => closeModal(tryOnModal));
    
    // Header actions
    cartBtn.addEventListener('click', () => openModal(cartModal));
    searchBtn.addEventListener('click', () => openModal(searchModal));
    arBtn.addEventListener('click', () => {
        scrollToSection('shop');
        showNotification('Select any product to try AR virtual try-on!');
    });
    
    // Modal backdrop clicks
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setActiveFilter(e.target);
            currentFilter = e.target.dataset.filter;
            renderProducts();
        });
    });
    
    // Search functionality
    document.getElementById('searchSubmit').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Navigation smooth scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            setActiveNavLink(link);
        });
    });
    
    // Try-on controls
    document.getElementById('captureBtn').addEventListener('click', captureTryOnPhoto);
    document.getElementById('shareBtn').addEventListener('click', shareTryOnExperience);
    document.getElementById('addToCartFromTryOn').addEventListener('click', addToCartFromTryOn);
}

// AI Design Studio functionality
function initializeDesignStudio() {
    // Jewelry type selection
    document.querySelectorAll('.jewelry-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.jewelry-type-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedJewelryType = btn.dataset.type;
        });
    });
    
    // Example prompt buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('designPrompt').value = btn.dataset.example;
            designPrompt = btn.dataset.example;
        });
    });
    
    // Design navigation
    document.getElementById('nextStep').addEventListener('click', nextDesignStep);
    document.getElementById('prevStep').addEventListener('click', prevDesignStep);
    
    // Generate designs button
    document.getElementById('generateDesigns').addEventListener('click', generateAIDesigns);
    
    // Design prompt input
    document.getElementById('designPrompt').addEventListener('input', (e) => {
        designPrompt = e.target.value;
    });
    
    // Style and material selectors
    document.getElementById('designStyle').addEventListener('change', (e) => {
        selectedStyle = e.target.value;
    });
    
    document.getElementById('designMaterial').addEventListener('change', (e) => {
        selectedMaterial = e.target.value;
    });
}

function nextDesignStep() {
    if (currentDesignStep < 4) {
        // Validate current step
        if (currentDesignStep === 1 && !selectedJewelryType) {
            showNotification('Please select a jewelry type first');
            return;
        }
        if (currentDesignStep === 2 && !designPrompt.trim()) {
            showNotification('Please describe your vision');
            return;
        }
        
        currentDesignStep++;
        updateDesignSteps();
    }
}

function prevDesignStep() {
    if (currentDesignStep > 1) {
        currentDesignStep--;
        updateDesignSteps();
    }
}

function updateDesignSteps() {
    document.querySelectorAll('.design-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.querySelector(`[data-step="${currentDesignStep}"]`).classList.add('active');
    
    // Update navigation buttons
    document.getElementById('prevStep').disabled = currentDesignStep === 1;
    document.getElementById('nextStep').style.display = currentDesignStep === 4 ? 'none' : 'block';
}

function generateAIDesigns() {
    if (!selectedJewelryType || !designPrompt.trim()) {
        showNotification('Please complete the design steps first');
        return;
    }
    
    // Show loading animation
    document.getElementById('generatingAnimation').classList.remove('hidden');
    document.getElementById('generateDesigns').disabled = true;
    
    // Simulate AI generation delay
    setTimeout(() => {
        document.getElementById('generatingAnimation').classList.add('hidden');
        document.getElementById('generateDesigns').disabled = false;
        
        // Show generated designs
        document.getElementById('generatedDesigns').classList.remove('hidden');
        renderGeneratedDesigns();
        
        // Scroll to results
        document.getElementById('generatedDesigns').scrollIntoView({ behavior: 'smooth' });
        
        showNotification('AI designs generated successfully!');
    }, 3000);
}

function renderGeneratedDesigns() {
    const designsGrid = document.getElementById('designsGrid');
    const filteredDesigns = aiGeneratedDesigns.filter(design => design.category === selectedJewelryType);
    
    designsGrid.innerHTML = filteredDesigns.map(design => `
        <div class="design-card product-card ar-compatible">
            <div class="product-image">
                <img src="${design.image}" alt="${design.name}" loading="lazy">
                <div class="product-actions">
                    <button class="product-action-btn ar-btn" onclick="openTryOn('${design.id}')" title="Try AR">
                        <i class="fas fa-camera"></i>
                    </button>
                    <button class="product-action-btn" onclick="toggleWishlist('${design.id}')" title="Add to Wishlist">
                        <i class="fas fa-heart ${wishlist.includes(design.id) ? 'text-red' : ''}"></i>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-name">${design.name}</h3>
                <p class="product-description">${design.description}</p>
                <div class="product-price">$${design.price}</div>
                <div class="product-buttons">
                    <button class="btn btn--outline btn--ar" onclick="openTryOn('${design.id}')">
                        <i class="fas fa-camera"></i> Try AR
                    </button>
                    <button class="btn btn--primary btn--quote">
                        Request Quote
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Product rendering
function renderProducts() {
    if (!productsGrid) return;
    
    let filteredProducts = [];
    
    if (currentFilter === 'all') {
        filteredProducts = [...products];
    } else if (currentFilter === 'ai-designs') {
        filteredProducts = [...aiGeneratedDesigns];
    } else {
        filteredProducts = products.filter(product => product.category === currentFilter);
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card ${product.arCompatible ? 'ar-compatible' : ''}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-actions">
                    ${product.arCompatible ? `
                        <button class="product-action-btn ar-btn" onclick="openTryOn('${product.id}')" title="Try AR">
                            <i class="fas fa-camera"></i>
                        </button>
                    ` : ''}
                    <button class="product-action-btn" onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
                        <i class="fas fa-heart ${wishlist.includes(product.id) ? 'text-red' : ''}"></i>
                    </button>
                    <button class="product-action-btn" onclick="openQuickView('${product.id}')" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-buttons">
                    ${product.arCompatible ? `
                        <button class="btn btn--outline btn--ar" onclick="openTryOn('${product.id}')">
                            <i class="fas fa-camera"></i> Try AR
                        </button>
                    ` : ''}
                    <button class="btn btn--primary" onclick="addToCart('${product.id}')">
                        ${product.isAiGenerated ? 'Request Quote' : 'Add to Cart'}
                    </button>
                    <button class="btn btn--outline" onclick="toggleWishlist('${product.id}')">
                        <i class="fas fa-heart ${wishlist.includes(product.id) ? 'text-red' : ''}"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Virtual Try-On functionality
function openTryOn(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    currentTryOnProduct = product;
    
    // Update try-on modal content
    document.getElementById('tryOnProductName').textContent = product.name;
    document.getElementById('tryOnProductPrice').textContent = `$${product.price}`;
    
    // Update instructions based on jewelry type
    const instructions = arInstructions[product.category] || 'Position yourself for the best try-on experience';
    document.getElementById('tryOnInstructions').innerHTML = `<p>${instructions}</p>`;
    
    // Simulate jewelry overlay
    const overlay = document.getElementById('jewelryOverlay');
    overlay.style.backgroundImage = `url(${product.image})`;
    
    // Show jewelry overlay after a delay to simulate AR loading
    setTimeout(() => {
        overlay.classList.add('active');
    }, 1000);
    
    openModal(tryOnModal);
    showNotification(`AR try-on activated for ${product.name}`);
}

function captureTryOnPhoto() {
    if (!currentTryOnProduct) return;
    
    // Simulate photo capture
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10001;
        opacity: 0.8;
        pointer-events: none;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        document.body.removeChild(flash);
        showNotification('Photo captured! Saved to your gallery.');
    }, 200);
}

function shareTryOnExperience() {
    if (!currentTryOnProduct) return;
    
    // Simulate social sharing
    const shareData = {
        title: `Check out this ${currentTryOnProduct.name} from PASH!`,
        text: `I'm trying on this beautiful piece using AR technology`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback for browsers without Web Share API
        const shareText = `${shareData.title} - ${shareData.text} ${shareData.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Share link copied to clipboard!');
        });
    }
}

function addToCartFromTryOn() {
    if (!currentTryOnProduct) return;
    
    addToCart(currentTryOnProduct.id);
    closeModal(tryOnModal);
}

// Cart functionality
function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    if (product.isAiGenerated) {
        showNotification(`Quote request sent for ${product.name}! We'll contact you soon.`);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCounts();
    renderCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCounts();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.classList.add('hidden');
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(0);
    cartFooter.classList.remove('hidden');
}

// Wishlist functionality
function toggleWishlist(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(productId);
        showNotification(`${product.name} added to wishlist!`);
    }
    
    updateCounts();
    renderProducts(); // Re-render to update heart icons
}

// Quick view functionality
function openQuickView(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewImage').alt = product.name;
    document.getElementById('quickViewName').textContent = product.name;
    document.getElementById('quickViewPrice').textContent = `$${product.price}`;
    document.getElementById('quickViewDescription').textContent = product.description;
    
    // Update quick view buttons
    document.getElementById('quickViewAddToCart').onclick = () => {
        addToCart(productId);
        closeModal(quickViewModal);
    };
    
    document.getElementById('quickViewAddToWishlist').onclick = () => {
        toggleWishlist(productId);
    };
    
    // Try AR button
    const tryOnBtn = document.getElementById('quickViewTryOn');
    if (product.arCompatible) {
        tryOnBtn.style.display = 'inline-flex';
        tryOnBtn.onclick = () => {
            closeModal(quickViewModal);
            openTryOn(productId);
        };
    } else {
        tryOnBtn.style.display = 'none';
    }
    
    openModal(quickViewModal);
}

// Helper function to find product in both regular and AI generated products
function findProduct(productId) {
    return products.find(p => p.id == productId) || aiGeneratedDesigns.find(p => p.id === productId);
}

// Modal controls
function openModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (modal === cartModal) {
        renderCart();
    }
}

function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Reset try-on overlay when closing try-on modal
    if (modal === tryOnModal) {
        document.getElementById('jewelryOverlay').classList.remove('active');
        currentTryOnProduct = null;
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!searchTerm) return;
    
    const allProducts = [...products, ...aiGeneratedDesigns];
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.prompt && product.prompt.toLowerCase().includes(searchTerm))
    );
    
    // Update products grid with search results
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--color-text-secondary);">No products found</p>';
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card ${product.arCompatible ? 'ar-compatible' : ''}" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-actions">
                        ${product.arCompatible ? `
                            <button class="product-action-btn ar-btn" onclick="openTryOn('${product.id}')" title="Try AR">
                                <i class="fas fa-camera"></i>
                            </button>
                        ` : ''}
                        <button class="product-action-btn" onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
                            <i class="fas fa-heart ${wishlist.includes(product.id) ? 'text-red' : ''}"></i>
                        </button>
                        <button class="product-action-btn" onclick="openQuickView('${product.id}')" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-buttons">
                        ${product.arCompatible ? `
                            <button class="btn btn--outline btn--ar" onclick="openTryOn('${product.id}')">
                                <i class="fas fa-camera"></i> Try AR
                            </button>
                        ` : ''}
                        <button class="btn btn--primary" onclick="addToCart('${product.id}')">
                            ${product.isAiGenerated ? 'Request Quote' : 'Add to Cart'}
                        </button>
                        <button class="btn btn--outline" onclick="toggleWishlist('${product.id}')">
                            <i class="fas fa-heart ${wishlist.includes(product.id) ? 'text-red' : ''}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    closeModal(searchModal);
    scrollToSection('shop');
    
    // Clear search input
    document.getElementById('searchInput').value = '';
}

// Filter controls
function setActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Navigation controls
function setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Update counts
function updateCounts() {
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCartItems;
    wishlistCount.textContent = wishlist.length;
    
    // Hide count badges when 0
    cartCount.style.display = totalCartItems > 0 ? 'block' : 'none';
    wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--brand-green);
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        max-width: 300px;
    `;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle window scroll for navigation highlighting
window.addEventListener('scroll', () => {
    const sections = ['home', 'design-studio', 'collections', 'about', 'shop'];
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`[href="#${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
});

// Handle escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                closeModal(modal);
            }
        });
    }
});

// Collection card click handlers
document.addEventListener('DOMContentLoaded', () => {
    const collectionCards = document.querySelectorAll('.collection-card .btn');
    collectionCards.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const categories = ['rings', 'necklaces', 'rings']; // Map to collection categories
            const category = categories[index] || 'all';
            
            // Set filter and update products
            currentFilter = category;
            document.querySelectorAll('.filter-btn').forEach(filterBtn => {
                filterBtn.classList.remove('active');
                if (filterBtn.dataset.filter === category) {
                    filterBtn.classList.add('active');
                }
            });
            renderProducts();
            scrollToSection('shop');
        });
    });
});

// Newsletter subscription
document.querySelector('.newsletter').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
        showNotification('Thank you for subscribing to our newsletter!');
        e.target.querySelector('input[type="email"]').value = '';
    }
});

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleWishlist = toggleWishlist;
window.openQuickView = openQuickView;
window.openTryOn = openTryOn;
window.scrollToSection = scrollToSection;