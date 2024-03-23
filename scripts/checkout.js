import {cart, removeFromCart, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  if (cartQuantity === 1) {
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} item`
  } else {
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`
  }
  document.querySelector('.js-payment-summary-items').innerHTML = `Items (${cartQuantity}):`
}

function pullItemsInfo(cartItem) {
  const { productId } = cartItem;
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}

function calculateItemsValue() {
  let itemsValue = 0;
  cart.forEach((cartItem) => {
    let matchingProduct = pullItemsInfo(cartItem);
    const cartItemPrice = (matchingProduct.priceCents * cartItem.quantity);
    itemsValue += cartItemPrice;
  });
  return itemsValue;
}

function calculateShipping() {
  let shippingCost = 0;
  cart.forEach((cartItem) => {
    const { productId } = cartItem;
    const methodCost = Number(document.querySelector(`input[name="delivery-option-${productId}"]:checked`).value);
    shippingCost += methodCost;
  })
  return shippingCost;
}

function updateOrderSummary() {
  const itemsValue = calculateItemsValue();
  let itemsValueBox = document.querySelector('.js-payment-summary-items-cost');
  itemsValueBox.innerHTML = `$${formatCurrency(itemsValue)}`;

  const shippingCost = calculateShipping();
  let shippingValueBox = document.querySelector('.js-payment-summary-shipping');
  if (shippingCost === 0) {
    shippingValueBox.innerHTML = 'FREE';
  } else {
    shippingValueBox.innerHTML = `$${formatCurrency(shippingCost)}`;
  }

  let totalBeforeTaxBox = document.querySelector('.js-payment-summary-before-tax');
  const totalBeforeTax = itemsValue + shippingCost;
  totalBeforeTaxBox.innerHTML = `$${formatCurrency(totalBeforeTax)}`;

  let itemsTaxBox = document.querySelector('.js-payment-summary-tax');
  const itemsTax =  totalBeforeTax * 0.1;
  itemsTaxBox.innerHTML = `$${formatCurrency(itemsTax)}`;

  let orderTotalBox = document.querySelector('.js-payment-summary-order-total');
  let orderTotal = totalBeforeTax + itemsTax;
  orderTotalBox.innerHTML = `$${formatCurrency(orderTotal)}`;
}

function updateCheckoutList() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    let matchingProduct = pullItemsInfo(cartItem);
  
    cartSummaryHTML +=`
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>
      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">
    
        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id=${matchingProduct.id}>
              Update
            </span>
            <input class="quantity-input js-quantity-input-event js-quantity-input-${matchingProduct.id}" data-product-id=${matchingProduct.id}>
            <span class="save-quantity-link link-primary js-save-quantity-link"
            data-product-id=${matchingProduct.id}>Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
  
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input
              js-delivery-option-input"
              name="delivery-option-${matchingProduct.id}" value="0">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input js-delivery-option-input"
              name="delivery-option-${matchingProduct.id}" value="499">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input
              js-delivery-option-input"
              name="delivery-option-${matchingProduct.id}" value="999">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  });
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
}

function editQuantity(productId) {
  const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
  const quantityValue = Number(quantityInput.value);
  if (quantityValue === 0) {
    removeFromCart(productId);
    updateCartQuantity();
    updateCheckoutList();
    updateOrderSummary();
    return;
  } else if (quantityValue < 0 || quantityValue >= 1000) {
    quantityInput.value = '';
    alert('Invalid quantity.');
    return;
  }
  updateQuantity(productId, quantityValue);
  quantityInput.value = '';

  const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
  cartItemContainer.classList.remove('is-editing-quantity');

  updateCartQuantity();
  updateCheckoutList();
  updateOrderSummary();
}

updateCartQuantity();
updateCheckoutList();
updateOrderSummary();

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const { productId } = link.dataset;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    removeFromCart(productId);
    updateCartQuantity();
    
    container.remove();
    updateOrderSummary();
  })
});

document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const { productId } = link.dataset;
    const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    cartItemContainer.classList.add('is-editing-quantity');
  })
});

document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const { productId } = link.dataset;
    editQuantity(productId);
  })
});

document.querySelectorAll('.js-quantity-input-event').forEach((input) => {
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const { productId } = input.dataset;
      editQuantity(productId);
    }
  });
});

document.querySelectorAll('.js-delivery-option-input').forEach((input) => {
  input.addEventListener('click', () => {
    updateOrderSummary();
  })
})