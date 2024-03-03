import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, [sortBy, sortDirection]); 

  useEffect(() => {
    fetchData();
  }, [currentPage, sortBy]); 

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/customers?page=${currentPage}&sortBy=${sortBy}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const paginateData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    setSortedData(paginatedData);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortBy = (option) => {
    if (option === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };
  

  const renderTableData = () => {
    let filteredData = data.filter((item) =>
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    filteredData = filteredData.slice(startIndex, endIndex);

    if (sortBy === 'date') {
      filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'time') {
      filteredData.sort((a, b) => {
        const timeA = moment(a.created_at).format('HH:mm:ss');
        const timeB = moment(b.created_at).format('HH:mm:ss');
        return timeA.localeCompare(timeB);
      });
    }

    if (sortDirection === 'desc') {
      filteredData.reverse();
    }


    return filteredData.map((item) => (
      <tr key={item.sno}>
        <td>{item.customer_name}</td>
        <td>{item.age}</td>
        <td>{item.phone}</td>
        <td>{item.location}</td>
        <td>{moment(item.create_at).format('YYYY-MM-DD')}</td>
        <td>{moment(item.create_at).format('HH:mm:ss')}</td>
      </tr>
    ));
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);

  return (
    <div className="App">
      <h1>Customer Data</h1>
      <Form>
        <Form.Control
          className="search-input"
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>
      <div className="button-group">
        <Button className="sort-button" onClick={() => handleSortBy('date')}>Sort by Date</Button>
        <Button className="sort-button" onClick={() => handleSortBy('time')}>Sort by Time</Button>
      </div>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </Table>
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
  {Array.from({ length: totalPages }, (_, index) => (
    <Button key={index + 1} onClick={() => setCurrentPage(index + 1)} style={{padding: '12px', margin: '0 10px'}}>
      {index + 1}
    </Button>
  ))}
</div>

    </div>
  );
}

export default App;
