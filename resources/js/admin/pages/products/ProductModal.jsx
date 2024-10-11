import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { RightArrowIcon, Edit, Remove } from '../../../components/svg-icons/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'

const ProductModal = ({ show, handleClose, productID, variantID }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  console.log(typeof (variantID), variantID.length, variantID, productID, "ProductVariant")
  const [variantIds, setVariantIds] = useState(0);
  const [productIds, setProductIds] = useState(0);
  const [variantSKU, setVariantSKU] = useState("");
  const handleChange = (e) => {
    setVariantSKU(e.target.value);
  };
  useEffect(() => {
    if (show && productID) {
      const productId = productID.replace("gid://shopify/Product/", "");
      const variantId = variantID.replace("gid://shopify/ProductVariant/", "");
      console.log(productId, variantId, "datttttt")
      setVariantIds(parseInt(variantId));
      setProductIds(parseInt(productId));
      if (productId > 0) {

        getProductVariants(parseInt(productId))
      }
    }
  }, [show, productID])

  async function getProductVariants(product) {
    setLoading(false);
    let url = `/get-product?productId=${product}`; // Include currentPage in the URL
    let result = await fetch(url);
    result = await result.json();
    if (result.status) {
      console.log(result, "getEmployee") // Set totalPages received from the backend
      setProducts(result.data)
    }
    setLoading(true);
  }
  const handleShow = () => {
    console.log("Product Details Section Triggred");
  }
  const handleSubmit = async () => {
    setLoading(false);
    try {
      const queryParams = new URLSearchParams({
        productId: productIds,
        variantId: variantIds,
        sku: variantSKU,
      }).toString();

      const response = await fetch(`/update-product?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers if necessary
        },
      });

      const result = await response.json();
      setLoading(true);
      if (result.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: result.message,
          showConfirmButton: false,
          timer: 1500
        });
        handleClose();
      } else {
        console.log(result, "error")
      }

    } catch (err) {
      // show(err.message, { duration: 2000, isError: true })
      console.log(err.message)
    }
  }

  console.log(variantIds, products, "ProductModelPage")
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-full">
      <Modal.Header closeButton>
        <Modal.Title>LOCATION CHANGE:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} className="my-3 product-model-outer-details">
            {loading ? (
              products && products.variants && products.variants.length > 0 && (
                products.variants.map((variant, ind) => {
                  if (variantIds > 0) {
                    if (variantIds === variant.id) {
                      return (
                        <div className="search_listing_row" key={ind} onClick={handleShow}>
                          <Col xs={12}>
                            <div className="d-flex product_outer">
                              <div className="product_img">
                                <img src={products.image.src} alt="product img" />
                              </div>
                              <div className="product-details ps-4">
                                <h6>{products.title}</h6>
                                <p>Size: <b>{variant.title}</b></p>
                                <div className="product-location">

                                  <h3>CURRENT LOCATION:<span>{variant.sku}</span></h3>
                                </div>
                                <div className="product-location">

                                  <Form.Label htmlFor="inputPassword5">NEW LOCATION</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="inputPassword5"
                                    aria-describedby="passwordHelpBlock"
                                    value={variantSKU}
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>
                        </div>
                      );
                    }
                  }
                })
              )
            ) : (
              <p>Loading products...</p>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProductModal
