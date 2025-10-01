


// Search functionality
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const productList = document.getElementById("product-list");

let allProducts = [];


fetch("products.json")
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products); 
  })
  .catch(error => console.error("Error loading products:", error));

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach(p => {
    productList.innerHTML += `
      <div class="col-md-4">
        <div class="card">
          <img src="${p.images[0]}" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">${p.price}</p>
            <a href="product.html?id=${p.id}" class="btn btn-outline-primary">View</a>
            <a href="cart.html" class="btn btn-success">
            <button class="btn btn-success" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">Add to Cart</button>
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

// Handle search
function performSearch() {
  const query = searchInput.value.toLowerCase();

  const filtered = allProducts.filter(p => {
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  renderProducts(filtered);
}

// Button click
searchBtn.addEventListener("click", performSearch);

// Enter key support
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

// Add to cart functionality
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Check if already in cart
  let existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ 
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.images[0],
      qty: 1 
    });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}




document.querySelectorAll("#category-list .dropdown-item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const category = item.getAttribute("data-category");

    if (category === "All") {
      renderProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === category);
      renderProducts(filtered);
    }
  });
});