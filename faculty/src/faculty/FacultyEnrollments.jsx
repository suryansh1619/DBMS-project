import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell 
} from '@coreui/react';

const FacultyEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const baseURL = "http://localhost:5000";

    const getFacultyId = () => {
        return localStorage.getItem('instructorId');
    };
    const facultyId = getFacultyId();

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

    // Filter courses taught by the current faculty
    const facultyCourses = courses.filter(course => course.instructor_id === facultyId);

    // Filter enrollments to include only those related to the faculty's courses
    const facultyEnrollments = enrollments.filter(enrollment =>
        facultyCourses.some(course => course.course_id === enrollment.course_id)
    );

    return (
        <div className="admin-container">
            <h1>Enrollments for Faculty</h1>
            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Student Name</CTableHeaderCell>
                        <CTableHeaderCell>Student ID</CTableHeaderCell>
                        <CTableHeaderCell>Course Name</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {facultyEnrollments.map((enrollment, index) => {
                        const student = students.find(s => s.student_id === enrollment.student_id);
                        const course = facultyCourses.find(c => c.course_id === enrollment.course_id)?.course_name;

                        return (
                            <CTableRow key={index}>
                                <CTableDataCell>{student ? `${student.first_name} ${student.last_name}` : 'N/A'}</CTableDataCell>
                                <CTableDataCell>{student ? student.student_id : 'N/A'}</CTableDataCell>
                                <CTableDataCell>{course || 'N/A'}</CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default FacultyEnrollments;
