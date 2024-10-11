import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { RightArrowIcon, Edit, Remove, Logout } from '../../../components/svg-icons/icons';
import ProductModal from './ProductModal';
import { useNavigate } from 'react-router-dom';
const Products = () => {
  const navigate = useNavigate();
  const [searchProduct, setSearchProduct] = useState("");
  const [productID, setProductID] = useState(0);
  const [variantID, setVariantID] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [productModel, setProductModel] = useState(false);
  const handleClose = () => {
    getProductDetails(searchProduct);
    setShow(false);
  };
  const handleProductModelClose = () => { setProductModel(false) };
  const handleFetchProductVariant = (productId, variantId) => {
    setProductID(productId);
    setVariantID(variantId);
    setShow(true)
  }

  const handleInputChange = (e) => {
    setSearchProduct(e.target.value);

    if (e.target.value !== "") {
      getProductDetails(e.target.value);
    }
  };
  // useEffect(() => {
  //   getProductDetails();
  // }, [searchProduct]);

  async function getProductDetails(search) {
    setLoading(false);
    let url = `/product?search=${encodeURIComponent(search)}`; // Include currentPage in the URL
    let result = await fetch(url);
    result = await result.json();
    if (result.status) {
      console.log(result, "getEmployee") // Set totalPages received from the backend
      setProducts(result.data)
    }
    setLoading(true);
  }
  const isDigitsOnly = (str) => /^\d+$/.test(str);
  const isTextOnly = (str) => /^[a-zA-Z\s]+$/.test(str);
  const filteredProducts = products.reduce((acc, product) => {
    let matchedVariants = [];
    if (isDigitsOnly(searchProduct)) {
      matchedVariants = product.variants.filter(variant => variant.barcode === searchProduct);
    } else if (isTextOnly(searchProduct)) {
      console.log(`Checking for title: ${searchProduct} in product ${product.title}`);
      if (product.title.toLowerCase().includes(searchProduct.toLowerCase())) {
        matchedVariants = product.variants;
      }
    }
    if (matchedVariants.length > 0) {
      const uniqueProduct = {
        ...product,
        variants: matchedVariants
      };
      if (!acc.some(p => p.id === uniqueProduct.id)) {
        acc.push(uniqueProduct);
      }
    }

    return acc;
  }, []);
  return (
    <>
      <div className="dashboard-logo">
        <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="Logo" />
      </div>
      <Container className="cvs-product-page">
        <div className="product-header-outer">
          {/* Heading on a separate line */}
          <div className="product-act-btn">
          {Config.user.role === "Admin" && <div className="text-start my-3">
            <div className="tabe-outer">
              <div className="main-back-heading">
                      <div className="profile-btns pt-0">
                        <Button className="default-btn cancel-btn ml-0 product-back-btn" onClick={() => navigate(-1)}>
                          <RightArrowIcon />
                        </Button>
                      </div>
              </div>
            </div>
            </div>}
            </div>
          <div className="product-act-btn">
          <div className={Config.user.role === "Admin" ? "text-center my-3" : "text-end my-3"}>
            <h3>PRODUCT LOOKUP</h3> {/* Full-width heading */}

          </div>
          </div>
          <div className="product-act-btn">
          <div className="text-end my-3">
            <div className="tabe-outer">
              <div className="main-back-heading">
                      <div className="profile-btns pt-0">
                        <Button className="default-btn cancel-btn ml-0 product-logout-icon" onClick={() => {
                          window.location.href = "/logout";
                        }}>
                          <Logout />
                        </Button>
                      </div>
              </div>
            </div>
            </div>
            </div>
        </div>
        <Row className="justify-content-center">
          {/* Search Field and Delete Button on a new line */}
          <Col xs={12} className="d-flex justify-content-center my-3">
            <Form className="d-flex w-100"> {/* Use w-100 for full width */}
              {/* Search Input */}
              <Form.Control
                type="text"
                placeholder="Search"
                className="mr-2"
                aria-label="Search"
                value={searchProduct}
                onChange={(e) => { handleInputChange(e) }}
                style={{ flexGrow: 1, height: '100%' }} // Ensures the search input takes available space
              />

              {/* Delete Button */}
              <button
                className='action-btn'
                onClick={() => {
                  setSearchProduct(''); // Clear the search field
                  console.log("Search field cleared");
                }}
                style={{ marginLeft: '8px' }} // Adjusts spacing from the input
              >
                <Remove />
              </button>
            </Form>
          </Col>

          {/* Product Description Area on another line */}
          <Col xs={12} className="d-flex justify-content-center my-3 product-list-outer">
            {loading ? (
              filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product, productIndex) => (
                  <div className="product-info-outers" key={productIndex}>
                    {product.variants && product.variants.length > 0 ? (
                      product.variants.map((variant, variantIndex) => (
                        <div className="search_listing_row" key={variantIndex} onClick={() => { handleFetchProductVariant(product.id, variant.id) }}>
                          <Col xs={12}>
                            <div className="d-flex product_outer">
                              <div className="product_img">
                                {/* Safely access the first image */}
                                {product.images && product.images.length > 0 ? (
                                  <img src={product.images[0]} alt={`${product.title} image`} />
                                ) : (
                                  <img src="/path/to/default-image.jpg" alt="default img" />
                                )}
                              </div>
                              <div className="product-details ps-4">
                                <h6>{product.title}</h6>
                                <Button className="action-btn product-get"><RightArrowIcon /></Button>
                                <p>Size: <b>{variant.title}</b></p>
                                <p>Location: <b>{variant.sku ? variant.sku : 'N/A'}</b></p>
                              </div>
                            </div>
                          </Col>
                        </div>
                      ))
                    ) : (
                      <p>No variants available</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )
            ) : (
              <p>Loading products...</p>
            )}

          </Col>
        </Row>
        {show && <ProductModal show={show} handleClose={handleClose} productID={productID} variantID={variantID} />}

      </Container>
    </>
  )
}

export default Products
