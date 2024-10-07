import React from 'react'
import {Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductModal = ({show, handleClose}) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-full">
    <Modal.Header closeButton>
      <Modal.Title>Full Page Modal</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>Welcome!</h4>
      <p>You are viewing this text in a full-page modal.</p>
      {/* You can add more content here */}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleClose}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default ProductModal
