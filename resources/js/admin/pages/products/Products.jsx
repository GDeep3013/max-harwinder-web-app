import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {RightArrowIcon, Edit, Remove } from '../../../components/svg-icons/icons';
import ProductModal from './ProductModal';

const Products = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => { setShow(false) };
  const handleShow = () => setShow(true);
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
    let url = `/product?&search=${encodeURIComponent(search)}`; // Include currentPage in the URL
    let result = await fetch(url);
    result = await result.json();
    if (result.status) {
      console.log(result, "getEmployee") // Set totalPages received from the backend
      setProducts(result.data)
    }
    setLoading(true);
  }


  return (
    <Container className="cvs-product-page">
      <Row className="justify-content-center">
        {/* Heading on a separate line */}
        <Col xs={12} className="text-center my-3">
          <h3>PRODUCT LOOKUP</h3> {/* Full-width heading */}
        </Col>

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
        <Col xs={12} className="d-flex justify-content-center my-3">
          {loading ? (
            products.map((product, ind) => (
              <Row className="search_listing_row" key={ind} onClick={handleShow}>

                <Col xs={12}>
                  <div className="d-flex product_outer">
                    <div className="product_img">
                      <img src={product.image} alt="product img" />
                    </div>
                    <div className="product-details">
                      <h6>{product.title}</h6>
                      <Button className="action-btn product-get"><RightArrowIcon/></Button>
                      {/* {product.variants.length > 0 ? (
                        <>
                          <p>One Size</p>
                          <p>$24.90</p>
                        </>
                      ) : null} */}

                    </div>
                  </div>

                </Col>
              </Row>
            ))
          ) : (
            <p>Loading products...</p> // Optional loading message
          )}
        </Col>
      </Row>
      <ProductModal show={show} handleClose={handleClose} />
    </Container>
  )
}

export default Products
