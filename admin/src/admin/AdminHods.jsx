import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    CButton, CForm, CFormInput, CFormSelect, CContainer, 
    CCard, CCardHeader, CCardBody, CTable, CTableHead, 
    CTableRow, CTableHeaderCell, CTableBody, CTableDataCell 
} from '@coreui/react';
// import './adminDesign.css';

const AdminHOD = () => {
    const [hods, setHods] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedHOD, setSelectedHOD] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [hodEmail, setHodEmail] = useState('');
    const [hodPhone, setHodPhone] = useState('');
    const [hodHireDate, setHodHireDate] = useState('');
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hodsRes, departmentsRes, instructorsRes] = await Promise.all([
                    axios.get(`${baseURL}/api/hods/admin`),
                    axios.get(`${baseURL}/api/departments`),
                    axios.get(`${baseURL}/api/instructors`),
                ]);
                setHods(hodsRes.data);
                setDepartments(departmentsRes.data);
                setInstructors(instructorsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const resetNewHODForm = () => {
        setSelectedHOD('');
        setSelectedDepartment('');
        setHodEmail('');
        setHodPhone('');
        setHodHireDate('');
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitHOD = async (e) => {
        e.preventDefault();
        if (!selectedDepartment || !hodEmail || !hodPhone || !hodHireDate) {
            return;
        }

        const selectedInstructor = instructors.find(instructor => `${instructor.first_name} ${instructor.last_name}` === selectedHOD);
        const hodNameParts = selectedHOD.split(' ');
        const firstName = hodNameParts[0];
        const lastName = hodNameParts.slice(1).join(' ');

        const values = {
            hod_first_name: firstName,
            hod_last_name: lastName,
            department_id: selectedDepartment,
            email: hodEmail,
            phone: hodPhone,
            hire_date: hodHireDate,
        };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/hods/admin/${editingId}`, values, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/hods/admin/add`, values, { withCredentials: true });
            }
            const updatedHods = await axios.get(`${baseURL}/api/hods`);
            setHods(updatedHods.data);
            resetNewHODForm();
        } catch (err) {
            console.error('Error adding/updating HOD:', err);
        }
    };

    const handleEdit = (hod) => {
        setSelectedHOD(hod.hod_name); // Set the HOD name for editing
        setSelectedDepartment(hod.department_id);
        setHodEmail(hod.hod_email);
        setHodPhone(hod.phone_number);
        setHodHireDate(hod.hire_date.split('T')[0]);
        setEditing(true);
        setEditingId(hod.hod_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/hods/admin/${id}`, { withCredentials: true });
            const updatedHods = await axios.get(`${baseURL}/api/hods`);
            setHods(updatedHods.data);
        } catch (err) {
            console.error('Error deleting HOD:', err);
        }
    };

    return (
        <CContainer>
            <CCard className="mb-3">
                <CCardHeader>
                    <h5>Head of Department</h5>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitHOD} className="row g-3">
                        <div className="col-md-4">
                            <CFormSelect
                                value={selectedHOD}
                                onChange={(e) => setSelectedHOD(e.target.value)}
                                required
                            >
                                <option value='' disabled>Select HOD</option>
                                {instructors.map(instructor => (
                                    <option key={instructor.instructor_id} value={`${instructor.first_name} ${instructor.last_name}`}>
                                        {instructor.first_name} {instructor.last_name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="col-md-4">
                            <CFormSelect
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                required
                            >
                                <option value='' disabled>Select Department</option>
                                {departments.map(department => (
                                    <option key={department.department_id} value={department.department_id}>
                                        {department.department_name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="col-md-4">
                            <CFormInput
                                type="email"
                                value={hodEmail}
                                onChange={(e) => setHodEmail(e.target.value)}
                                placeholder="HOD Email"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <CFormInput
                                type="text"
                                value={hodPhone}
                                onChange={(e) => setHodPhone(e.target.value)}
                                placeholder="Phone Number"
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <CFormInput
                                type="date"
                                value={hodHireDate}
                                onChange={(e) => setHodHireDate(e.target.value)}
                                placeholder="Hire Date"
                                required
                            />
                        </div>

                        <div className="col-12">
                            <CButton type="submit" color="primary" className="mt-3">
                                {editing ? 'Update' : 'Add'} HOD
                            </CButton>
                        </div>
                    </CForm>

                    <CTable hover bordered responsive size="sm" className="mt-4">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>HOD Name</CTableHeaderCell>
                                <CTableHeaderCell>Email</CTableHeaderCell>
                                <CTableHeaderCell>Phone Number</CTableHeaderCell>
                                <CTableHeaderCell>Hire Date</CTableHeaderCell>
                                <CTableHeaderCell>Department</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {hods.map((hod) => (
                                <CTableRow key={hod.hod_id}>
                                    <CTableDataCell>{hod.first_name} {hod.last_name}</CTableDataCell>
                                    <CTableDataCell>{hod.email}</CTableDataCell>
                                    <CTableDataCell>{hod.phone}</CTableDataCell>
                                    <CTableDataCell>{hod.hire_date.split('T')[0]}</CTableDataCell>
                                    <CTableDataCell>{departments.find(d => d.department_id === hod.department_id)?.department_name}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton color="info" onClick={() => handleEdit(hod)} size="sm" className="me-2">
                                            Edit
                                        </CButton>
                                        <CButton color="danger" onClick={() => handleDelete(hod.hod_id)} size="sm">
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

export default AdminHOD;
