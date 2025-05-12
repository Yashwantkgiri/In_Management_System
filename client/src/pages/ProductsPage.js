// client/src/pages/ProductsPage.js
import React, { useState, useContext } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import ProductList from '../components/Products/ProductList';
import ProductForm from '../components/Products/ProductForm';
import ProductItem from '../components/Products/ProductItem';
import { ProductContext } from '../context/ProductContext';

const ProductsPage = () => {
  const { 
    products, 
    loading, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useContext(ProductContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(null);

  // Open modal for creating new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for editing existing product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  // View product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewMode(product);
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  // Submit product form (create or update)
  const handleSubmit = (formData) => {
    if (isEditing) {
      updateProduct(selectedProduct._id, formData);
    } else {
      addProduct(formData);
    }
    handleCloseModal();
  };

  // Close product view
  const handleCloseView = () => {
    setViewMode(null);
  };

  return (
    <Container fluid className="products-page">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>Product Management</h1>
        <Button variant="primary" onClick={handleAddProduct}>
          Add New Product
        </Button>
      </div>

      {viewMode ? (
        <ProductItem 
          product={viewMode} 
          onClose={handleCloseView} 
        />
      ) : (
        <ProductList 
          products={products}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
          onView={handleViewProduct}
        />
      )}

      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            product={selectedProduct}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProductsPage;