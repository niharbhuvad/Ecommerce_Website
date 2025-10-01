// Global variable to hold all product data, initialized as an empty array.
let allProducts = [];
const productList = document.getElementById("product-list");

// --- 1. NAVBAR LOADING (with Callback Fix) ---
// The entire navbar and its functionality MUST be initialized AFTER the HTML content is loaded.
fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
        // Inject the navbar HTML into the placeholder
        document.getElementById("navbar-placeholder").innerHTML = data;
        
        // NOW that the search bar and category links exist, initialize their features.
        initializeNavbarFeatures(); 
    });


// --- 2. PRODUCT DATA FETCHING ---
fetch("products.json")
    .then(res => res.json())
    .then(products => {
        allProducts = products;
        renderProducts(products); 
    })
    .catch(error => console.error("Error loading products:", error));


// --- 3. CORE RENDERING FUNCTION (Performance Improvement) ---
function renderProducts(products) {
    // Using map().join('') is much faster than innerHTML += in a loop.
    const html = products.map(p => `
        <div class="col-md-4">
            <div class="card h-100">
                <img src="${p.images[0]}" class="card-img-top" alt="${p.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text">${p.price}</p>
                    <a href="product.html?id=${p.id}" class="btn btn-outline-primary mt-auto">View</a>
                    
                    <button 
                        class="btn btn-success mt-2" 
                        onclick="addToCart('${p.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `);
    
    productList.innerHTML = html.join('');
}


// --- 4. ADD TO CART FUNCTION (Refactored for ID-based lookup) ---
function addToCart(productId) {
    // Find the full product object from the global array
    const product = allProducts.find(p => p.id == productId); 

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if already in cart
    let existing = cart.find(item => item.id == product.id);
    
    // Assuming price is a string like '$20.00' (as per your JSON)
    const numericPrice = parseFloat(product.price.replace('$', '')); 

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            price: numericPrice, // Now stored as a number
            image: product.images[0],
            qty: 1 
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}


// --- 5. INITIALIZATION FUNCTION (The crucial fix for search/filter) ---
function initializeNavbarFeatures() {
    // NOTE: Elements are retrieved *INSIDE* this function now
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    // Handle search (function is defined below)
    const performSearch = () => {
        if (!searchInput) return; 

        const query = searchInput.value.toLowerCase();
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
        );
        renderProducts(filtered);
    };

    // Attach search event listeners (they now exist!)
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", performSearch);
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                performSearch();
            }
        });
    }

    // Attach category filter listeners (they now exist!)
    document.querySelectorAll("#category-list .dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const category = item.getAttribute("data-category");

            // Reset 'active' class
            document.querySelectorAll("#category-list .dropdown-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Filter and render
            if (category === "All") {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}