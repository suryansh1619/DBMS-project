import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const StudentExams = () => {
    const [exams, setExams] = useState([]);
    const baseURL = "http://localhost:5000";

    const resetExamForm = () => {
        setExamId('');
        setExamName('');
        setExamDate('');
        setDuration('');
        setEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/exams/admin`);
                setExams(response.data);
            } catch (err) {
                console.error('Error fetching exams:', err);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className='admin-container'>
            <h1>Exams</h1>
            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Exam ID</CTableHeaderCell>
                        <CTableHeaderCell>Exam Name</CTableHeaderCell>
                        <CTableHeaderCell>Exam Date</CTableHeaderCell>
                        <CTableHeaderCell>Duration (hrs)</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {exams.map(exam => (
                        <CTableRow key={exam.exam_id}>
                            <CTableDataCell>{exam.exam_id}</CTableDataCell>
                            <CTableDataCell>{exam.exam_name}</CTableDataCell>
                            <CTableDataCell>{exam.exam_date}</CTableDataCell>
                            <CTableDataCell>{exam.duration}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default StudentExams;
