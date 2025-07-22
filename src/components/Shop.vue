<template>
  <div class="shop-display">
    <header class="shop-header">
      <h1 class="shop-title">随风新装</h1>
      <a href="#" class="view-more">
        <span class="view-more-text">访问笑店 +</span>
      </a>
    </header>

    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image-wrapper">
          <img
            :src="product.image"
            :alt="product.name"
            class="product-image"
          />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-collection">{{ product.collection }}</p>
          <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopDisplay',
  data() {
    return {
      products: [
        {
          id: 1,
          name: '“淬”抗真短袖',
          collection: '代号/2025 SS',
          price: 99.00,
          image: '/src/images/Shop/good1.jpeg',
        },
        {
          id: 2,
          name: '后龙衬衫',
          collection: '代号/2025 SS',
          price: 199.00,
          image: '/src/images/Shop/good2.jpeg',
        },
        {
          id: 3,
          name: '四维暖T',
          collection: '代号/2025 SS',
          price: 99.00,
          image: '/src/images/Shop/good3.jpeg',
        },
        // Add more products as needed, referencing good1.jpeg, good2.jpeg, good3.jpeg
        // For demonstration, I'll reuse images. In a real app, you'd have unique images.
        {
          id: 4,
          name: '讨厌型人格T',
          collection: '代号/2025 SS',
          price: 99.00,
          image: '/src/images/Shop/good1.jpeg', // Example: Reuse image
        },
        {
          id: 5,
          name: '复古解构T',
          collection: '代号/2025 SS',
          price: 199.00,
          image: '/src/images/Shop/good2.jpeg', // Example: Reuse image
        },
        {
          id: 6,
          name: '口袋装饰罩',
          collection: '代号/2025 SS',
          price: 129.00,
          image: '/src/images/Shop/good3.jpeg', // Example: Reuse image
        },
        {
          id: 7,
          name: '随纪防晒衣',
          collection: '代号/2025 SS',
          price: 169.00,
          image: '/src/images/Shop/good1.jpeg', // Example: Reuse image
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Base styling inspired by Shadcn UI and the provided image */
.shop-display {
  font-family: 'Inter', sans-serif; /* A common font in Shadcn */
  background-color: #f8fafc; /* Light background similar to Shadcn */
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #333;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0; /* Subtle border like Shadcn */
  padding-bottom: 1rem;
}

.shop-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c; /* Darker text for titles */
}

.view-more {
  text-decoration: none;
  color: #64748b; /* Muted link color */
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* Rounded corners */
  border: 1px solid #e2e8f0;
  transition: background-color 0.2s, color 0.2s;
}

.view-more:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.view-more-text {
  font-weight: 500;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Subtle shadow */
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
  border: 1px solid #e2e8f0; /* Shadcn-like border */
}

.product-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Enhanced shadow */
}

.product-image-wrapper {
  width: 100%;
  height: 350px; /* Adjust height as needed */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.product-image {
  width: 100%; /* Ensure image fills its container initially */
  height: 100%;
  object-fit: cover; /* Cover the area, cropping if necessary */
  transition: transform 0.3s ease-in-out; /* Smooth transition for zoom */
}

.product-card:hover .product-image {
  transform: scale(1.08); /* Enlarge effect on hover */
}

.product-info {
  padding: 1rem;
  text-align: center; /* Centered text as in the example */
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1a202c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-collection {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ef4444; /* A prominent color for price, similar to some Shadcn accent colors */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .shop-title {
    font-size: 1.5rem;
  }

  .product-image-wrapper {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .shop-display {
    padding: 1rem;
  }

  .product-grid {
    grid-template-columns: 1fr; /* Single column on very small screens */
  }

  .product-image-wrapper {
    height: 250px;
  }
}
</style>