<template>
  <div class="products-page container-fluid p-0 m-0">
    <AppNavbar />

    <h1 class="text-center my-4">All Products</h1>
    <div class="main-layout">
      <!-- Product Grid -->
      <div class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product._id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>

      <!-- Cart Section -->
      <div class="cart-section">
        <div class="card shadow">
          <h4 class="card-title">🛒 Shopping Cart</h4>
          <ul class="list-group mb-3">
            <li
              v-for="(item, index) in cart"
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ item.name }}
              <span>
                ${{ item.price }}
                <button
                  class="btn btn-sm btn-danger ms-2"
                  @click="decreaseQuantity(index)"
                >
                  -
                </button> 
                {{ item.quantity }}
                <button
                  class="btn btn-sm btn-success ms-2"
                  @click="increaseQuantity(index)"
                >
                  +
                </button>
              </span>
            </li>
          </ul>
          <h5>Total: ${{ total.toFixed(2) }}</h5>

          <!-- Checkout button -->
          <button
            class="btn btn-success w-100 mt-3"
            @click="showCheckout = !showCheckout"
            :disabled="!cart.length"
          >
            {{ showCheckout ? 'Hide Checkout' : 'Checkout' }}
          </button>

          <!-- Checkout Form -->
          <CheckoutForm v-if="showCheckout" />
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import CheckoutForm from '@/components/CheckoutForm.vue'

export default {
  name: 'ProductsPage',
  components: {
    ProductCard,
    AppNavbar,
    AppFooter,
    CheckoutForm
  },
  data() {
    return {
      products: [],
      cart: JSON.parse(localStorage.getItem('cart') || '[]'),
      showCheckout: false
    }
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity * 1.08, 0)
    }
  },
  methods: {
    async fetchProducts() {
      const apiBase = process.env.VUE_APP_API || 'http://localhost:5000/api'
      console.log('🌐 Using API URL:', apiBase)

      try {
        const res = await axios.get(`${apiBase}/products`)
        this.products = res.data
        console.log('✅ Products fetched successfully:', this.products)
      } catch (err) {
        console.error('❌ Error fetching products:', err)
      }
    },
    addToCart(product) {
      const existing = this.cart.find(item => item._id === product._id)

      if (existing) {
        existing.quantity += 1
      } else {
        // if not in cart, add it
        this.cart.push({
          ...product,
          quantity: 1 // initialize quantity
        })
      }

      // save cart to localStorage
      localStorage.setItem('cart', JSON.stringify(this.cart))

    },

    increaseQuantity(index) {
      this.cart[index].quantity += 1
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },

    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1
      } else {
        this.cart.splice(index, 1)
      }
      localStorage.setItem('cart', JSON.stringify(this.cart))
    }
  },
  mounted() {
    this.fetchProducts()
  }
}
</script>

<style scoped>
.products-page {
  background-color: #111;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Layout */
.main-layout {
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  padding: 1rem;
}

/* Product Grid */
.product-grid {
  flex: 3;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  max-height: 85vh;
}

/* Cart */
.cart-section {
  flex: 1;
  min-width: 280px;
  position: sticky;
  top: 1rem;
  height: fit-content;
}

.list-group-item {
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
}

.btn {
  border-radius: 8px;
  transition: background-color 0.2s;
  width: 32px;
  height: 32px;
}
</style>
