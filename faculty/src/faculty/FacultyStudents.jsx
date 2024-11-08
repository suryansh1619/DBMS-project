import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CFormSelect, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const FacultyStudents = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newStudent, setNewStudent] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        dob: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        enrollment_year: '',
        department_id: '',
    });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/students/admin`);
                setStudents(response.data);
            } catch (err) {
                console.error('Error fetching students:', err);
            }
        };
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setDepartments(response.data);
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };

        fetchDepartments();
        fetchStudents();
    }, []);

    const onSubmitStudent = async (e) => {
        e.preventDefault();

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/students/admin/${editingId}`, newStudent, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/students/admin/add`, newStudent, { withCredentials: true });
            }
            const updatedStudents = await axios.get(`${baseURL}/api/students`);
            setStudents(updatedStudents.data);
            resetNewStudentForm();
        } catch (err) {
            console.error('Error adding/updating student:', err);
        }
    };

    const handleEdit = (student) => {
        setNewStudent({
            student_id: student.student_id,  
            first_name: student.first_name,
            last_name: student.last_name,
            dob: student.dob,
            email: student.email,
            phone: student.phone,
            address: student.address,
            gender: student.gender,
            enrollment_year: student.enrollment_year,
            department_id: student.department_id,
        });
        setEditing(true);
        setEditingId(student.student_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/students/admin/${id}`, { withCredentials: true });
            const updatedStudents = await axios.get(`${baseURL}/api/students`);
            setStudents(updatedStudents.data);
        } catch (err) {
            console.error('Error deleting student:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    };

    return (
        <div className="admin-container">
            <h1>Students</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Student' : 'Add New Student'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitStudent}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <CFormInput
                                type="text"
                                name="student_id"
                                value={newStudent.student_id}
                                onChange={handleChange}
                                placeholder="Student ID"
                                required={!editing}  
                            />
                            <CFormInput
                                type="text"
                                name="first_name"
                                value={newStudent.first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                            <CFormInput
                                type="text"
                                name="last_name"
                                value={newStudent.last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                            <CFormInput
                                type="date"
                                name="dob"
                                value={newStudent.dob}
                                onChange={handleChange}
                                placeholder="Date of Birth"
                            />
                            <CFormInput
                                type="email"
                                name="email"
                                value={newStudent.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                            <CFormInput
                                type="tel"
                                name="phone"
                                value={newStudent.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                            <CFormInput
                                type="text"
                                name="address"
                                value={newStudent.address}
                                onChange={handleChange}
                                placeholder="Address"
                            />
                            <CFormSelect
                                name="gender"
                                value={newStudent.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </CFormSelect>
                            <CFormInput
                                type="number"
                                name="enrollment_year"
                                value={newStudent.enrollment_year}
                                onChange={handleChange}
                                placeholder="Enrollment Year"
                                required
                            />
                            <CFormSelect
                                name="department_id"
                                value={newStudent.department_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.department_name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>
                        <CButton type="submit" color="primary">
                            {editing ? 'Update' : 'Add'} Student
                        </CButton>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Student ID</CTableHeaderCell>
                        <CTableHeaderCell>First Name</CTableHeaderCell>
                        <CTableHeaderCell>Last Name</CTableHeaderCell>
                        <CTableHeaderCell>DOB</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Phone</CTableHeaderCell>
                        <CTableHeaderCell>Address</CTableHeaderCell>
                        <CTableHeaderCell>Gender</CTableHeaderCell>
                        <CTableHeaderCell>Enrollment Year</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {students.map((student) => (
                        <CTableRow key={student.student_id}>
                            <CTableDataCell>{student.student_id}</CTableDataCell>
                            <CTableDataCell>{student.first_name}</CTableDataCell>
                            <CTableDataCell>{student.last_name}</CTableDataCell>
                            <CTableDataCell>{student.dob.split('T')[0]}</CTableDataCell>
                            <CTableDataCell>{student.email}</CTableDataCell>
                            <CTableDataCell>{student.phone}</CTableDataCell>
                            <CTableDataCell>{student.address}</CTableDataCell>
                            <CTableDataCell>{student.gender}</CTableDataCell>
                            <CTableDataCell>{student.enrollment_year}</CTableDataCell>
                            <CTableDataCell>{departments.find(dept => dept.department_id === student.department_id)?.department_name}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEdit(student)} className="edit-btn">
                                    Edit
                                </CButton>
                                <CButton color="danger" onClick={() => handleDelete(student.student_id)} className="delete-btn">
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

export default FacultyStudents;
