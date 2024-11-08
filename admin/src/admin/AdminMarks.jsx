import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const AdminMarks = () => {
    const [marks, setMarks] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [examId, setExamId] = useState('');
    const [obtainedMarks, setObtainedMarks] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetNewMarkForm = () => {
        setStudentId('');
        setExamId('');
        setObtainedMarks('');
        setEditing(false);
        setEditingId(null);
    };

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

    const onSubmitMark = async (e) => {
        e.preventDefault();
        if (!studentId || !examId || !obtainedMarks) return;
        const values = { student_id: studentId, exam_id: examId, obtained_marks: obtainedMarks };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/marks/${editingId}`, values, { withCredentials: true });
                console.log('Mark updated');
            } else {
                await axios.post(`${baseURL}/api/marks`, values, { withCredentials: true });
                console.log('New mark added');
            }

            const updatedMarks = await axios.get(`${baseURL}/api/marks`);
            setMarks(updatedMarks.data);
            resetNewMarkForm();
        } catch (err) {
            console.error('Error adding/updating mark:', err);
        }
    };

    const handleEdit = (mark) => {
        setStudentId(mark.student_id);
        setExamId(mark.exam_id);
        setObtainedMarks(mark.obtained_marks);
        setEditing(true);
        setEditingId(mark.mark_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/marks/${id}`, { withCredentials: true });
            const updatedMarks = await axios.get(`${baseURL}/api/marks`);
            setMarks(updatedMarks.data);
        } catch (err) {
            console.error('Error deleting mark:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Exam Marks</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Mark' : 'Add New Mark'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitMark}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                            <CFormInput
                                type='text'
                                name='studentId'
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder='Student ID'
                                required
                            />
                            <CFormInput
                                type='text'
                                name='examId'
                                value={examId}
                                onChange={(e) => setExamId(e.target.value)}
                                placeholder='Exam ID'
                                required
                            />
                            <CFormInput
                                type='number'
                                name='obtainedMarks'
                                value={obtainedMarks}
                                onChange={(e) => setObtainedMarks(e.target.value)}
                                placeholder='Obtained Marks'
                                required
                            />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <CButton type="submit" color="primary" style={{ width: '15%' }}>
                                {editing ? 'Update' : 'Add'} Mark
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Mark ID</CTableHeaderCell>
                        <CTableHeaderCell>Student Name</CTableHeaderCell>
                        <CTableHeaderCell>Exam</CTableHeaderCell>
                        <CTableHeaderCell>Course</CTableHeaderCell>
                        <CTableHeaderCell>Obtained Marks</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {marks.map(mark => (
                        <CTableRow key={mark.mark_id}>
                            {console.log(mark)}
                            <CTableDataCell>{mark.mark_id}</CTableDataCell>
                            <CTableDataCell>{mark.student_first_name} {mark.student_last_name}</CTableDataCell>
                            <CTableDataCell>{mark.exam_name}</CTableDataCell>
                            <CTableDataCell>{mark.course_name}</CTableDataCell>
                            <CTableDataCell>{mark.obtained_marks}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEdit(mark)} className="edit-btn">
                                    Edit
                                </CButton>
                                <CButton color="danger" onClick={() => handleDelete(mark.mark_id)} className="delete-btn">
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

export default AdminMarks;
