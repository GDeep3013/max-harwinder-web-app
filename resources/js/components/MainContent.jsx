import React, { useState, useEffect } from 'react'
import { Container, Row, Col, DropdownButton, Form, Dropdown, Button } from 'react-bootstrap'

import Pagination from 'react-bootstrap/Pagination';
// import { selectFilterValue } from '../../store/slices/DashboardSlice'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
function MainContent() {
    // const filterValue = useSelector(selectFilterValue);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [project, setProject] = useState([]);


    // useEffect(() => {
    //     getProject(filterValue);
    // }, [searchTerm || selectedTerm, currentPage, filterValue]);

    // async function getProject(filterValue) {
    //     let url = `/api/fetch-project?page=${currentPage}`;
    //      if (filterValue && (filterValue.price !== null || filterValue.technology.length > 0)) {
    //         const filterParams = new URLSearchParams(filterValue).toString();
    //         url += `&${filterParams}`;
    // }

    // // Add searchTerm or selectedTerm to the URL if provided
    // if (searchTerm || selectedTerm) {
    //     const searchTermValue = selectedTerm ? selectedTerm : searchTerm;
    //     url += `&searchTerm=${encodeURIComponent(searchTermValue)}`;
    // }
    //     let result = await fetch(url);
    //     result = await result.json();
    //     if (result.status === 'success') {
    //         setProject(result.projects);
    //         setTotalPages(result.totalPages);
    //     }
    // }
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleSelectChange = (e) => {
        setSelectedTerm(e.target.value);
    };

    const options = [
        { value: '', label: 'All' },
        { value: 'HTML', label: 'HTML' },
        { value: 'CSS', label: 'CSS' },
        { value: 'Figma', label: 'Figma' },
        { value: 'Wordpress', label: 'Wordpress' },
        { value: 'Php', label: 'Php' },
        { value: 'Shopify', label: 'Shopify' },
    ];


    return (
        <div>
            <div className='latest-projects main-context'>
                <Container>
                    <Row className='align-items-center'>
                        <Col md={2}>
                            <h2>Staff </h2>
                        </Col>
                        <Col md={10} className='text-end'>
                            <div className='filterBox'>
                                <div className='d-flex'>
                                    <span>Filter by:</span>
                                    <Form.Control placeholder="Search here..." value={searchTerm} onChange={handleSearch} />
                                       {/*  <Form.Select aria-label="Default select example"  className='filter-select' onChange={handleSelectChange}>
                                        {options.map((option, index) => (
                                            <option key={index} value={option.value}>{option.label}</option>
                                        ))}
                                    </Form.Select> */}
                                    <Button className='custom-btn'>Search</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            
        </div>
    )
}

export default MainContent
