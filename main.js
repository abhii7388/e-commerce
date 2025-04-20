document.addEventListener('DOMContentLoaded', function() {
    // Product data
    const products = [
        {
            id: 1,
            title: "Wireless Bluetooth Headphones",
            price: 79.99,
            oldPrice: 99.99,
            image: "https://via.placeholder.com/300x300?text=Wireless+Headphones",
            rating: 4,
            badge: "Sale"
        },
        {
            id: 2,
            title: "Smart Watch Fitness Tracker",
            price: 129.99,
            oldPrice: 149.99,
            image: "https://via.placeholder.com/300x300?text=Smart+Watch",
            rating: 5,
            badge: "Popular"
        },
        {
            id: 3,
            title: "Running Shoes",
            price: 59.99,
            image: "https://via.placeholder.com/300x300?text=Running+Shoes",
            rating: 4
        },
        {
            id: 4,
            title: "Denim Jacket",
            price: 49.99,
            oldPrice: 69.99,
            image: "https://via.placeholder.com/300x300?text=Denim+Jacket",
            rating: 3,
            badge: "Sale"
        },
        {
            id: 5,
            title: "Wireless Charger",
            price: 29.99,
            image: "https://via.placeholder.com/300x300?text=Wireless+Charger",
            rating: 4
        },
        {
            id: 6,
            title: "Cotton T-Shirt",
            price: 19.99,
            image: "https://via.placeholder.com/300x300?text=Cotton+T-Shirt",
            rating: 5,
            badge: "New"
        },
        {
            id: 7,
            title: "Backpack",
            price: 39.99,
            oldPrice: 49.99,
            image: "https://via.placeholder.com/300x300?text=Backpack",
            rating: 4
        },
        {
            id: 8,
            title: "Sunglasses",
            price: 24.99,
            image: "https://via.placeholder.com/300x300?text=Sunglasses",
            rating: 3
        }
    ];

    // Cart items
    let cartItems = [];
    
    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const cartCount = document.querySelector('.cart-count');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const closeButtons = document.querySelectorAll('.close');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const testimonials = document.querySelectorAll('.testimonial');
    
    // Render products
    function renderProducts() {
        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let badge = '';
            if (product.badge) {
                badge = `<div class="product-badge">${product.badge}</div>`;
            }
            
            let oldPrice = '';
            if (product.oldPrice) {
                oldPrice = `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
            }
            
            let ratingStars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= product.rating) {
                    ratingStars += '<i class="fas fa-star"></i>';
                } else {
                    ratingStars += '<i class="far fa-star"></i>';
                }
            }
            
            productCard.innerHTML = `
                ${badge}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${oldPrice}
                    </div>
                    <div class="product-rating">
                        ${ratingStars}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
    
    // Add to cart function
    function addToCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showCart();
    }
    
    // Update cart function
    function updateCart() {
        // Update cart count
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart sidebar
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.id}">Remove</div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
            
            // Add event listeners to quantity buttons
            cartItem.querySelector('.decrease').addEventListener('click', decreaseQuantity);
            cartItem.querySelector('.increase').addEventListener('click', increaseQuantity);
            cartItem.querySelector('.remove-item').addEventListener('click', removeItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Quantity adjustment functions
    function decreaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cartItems.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cartItems = cartItems.filter(item => item.id !== productId);
        }
        
        updateCart();
    }
    
    function increaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cartItems.find(item => item.id === productId);
        
        item.quantity += 1;
        updateCart();
    }
    
    function removeItem(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        cartItems = cartItems.filter(item => item.id !== productId);
        updateCart();
    }
    
    // Cart visibility functions
    function showCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Modal functions
    function showLoginModal() {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function showRegisterModal() {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function hideModals() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Testimonial slider
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    // Event Listeners
    document.querySelector('.cart-icon').addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });
    
    closeCartBtn.addEventListener('click', hideCart);
    cartOverlay.addEventListener('click', hideCart);
    
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginModal();
    });
    
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterModal();
    });
    
    switchToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        hideModals();
        showRegisterModal();
    });
    
    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        hideModals();
        showLoginModal();
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', hideModals);
    });
    
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    // Initialize
    renderProducts();
    updateCart();
    showTestimonial(0);
    
    // Form submissions (placeholder functionality)
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Login functionality would be implemented here');
        hideModals();
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Registration functionality would be implemented here');
        hideModals();
    });
    
    document.querySelector('.newsletter form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        alert(`Thank you for subscribing with ${email}`);
        this.querySelector('input').value = '';
    });
});
