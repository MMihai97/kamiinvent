console.log('Scriptul script-produse.js s-a încărcat!');

document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            initializeProduct(tabId);
        });
    });

    function initializeProduct(tabId) {
        const activeTab = document.getElementById(tabId);
        const addToCartButton = activeTab.querySelector('.add-to-cart');
        const sizeOptions = activeTab.querySelectorAll('.size-option');
        const colorOptions = activeTab.querySelectorAll('.color-option');
        const sizeSelection = activeTab.querySelector('#size-selection span');
        const colorSelection = activeTab.querySelector('#color-selection span');
        const priceValue = activeTab.querySelector('#price-value');
        const discountCodeInput = activeTab.querySelector('#discount-code');
        const applyDiscountButton = activeTab.querySelector('.apply-discount');
        const discountModal = activeTab.querySelector('#discount-modal');
        const discountModalMessage = activeTab.querySelector('#discount-modal-message');
        const cartFloating = document.querySelector('.cart-floating');

        let selectedSize = null;
        let selectedColor = null;
        let selectedPrice = 0;
        let discountApplied = false;

        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                sizeOptions.forEach(btn => btn.classList.remove('selected'));
                option.classList.add('selected');
                selectedSize = option.getAttribute('data-size');
                selectedPrice = parseInt(option.getAttribute('data-price'));
                sizeSelection.textContent = selectedSize;
                updatePrice();
            });
        });

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(btn => btn.classList.remove('selected'));
                option.classList.add('selected');
                selectedColor = option.getAttribute('data-color');
                colorSelection.textContent = selectedColor;
            });
        });

        applyDiscountButton.addEventListener('click', () => {
            const code = discountCodeInput.value.trim().toUpperCase();
            if (code === 'PLITKAMD') {
                discountApplied = true;
                discountModalMessage.textContent = 'Felicitări!!! Ai reducere de 10%!';
                discountModal.classList.remove('error');
                discountModal.classList.add('success');
                showModal();
                updatePrice();
            } else {
                discountApplied = false;
                discountModalMessage.textContent = 'Cod invalid!';
                discountModal.classList.remove('success');
                discountModal.classList.add('error');
                showModal();
                updatePrice();
            }
        });

        function showModal() {
            discountModal.style.display = 'flex';
            setTimeout(() => {
                discountModal.style.display = 'none';
            }, 2000); // Ascunde după 2 secunde
        }

        function updatePrice() {
            let finalPrice = selectedPrice;
            if (discountApplied && finalPrice > 0) {
                finalPrice = Math.round(finalPrice * 0.9); // Aplică 10% reducere
            }
            priceValue.textContent = finalPrice || 0;
        }

        addToCartButton.addEventListener('click', () => {
            if (!selectedSize || !selectedColor) {
                alert('Te rog să selectezi o dimensiune și o culoare!');
                return;
            }

            const finalPrice = discountApplied ? Math.round(selectedPrice * 0.9) : selectedPrice;
            const product = {
                name: activeTab.querySelector('.product-details h2').textContent,
                size: selectedSize,
                color: selectedColor,
                price: finalPrice,
                quantity: 1,
                image: activeTab.querySelector('.main-image.active').src
            };

            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItemIndex = cartItems.findIndex(item => 
                item.name === product.name && item.size === product.size && item.color === product.color
            );

            if (existingItemIndex > -1) {
                cartItems[existingItemIndex].quantity += 1;
            } else {
                cartItems.push(product);
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            console.log('Produs adăugat în coș:', product);
            window.loadCartItems();

            // Animație produs spre coș
            const buttonRect = addToCartButton.getBoundingClientRect();
            const cartRect = cartFloating.getBoundingClientRect();
            const flyingItem = document.createElement('div');
            flyingItem.classList.add('cart-item-animation');
            flyingItem.style.left = `${buttonRect.left + buttonRect.width / 2 - 20}px`;
            flyingItem.style.top = `${buttonRect.top + buttonRect.height / 2 - 20}px`;
            document.body.appendChild(flyingItem);

            const deltaX = (cartRect.left + cartRect.width / 2 - 20) - (buttonRect.left + buttonRect.width / 2 - 20);
            const deltaY = (cartRect.top + cartRect.height / 2 - 20) - (buttonRect.top + buttonRect.height / 2 - 20);

            setTimeout(() => {
                flyingItem.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
                flyingItem.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                flyingItem.remove();
            }, 800);
        });
    }

    initializeProduct('design-ventilator');
});