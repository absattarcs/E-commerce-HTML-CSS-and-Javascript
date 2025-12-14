
// DOM Elements
const hamburger = document.querySelector(".hamburger");
const hamburgerIcon = document.querySelector(".hamburger i");
const navlist = document.querySelector(".navlist");
const navLinks = document.querySelectorAll(".navlist .link");
const cartIcon = document.querySelector(".nav-icon .icon.active");
const addToCartButtons = document.querySelectorAll(".add-cart");
const newsletterForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const categoryButtons = document.querySelectorAll(".category button");




// Mobile Menu Toggle
hamburger.addEventListener("click", () => {
    const isActive = navlist.classList.contains("active");
    
    if (isActive) {
        // Close menu
        closeMobileMenu();
    } else {
        // Open menu
        navlist.classList.add("active");
        hamburger.classList.add("active");
        document.body.style.overflow = "hidden";
    }
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        closeMobileMenu();
    });
});

// Close mobile menu when clicking on backdrop (outside the popup)
document.addEventListener("click", (e) => {
    if (navlist.classList.contains("active") && 
        !navlist.contains(e.target) && 
        e.target !== hamburger && 
        !hamburger.contains(e.target)) {
        closeMobileMenu();
    }
});


// Close mobile menu function
function closeMobileMenu() {
    navlist.classList.remove("active");
    hamburger.classList.remove("active");
    document.body.style.overflow = "auto";
}

// Close mobile menu on escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navlist.classList.contains("active")) {
        closeMobileMenu();
    }
});

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = 0;

// Initialize cart count from localStorage
cartCount = cart.reduce((total, item) => total + item.quantity, 0);
updateCartCount();

// Update cart count display
function updateCartCount() {
    const cartCountElement = cartIcon.querySelector('.cart-count') || 
                           createCartCountElement();
    cartCountElement.textContent = cartCount;
}

function createCartCountElement() {
    const countElement = document.createElement('span');
    countElement.className = 'cart-count';
    countElement.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--logo-color);
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    `;
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(countElement);
    return countElement;
}

// Add to Cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const card = button.closest('.card');
        const title = card.querySelector('.title').textContent;
        const price = card.querySelector('.amount').textContent;
        const image = card.querySelector('img').src;
        
        const product = {
            id: Date.now(),
            title: title,
            price: price,
            image: image,
            quantity: 1
        };
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.title === title);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartCount();
        
        // Show success message
        showNotification(`${title} added to cart!`);
    });
});

// Cart icon click handler
cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    showCartModal();
});

// Show cart modal
function showCartModal() {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.cart-modal');
    if (!modal) {
        createCartModal();
        modal = document.querySelector('.cart-modal');
    }
    
    modal.style.display = 'block';
    updateCartModal();
}

// Create cart modal
function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h3>Shopping Cart</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="cart-modal-body">
                <div class="cart-items"></div>
                <div class="cart-total">
                    <h4>Total: <span class="total-amount">€0.00</span></h4>
                    <button class="checkout-btn btn">Checkout</button>
                </div>
            </div>
        </div>
    `;
    

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .cart-modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 0;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .cart-modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .close-modal {
            font-size: 24px;
            cursor: pointer;
            color: #aaa;
        }
        .close-modal:hover {
            color: var(--logo-color);
        }
        .cart-modal-body {
            padding: 20px;
        }
        .cart-item {
            display: flex;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
            position: relative;
        }
        .cart-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 15px;
        }
        .cart-item-info {
            flex: 1;
        }
        .cart-item-title {
            font-weight: 500;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.3;
        }
        .cart-item-price {
            color: var(--logo-color);
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .cart-item-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .quantity-btn {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background-color: white;
            color: var(--font-color);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.2s ease;
        }
        .quantity-btn:hover {
            background-color: var(--logo-color);
            color: white;
            border-color: var(--logo-color);
        }
        .cart-item-quantity {
            min-width: 20px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
        }
        .delete-item {
            position: absolute;
            top: 10px;
            right: 0;
            background: none;
            border: none;
            color: #ff4444;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        .delete-item:hover {
            background-color: #ff4444;
            color: white;
            transform: scale(1.1);
        }
        .cart-total {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .cart-total h4 {
            margin-bottom: 15px;
            font-size: 18px;
        }
        .total-amount {
            color: var(--logo-color);
            font-weight: bold;
        }
        .checkout-btn {
            background-color: var(--logo-color);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .checkout-btn:hover {
            background-color: var(--font-color);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}


// Update cart modal content
function updateCartModal() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        totalAmount.textContent = '€0.00';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const price = parseFloat(item.price.replace('€', ''));
        total += price * item.quantity;
        
        return `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete-item" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    totalAmount.textContent = `€${total.toFixed(2)}`;
    
    // Add event listeners for quantity controls and delete buttons
    addCartEventListeners();
}

// Add event listeners for cart modal controls
function addCartEventListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            decreaseQuantity(index);
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            increaseQuantity(index);
        });
    });
    
    // Delete item buttons
    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.delete-item').dataset.index);
            deleteCartItem(index);
        });
    });
}

// Decrease item quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        showNotification(`Decreased quantity of ${cart[index].title}`);
    } else {
        // If quantity is 1, remove the item
        deleteCartItem(index);
        return;
    }
    
    // Save to localStorage and update display
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();
    updateCartModal();
}

// Increase item quantity
function increaseQuantity(index) {
    cart[index].quantity += 1;
    showNotification(`Increased quantity of ${cart[index].title}`);
    
    // Save to localStorage and update display
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();
    updateCartModal();
}

// Delete item from cart
function deleteCartItem(index) {
    const itemTitle = cart[index].title;
    cart.splice(index, 1);
    
    showNotification(`${itemTitle} removed from cart`, "error");
    
    // Save to localStorage and update display
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();
    updateCartModal();
}

// Newsletter Subscription
newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        showNotification("Thank you for subscribing to our newsletter!");
        emailInput.value = '';
        
        // Here you would typically send the email to your backend
        console.log('Newsletter subscription:', email);
    } else {
        showNotification("Please enter a valid email address", "error");
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Category Navigation
categoryButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const category = button.textContent.toLowerCase();
        console.log(`Navigating to ${category} category`);
        showNotification(`Loading ${category} products...`);
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Show notification
function showNotification(message, type = "success") {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : '#4CAF50'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Scroll effect for navbar
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 100) {
        header.style.boxShadow = "0px 5px 20px rgba(0,0,0,0.1)";
    } else {
        header.style.boxShadow = "0px 5px 14px .75px rgba(36, 11, 12, .05)";
    }
});

// Button hover effects for better UX
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Just Buy! - E-commerce site loaded');
    
    // Add loading complete class to body
    document.body.classList.add('loaded');
    
    // Initialize cart count
    updateCartCount();
});

 