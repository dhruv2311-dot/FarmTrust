import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import { FaSearch, FaCheck, FaTimes, FaAngleDown } from 'react-icons/fa';
import './FarmerOrders.css';
import { getAllOrders, getProductById, getFarmerByEmail } from '../Api'; // Adjust path to Api.js

const FarmerOrders = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0(); // Auth0 state
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Fetch farmer ID and orders on mount
  useEffect(() => {
    const fetchFarmerOrders = async () => {
      if (!isAuthenticated || !user?.email) return;

      setLoading(true);
      try {
        // Step 1: Get farmer details by email to fetch _id
        const farmerData = await getFarmerByEmail(user.email);
        const farmerId = farmerData.farmer._id;

        // Step 2: Fetch all orders from all users
        const allOrdersData = await getAllOrders();
        const allOrders = allOrdersData.orders;

        // Step 3: Filter orders for this farmer
        const farmerOrders = allOrders.filter(order => order.farmerId === farmerId);

        // Step 4: Fetch product details for each order
        const enrichedOrders = await Promise.all(
          farmerOrders.map(async (order, index) => {
            console.log(order)
            const product = order.products[0]; // Assuming one product per order for simplicity
            const productData = await getProductById(product.productId);
            return {
              id: order.id || index + 1, // Fallback ID if missing
              orderDate: new Date(order.orderedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }),
              product: productData.product.name,
              productImage: productData.product.images[0] || 'default-image.jpg', // Use first image
              consumer: order.userName, // Use userEmail as consumer name
              consumerImage: 'default-profile.jpg', // Placeholder (fetch from user if available)
              quantity: `${product.quantityInKg} Kg`,
              totalPrice: `₹${order.totalAmount.toFixed(2)}`,
              status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize
              consumerDetails: {
                address: order.userAddress, // Placeholder (fetch from user if needed)
                contactNumber: order.userPhone // Placeholder
              }
            };
          })
        );

        setOrders(enrichedOrders);
        setFilteredOrders(enrichedOrders);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerOrders();
  }, [isAuthenticated, user?.email]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter orders by status
  const filterOrders = (status) => {
    setOrderFilter(status);
    setIsFilterOpen(false);
    if (status === "All Orders") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  // Sort orders by date
  const sortOrders = (sortType) => {
    setSortOrder(sortType);
    setIsSortOpen(false);
    let sorted = [...filteredOrders];
    if (sortType === "Newest First") {
      sorted.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    } else {
      sorted.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    }
    setFilteredOrders(sorted);
  };

  // Search orders
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term.trim() === "") {
      filterOrders(orderFilter);
    } else {
      setFilteredOrders(
        orders.filter(order =>
          order.consumer.toLowerCase().includes(term) ||
          order.product.toLowerCase().includes(term)
        )
      );
    }
  };

  // Open/close modal
  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Update order status (placeholder - implement PATCH request if needed)
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders.filter(order =>
      orderFilter === "All Orders" || order.status === orderFilter
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    // TODO: Add PATCH request to update status in backend
  };

  if (authLoading || loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in to view your orders.</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon-d" />
        </div>
      </div>

      <div className="filter-sort-container">
        <div className="filter-dropdown" ref={filterDropdownRef}>
          <button className="dropdown-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            {orderFilter} <FaAngleDown />
          </button>
          {isFilterOpen && (
            <div className="dropdown-content">
              <div onClick={() => filterOrders("All Orders")}>All Orders</div>
              <div onClick={() => filterOrders("Pending")}>Pending</div>
              <div onClick={() => filterOrders("Confirmed")}>Confirmed</div>
              <div onClick={() => filterOrders("Canceled")}>Canceled</div>
            </div>
          )}
        </div>

        <div className="sort-dropdown" ref={sortDropdownRef}>
          <button className="dropdown-button" onClick={() => setIsSortOpen(!isSortOpen)}>
            Sort: {sortOrder} <FaAngleDown />
          </button>
          {isSortOpen && (
            <div className="dropdown-content">
              <div onClick={() => sortOrders("Newest First")}>Newest First</div>
              <div onClick={() => sortOrders("Oldest First")}>Oldest First</div>
            </div>
          )}
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div className="header-item">Order Date</div>
          <div className="header-item">Product</div>
          <div className="header-item">Consumer</div>
          <div className="header-item">Quantity</div>
          <div className="header-item">Total Price</div>
          <div className="header-item">Status</div>
          <div className="header-item">Actions</div>
        </div>

        {filteredOrders.map(order => (
          <div key={order.id} className="order-row" onClick={() => openOrderModal(order)}>
            <div className="order-item">{order.orderDate}</div>
            <div className="order-item product-item-d3">
              <img src={order.productImage} alt={order.product} className="product-thumbnail-d3" />
              <span>{order.product}</span>
            </div>
            <div className="order-item consumer-item">
              <img src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png" alt={order.consumer} className="consumer-thumbnail" />
              <span>{order.consumer}</span>
            </div>
            <div className="order-item">{order.quantity}</div>
            <div className="order-item">{order.totalPrice}</div>
            <div className="order-item">
              <span className={`order-status-d1 ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="order-item actions-d3">
              <button
                className="action-btn-d3 approve-d3"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(order.id, "Confirmed");
                }}
              >
                <FaCheck />
              </button>
              <button
                className="action-btn-d3 reject-d3"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(order.id, "Canceled");
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="no-orders">No orders found</div>
        )}
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="product-details-d3">
                <img src={selectedOrder.productImage} alt={selectedOrder.product} className="product-image-d3" />
                <div className="product-info-d3">
                  <h3>{selectedOrder.product}</h3>
                  <div className="order-detail">
                    <span>Order Date: {selectedOrder.orderDate}</span>
                  </div>
                  <div className="order-detail">
                    <span>Quantity: {selectedOrder.quantity}</span>
                  </div>
                  <div className="order-detail price">
                    <span>Total: {selectedOrder.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="consumer-details">
                <h3>Consumer Details</h3>
                <div className="consumer-info">
                  <div className="consumer-avatar">
                    <img src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png" alt={selectedOrder.consumer} />
                    <span>{selectedOrder.consumer}</span>
                  </div>
                  <div className="consumer-contact">
                    <div><strong>Address:</strong> {selectedOrder.consumerDetails.address}</div>
                    <div><strong>Contact:</strong> {selectedOrder.consumerDetails.contactNumber}</div>
                  </div>
                </div>
              </div>

              <div className="order-actions-d3">
                <div className="status-update-d3">
                  <span>Status: </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className={`status-dropdown-d3 ${selectedOrder.status.toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;