import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CFormSelect, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newCourse, setNewCourse] = useState({
        course_name: '',
        course_code: '',
        credits: '',
        department_id: '',
        instructor_id: ''
    });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, deptRes, instRes] = await Promise.all([
                    axios.get(`${baseURL}/api/courses/admin`),
                    axios.get(`${baseURL}/api/departments`),
                    axios.get(`${baseURL}/api/instructors`)
                ]);
                setCourses(courseRes.data);
                setDepartments(deptRes.data);
                setInstructors(instRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const resetNewCourseForm = () => {
        setNewCourse({
            course_name: '',
            course_code: '',
            credits: '',
            department_id: '',
            instructor_id: ''
        });
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitCourse = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${baseURL}/api/courses/admin/${editingId}`, newCourse, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/courses/admin/add`, newCourse, { withCredentials: true });
            }
            const updatedCourses = await axios.get(`${baseURL}/api/courses/admin`);
            setCourses(updatedCourses.data);
            resetNewCourseForm();
        } catch (err) {
            console.error('Error adding/updating course:', err);
        }
    };

    const handleEdit = (course) => {
        setNewCourse({
            course_name: course.course_name,
            course_code: course.course_code,
            credits: course.credits,
            department_id: course.department_id,
            instructor_id: course.instructor_id
        });
        setEditing(true);
        setEditingId(course.course_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/courses/admin/${id}`, { withCredentials: true });
            const updatedCourses = await axios.get(`${baseURL}/api/courses/admin`);
            setCourses(updatedCourses.data);
        } catch (err) {
            console.error('Error deleting course:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
    };

    return (
        <div className="admin-container">
            <h1>Courses</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Course' : 'Add New Course'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitCourse}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            <CFormInput
                                type="text"
                                name="course_name"
                                value={newCourse.course_name}
                                onChange={handleChange}
                                placeholder="Course Name"
                                required
                            />
                            <CFormInput
                                type="text"
                                name="course_code"
                                value={newCourse.course_code}
                                onChange={handleChange}
                                placeholder="Course Code"
                                required
                            />
                            <CFormInput
                                type="number"
                                name="credits"
                                value={newCourse.credits}
                                onChange={handleChange}
                                placeholder="Credits"
                                required
                            />
                            <CFormSelect
                                name="department_id"
                                value={newCourse.department_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(department => (
                                    <option key={department.department_id} value={department.department_id}>
                                        {department.department_name}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CFormSelect
                                name="instructor_id"
                                value={newCourse.instructor_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Instructor</option>
                                {instructors.map(instructor => (
                                    <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                        {instructor.first_name + " " + instructor.last_name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>
                        <CButton type="submit" color="primary" className="mt-3">
                            {editing ? 'Update' : 'Add'} Course
                        </CButton>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable hover responsive className="mt-4">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Course Name</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Instructor</CTableHeaderCell>
                        <CTableHeaderCell>Course Code</CTableHeaderCell>
                        <CTableHeaderCell>Credits</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {courses.map((course) => (
                        <CTableRow key={course.course_id}>
                            <CTableDataCell>{course.course_name}</CTableDataCell>
                            <CTableDataCell>
                                {departments.find(d => d.department_id === course.department_id)?.department_name}
                            </CTableDataCell>
                            <CTableDataCell>
                                {instructors.find(i => i.instructor_id === course.instructor_id)?.first_name + " " +
                                instructors.find(i => i.instructor_id === course.instructor_id)?.last_name}
                            </CTableDataCell>
                            <CTableDataCell>{course.course_code}</CTableDataCell>
                            <CTableDataCell>{course.credits}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEdit(course)}>
                                    Edit
                                </CButton>
                                <CButton color="danger" onClick={() => handleDelete(course.course_id)}>
                                    Delete
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default AdminCourses;
