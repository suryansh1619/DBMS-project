import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CButton, CForm, CFormInput, CFormSelect, CCard, CCardBody, CCardHeader, 
    CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell
} from '@coreui/react';

const AdminInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructorData, setInstructorData] = useState({
        instructor_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        hire_date: '',
        department_id: '',
        password: '' // Add password field
    });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [instructorsResponse, departmentsResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/instructors/admin`),
                    axios.get(`${baseURL}/api/departments`)
                ]);
                setInstructors(instructorsResponse.data);
                setDepartments(departmentsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const resetInstructorForm = () => {
        setInstructorData({
            instructor_id: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            hire_date: '',
            department_id: '',
            password: '' // Reset password field
        });
        setEditing(false);
        setEditingId(null);
    }

    const onSubmitInstructor = async (e) => {
        e.preventDefault();
        if (!instructorData.instructor_id || !instructorData.first_name || !instructorData.last_name || !instructorData.email || !instructorData.department_id) return;

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/instructors/admin/${editingId}`, instructorData, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/instructors/admin/add`, instructorData, { withCredentials: true });
            }
            const updatedInstructors = await axios.get(`${baseURL}/api/instructors/admin`);
            setInstructors(updatedInstructors.data);
            resetInstructorForm();
        } catch (err) {
            console.error('Error submitting instructor:', err);
        }
    };

    const handleEdit = (instructor) => {
        setInstructorData({
            instructor_id: instructor.instructor_id,
            first_name: instructor.first_name,
            last_name: instructor.last_name,
            email: instructor.email,
            phone: instructor.phone,
            hire_date: instructor.hire_date,
            department_id: instructor.department_id,
            password: '' // Do not show password on edit, keep it blank
        });
        setEditing(true);
        setEditingId(instructor.instructor_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/instructors/admin/${id}`, { withCredentials: true });
            const updatedInstructors = await axios.get(`${baseURL}/api/instructors/admin`);
            setInstructors(updatedInstructors.data);
        } catch (err) {
            console.error('Error deleting instructor:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInstructorData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="admin-container">
            <h1>Instructors</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Instructor' : 'Add New Instructor'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitInstructor}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <CFormInput
                                type="text"
                                name="instructor_id"
                                value={instructorData.instructor_id}
                                onChange={handleChange}
                                placeholder="Instructor ID"
                                required={!editing}
                            />
                            <CFormInput
                                type="text"
                                name="first_name"
                                value={instructorData.first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                            <CFormInput
                                type="text"
                                name="last_name"
                                value={instructorData.last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                            <CFormInput
                                type="email"
                                name="email"
                                value={instructorData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                            <CFormInput
                                type="tel"
                                name="phone"
                                value={instructorData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                            <CFormInput
                                type="date"
                                name="hire_date"
                                value={instructorData.hire_date}
                                onChange={handleChange}
                            />
                            <CFormSelect
                                name="department_id"
                                value={instructorData.department_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.department_name}
                                    </option>
                                ))}
                            </CFormSelect>
                            {/* Password Field */}
                            {!editing && (
                                <CFormInput
                                    type="password"
                                    name="password"
                                    value={instructorData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                />
                            )}
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <CButton type="submit" color="primary" style={{ width: '15%' }}>
                                {editing ? 'Update' : 'Add'} Instructor
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>First Name</CTableHeaderCell>
                        <CTableHeaderCell>Last Name</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Phone</CTableHeaderCell>
                        <CTableHeaderCell>Hire Date</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {instructors.map((instructor) => {
                        const department = departments.find(d => d.department_id === instructor.department_id)?.department_name;
                        return (
                            <CTableRow key={instructor.instructor_id}>
                                <CTableDataCell>{instructor.instructor_id}</CTableDataCell>
                                <CTableDataCell>{instructor.first_name}</CTableDataCell>
                                <CTableDataCell>{instructor.last_name}</CTableDataCell>
                                <CTableDataCell>{instructor.email}</CTableDataCell>
                                <CTableDataCell>{instructor.phone || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{instructor.hire_date.split("T")[0] || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{department}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" onClick={() => handleEdit(instructor)}>
                                        Edit
                                    </CButton>
                                    <CButton color="danger" onClick={() => handleDelete(instructor.instructor_id)}>
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

export default AdminInstructors;
