import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CContainer, CCard, CCardHeader, CCardBody } from '@coreui/react';
// import './adminDesign.css';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetNewDepartmentForm = () => {
        setNewDepartment('');
        setEditing(false);
        setEditingId(null);
    };

    departments.sort((a, b) => a.department_id - b.department_id);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setDepartments(response.data);
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };
        fetchDepartments();
    }, []);

    const onSubmitDepartment = async (e) => {
        e.preventDefault();
        if (!newDepartment) return;
        const values = { department_name: newDepartment };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/departments/admin/${editingId}`, values, { withCredentials: true });
                console.log('Department updated');
            } else {
                await axios.post(`${baseURL}/api/departments/admin/add`, values, { withCredentials: true });
                console.log('New department added');
            }

            const updatedDepartments = await axios.get(`${baseURL}/api/departments`);
            setDepartments(updatedDepartments.data);
            resetNewDepartmentForm();
        } catch (err) {
            console.error('Error adding/updating department:', err);
        }
    };

    const handleEdit = (department) => {
        setNewDepartment(department.department_name);
        setEditing(true);
        setEditingId(department.department_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/departments/admin/${id}`, { withCredentials: true });
            const updatedDepartments = await axios.get(`${baseURL}/api/departments`);
            setDepartments(updatedDepartments.data);
        } catch (err) {
            console.error('Error deleting department:', err);
        }
    };

    return (
        <CContainer>
            <CCard className="mb-3">
                <CCardHeader>
                    <h5 style={{ fontSize: '18px' }}>Departments</h5>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitDepartment} className="d-flex mb-3">
                        <CFormInput
                            type="text"
                            value={newDepartment}
                            onChange={(e) => setNewDepartment(e.target.value)}
                            placeholder="Department Name"
                            required
                            className="me-2"
                            size="sm" // Smaller size for the input
                            style={{ fontSize: '14px', padding: '5px' }} // Reduced font size and padding
                        />
                        <CButton type="submit" color={editing ? "warning" : "primary"} size="sm" style={{ fontSize: '14px' }}>
                            {editing ? 'Update' : 'Add'} Department
                        </CButton>
                    </CForm>

                    <CTable hover bordered responsive size="sm">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ fontSize: '14px' }}>Department ID</CTableHeaderCell>
                                <CTableHeaderCell style={{ fontSize: '14px' }}>Department Name</CTableHeaderCell>
                                <CTableHeaderCell style={{ fontSize: '14px' }}>Actions</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {departments.map(department => (
                                <CTableRow key={department.department_id}>
                                    <CTableDataCell style={{ fontSize: '14px' }}>{department.department_id}</CTableDataCell>
                                    <CTableDataCell style={{ fontSize: '14px' }}>{department.department_name}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton color="info" onClick={() => handleEdit(department)} className="me-2" size="sm">
                                            Edit
                                        </CButton>
                                        <CButton color="danger" onClick={() => handleDelete(department.department_id)} size="sm">
                                            Delete
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </CContainer>
    );
};

export default AdminDepartments;
