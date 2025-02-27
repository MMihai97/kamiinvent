// Funcționalitate globală pentru coș
const cartCount = document.querySelector('.cart-count');
const cartFloating = document.querySelector('.cart-floating');
const cartPanel = document.querySelector('.cart-panel');
const placeOrderButton = document.querySelector('.place-order');
const cartCloseX = document.querySelector('.cart-close-x');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalValue = document.getElementById('cart-total-value');
const orderForm = document.querySelector('.order-form');
const orderStep1 = document.querySelector('.order-step-1');
const orderStep2 = document.querySelector('.order-step-2');
const nextStepButton = document.querySelector('.next-step');
const submitOrderButton = document.getElementById('submit-order');

// Inițializăm itemCount din lungimea listei cartItems
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

window.loadCartItems = function() {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    updateCartCount();
    cartItemsContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name} - ${item.size}, ${item.color} (x${item.quantity || 1}) - ${item.price * (item.quantity || 1)} MDL</p>
            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    if (cartTotalValue) {
        cartTotalValue.textContent = totalPrice;
    }

    if (orderForm) {
        orderForm.style.display = 'none';
        orderStep1.style.display = 'block';
        orderStep2.style.display = 'none';
    }

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-item').getAttribute('data-index'));
            removeCartItem(index);
        });
    });
};

function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = itemCount;
        localStorage.setItem('cartItemCount', itemCount);
    }
}

function removeCartItem(index) {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
    } else {
        cartItems.splice(index, 1);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.loadCartItems();
}

function toggleCartPanel() {
    if (cartPanel.classList.contains('active')) {
        cartPanel.classList.remove('active');
    } else {
        cartPanel.classList.add('active');
        window.loadCartItems();
    }
}

function showOrderForm() {
    if (cartItems.length === 0) {
        alert('Coșul este gol! Adaugă produse înainte de a plasa comanda.');
        return;
    }
    cartItemsContainer.style.display = 'none';
    cartTotalValue.parentElement.style.display = 'none';
    placeOrderButton.style.display = 'none';
    orderForm.style.display = 'block';
}

function validateStep1() {
    const firstName = document.getElementById('order-first-name').value.trim();
    const lastName = document.getElementById('order-last-name').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const city = document.getElementById('order-city').value.trim();
    const address = document.getElementById('order-address').value.trim();

    const emailValid = email.includes('@') && email.includes('.');
    const phoneValid = /^[0-9]+$/.test(phone);

    nextStepButton.disabled = !(firstName && lastName && emailValid && phoneValid && city && address);
}

function showStep2() {
    orderStep1.style.display = 'none';
    orderStep2.style.display = 'block';
}

function handleOrderSubmission(e) {
    e.preventDefault();
    const firstName = document.getElementById('order-first-name').value;
    const lastName = document.getElementById('order-last-name').value;
    const email = document.getElementById('order-email').value;
    const phone = document.getElementById('order-phone').value;
    const city = document.getElementById('order-city').value;
    const address = document.getElementById('order-address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    processRegularPayment(firstName, lastName, email, phone, city, address, paymentMethod);
}

function processRegularPayment(firstName, lastName, email, phone, city, address, paymentMethod) {
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const orderDetails = {
        items: cartItems,
        total: totalPrice,
        customer: { firstName, lastName, email, phone, city, address, paymentMethod }
    };
    console.log('Comanda plasată:', orderDetails);
    alert(`Comanda a fost plasată cu succes!\nMetoda de plată: ${paymentMethod}`);
    localStorage.removeItem('cartItems');
    cartPanel.classList.remove('active');
    window.loadCartItems();
}

// Modificare: Mutăm totul în DOMContentLoaded pentru a asigura că DOM-ul e încărcat
document.addEventListener('DOMContentLoaded', () => {
    if (cartFloating && cartPanel && placeOrderButton && cartCloseX && orderForm && nextStepButton && submitOrderButton) {
        cartFloating.addEventListener('click', () => {
            console.log('Click pe coș!'); // Debug
            toggleCartPanel();
        });
        placeOrderButton.addEventListener('click', showOrderForm);
        cartCloseX.addEventListener('click', () => {
            cartPanel.classList.remove('active');
            cartItemsContainer.style.display = 'block';
            cartTotalValue.parentElement.style.display = 'block';
            placeOrderButton.style.display = 'block';
            orderForm.style.display = 'none';
        });
        document.getElementById('order-first-name').addEventListener('input', validateStep1);
        document.getElementById('order-last-name').addEventListener('input', validateStep1);
        document.getElementById('order-email').addEventListener('input', validateStep1);
        document.getElementById('order-phone').addEventListener('input', validateStep1);
        document.getElementById('order-city').addEventListener('input', validateStep1);
        document.getElementById('order-address').addEventListener('input', validateStep1);
        nextStepButton.addEventListener('click', showStep2);
        orderForm.addEventListener('submit', handleOrderSubmission);
    }
    window.loadCartItems(); // Inițializăm coșul
});