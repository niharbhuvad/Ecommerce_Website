// Get cart data from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render cart
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="card mb-3">
        <div class="row g-0 align-items-center">
          <div class="col-md-2">
            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">$${item.price.toFixed(2)}</p>
              <input type="number" min="1" value="${item.qty}" 
                     class="form-control w-25 d-inline" 
                     onchange="updateQty(${index}, this.value)">
            </div>
          </div>
          <div class="col-md-4 text-end pe-3">
            <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateQty(index, qty) {
  cart[index].qty = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Remove item
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // check if already in cart
  let existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}
