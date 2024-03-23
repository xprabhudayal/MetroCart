export const cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;
  const quantitySelector = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantitySelector;
  } else {
    cart.push({
      productId,
      quantity: quantitySelector
    })
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  cart.forEach((cartItem, index) => {
    if (cartItem.productId === productId) {
      cart.splice(index, 1);
    }
  });
  saveToStorage()
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  })
  saveToStorage();
  calculateCartQuantity();
}