import React, { useState } from 'react';
import { FaTrash, FaMinus, FaPlus, FaShoppingBasket } from 'react-icons/fa';
import './UserCart.css';
import Image1 from '../../assets/tomatoes.jpg';
import Image2 from '../../assets/mangoes.jpg';

const UserCart = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Organic Tomatoes',
      description: 'Fresh, locally grown tomatoes',
      category: 'Vegetables',
      subcategory: 'Tomato',
      price: 40.00,
      quantity: 2,
      image: Image1
    },
    {
      id: 2,
      name: 'Alphonso Mangoes',
      description: 'Sweet and juicy mangoes',
      category: 'Fruits',
      subcategory: 'Mango',
      price: 120.00,
      quantity: 1,
      image: Image2
    }
  ]);

  // Function to update product quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setProducts(products.map(product => 
      product.id === id ? {...product, quantity: newQuantity} : product
    ));
  };

  // Function to remove product
  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Calculate subtotal
  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const deliveryCharges = 40.00;
  const total = subtotal + deliveryCharges;

  // Render empty cart state
  const renderEmptyCart = () => {
    return (
      <div className="empty-cart-d5">
        <div className="empty-cart-icon-d5">
          <FaShoppingBasket size={64} />
        </div>
        <h2>Your cart is empty!</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button className="browse-products-btn-d5">Browse Products</button>
      </div>
    );
  };

  return (
    <div className="cart-container-d5">
      <div className="cart-header-d5">
        <h1>My Cart</h1>
        <p>Review your selected farm-fresh products before checkout</p>
      </div>
      
      {products.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="cart-content-d5">
          <div className="product-list-d5">
            {products.map(product => (
              <div className="product-card-d5" key={product.id}>
                <div className="product-image-d5">
                  <img src={product.image} alt={product.name} />
                </div>
                
                <div className="product-details-d5">
                  <div className="product-info-d5">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    
                    <div className="product-categories-d5">
                      <span className="category-tag-d5">{product.category}</span>
                      <span className="subcategory-tag-d5">{product.subcategory}</span>
                    </div>
                  </div>
                  
                  <div className="product-actions-d5">
                    <div className="quantity-controls-d5">
                      <button 
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        className="qty-btn-d5"
                      >
                        <FaMinus />
                      </button>
                      
                      <span className="quantity-d5">{product.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        className="qty-btn-d5"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="product-price-d5">
                  <div className="unit-price-d5">
                    ₹{product.price.toFixed(2)}/kg
                  </div>
                  <div className="total-price-d5">
                    ₹{(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
                
                <button 
                  className="remove-btn-d5" 
                  onClick={() => removeProduct(product.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="order-summary-d5">
            <h2>Order Summary</h2>
            
            <div className="summary-item-d5">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-item-d5">
              <span>Delivery Charges</span>
              <span>₹{deliveryCharges.toFixed(2)}</span>
            </div>
            
            <div className="summary-total-d5">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            <button className="checkout-btn-d5">
              Proceed to Checkout
            </button>
            
            <button className="continue-shopping-btn-d5">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;