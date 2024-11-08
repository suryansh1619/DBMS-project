import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const FacultyExams = () => {
    const [exams, setExams] = useState([]);
    const [examId, setExamId] = useState('');
    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [duration, setDuration] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
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

    const onSubmitExam = async (e) => {
        e.preventDefault();
        if (!examId || !examName || !examDate || !duration) return;
        const values = { exam_id: examId, exam_name: examName, exam_date: examDate, duration };
        try {
            if (editing) {
                await axios.put(`${baseURL}/api/exams/${editingId}`, values, { withCredentials: true });
                console.log('Exam updated');
            } else {
                await axios.post(`${baseURL}/api/exams`, values, { withCredentials: true });
                console.log('New exam added');
            }

            const updatedExams = await axios.get(`${baseURL}/api/exams`);
            setExams(updatedExams.data);
            resetExamForm();
        } catch (err) {
            console.error('Error adding/updating exam:', err);
        }
    };

    const handleEdit = (exam) => {
        setExamId(exam.exam_id);
        setExamName(exam.exam_name);
        setExamDate(exam.exam_date);
        setDuration(exam.duration);
        setEditing(true);
        setEditingId(exam.exam_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/exams/${id}`, { withCredentials: true });
            const updatedExams = await axios.get(`${baseURL}/api/exams`);
            setExams(updatedExams.data);
        } catch (err) {
            console.error('Error deleting exam:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Exams</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Exam' : 'Add New Exam'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitExam}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                            <CFormInput
                                type='text'
                                name='examName'
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                placeholder='Exam Name'
                                required
                            />
                            <CFormInput
                                type='date'
                                name='examDate'
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                placeholder='Exam Date'
                                required
                            />
                            <CFormInput
                                type='text'
                                name='duration'
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder='Duration (in hours)'
                                required
                            />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <CButton type="submit" color="primary" style={{ width: '15%' }}>
                                {editing ? 'Update' : 'Add'} Exam
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

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
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEdit(exam)} className="edit-btn">
                                    Edit
                                </CButton>
                                <CButton color="danger" onClick={() => handleDelete(exam.exam_id)} className="delete-btn">
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

export default FacultyExams;
