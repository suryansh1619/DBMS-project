import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CButton, CForm, CFormSelect, CCard, CCardBody, CCardHeader, 
  CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell 
} from '@coreui/react';

const StudentEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollmentsResponse, studentsResponse, coursesResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/enrollments/admin`),
                    axios.get(`${baseURL}/api/students`),
                    axios.get(`${baseURL}/api/courses`)
                ]);
                setEnrollments(enrollmentsResponse.data);
                setStudents(studentsResponse.data);
                setCourses(coursesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="admin-container">
            <h1>Enrollments</h1>
            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Student Name</CTableHeaderCell>
                        <CTableHeaderCell>Course Name</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {enrollments.map((enrollment, index) => {
                        const student = students.find(s => s.student_id === enrollment.student_id);
                        const course = courses.find(c => c.course_id === enrollment.course_id)?.course_name;

                        return (
                            <CTableRow key={index}>
                                <CTableDataCell>{student ? `${student.first_name} ${student.last_name}` : 'N/A'}</CTableDataCell>
                                <CTableDataCell>{course || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" onClick={() => handleEdit(enrollment)} className="edit-btn">
                                        Edit
                                    </CButton>
                                    <CButton color="danger" onClick={() => handleDelete(enrollment.enrollment_id)} className="delete-btn">
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default StudentEnrollments;
