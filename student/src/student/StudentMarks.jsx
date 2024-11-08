import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const StudentMarks = () => {
    const [marks, setMarks] = useState([]);
    const baseURL = "http://localhost:5000";


    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/marks`);
                setMarks(response.data);
            } catch (err) {
                console.error('Error fetching marks:', err);
            }
        };
        fetchMarks();
    }, []);

    return (
        <div className='admin-container'>
            <h1>Exam Marks</h1>
            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Mark ID</CTableHeaderCell>
                        <CTableHeaderCell>Student ID</CTableHeaderCell>
                        <CTableHeaderCell>Exam ID</CTableHeaderCell>
                        <CTableHeaderCell>Obtained Marks</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {marks.map(mark => (
                        <CTableRow key={mark.mark_id}>
                            <CTableDataCell>{mark.mark_id}</CTableDataCell>
                            <CTableDataCell>{mark.student_id}</CTableDataCell>
                            <CTableDataCell>{mark.exam_id}</CTableDataCell>
                            <CTableDataCell>{mark.obtained_marks}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default StudentMarks;
