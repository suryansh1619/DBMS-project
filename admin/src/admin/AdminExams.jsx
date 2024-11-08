import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CFormSelect, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const AdminExams = () => {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]); // State for storing courses
    const [examId, setExamId] = useState('');
    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [time, setTime] = useState('');
    const [courseId, setCourseId] = useState(''); // State for selected course
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetExamForm = () => {
        setExamId('');
        setExamName('');
        setExamDate('');
        setTime('');
        setCourseId(''); // Reset course selection
        setEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/exams`);
                setExams(response.data);
            } catch (err) {
                console.error('Error fetching exams:', err);
            }
        };
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/courses`);
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchExams();
        fetchCourses(); // Fetch courses on component mount
    }, []);

    const onSubmitExam = async (e) => {
        e.preventDefault();
        if (!examId || !examName || !examDate || !time || !courseId) return;
        const values = { exam_id: examId, exam_name: examName, exam_date: examDate, time, course_id: courseId };
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
        setTime(exam.time);
        setCourseId(exam.course_id); // Set course selection
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
                <CCardHeader>{editing ? 'Edit Exam' : 'Add Exam'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitExam}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                            <CFormInput
                                type="text"
                                placeholder="Exam Name"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                required
                            />
                            <CFormInput
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                required
                            />
                            <CFormInput
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                            <CFormSelect
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <CButton type="submit" color="primary">
                                {editing ? 'Update Exam' : 'Add Exam'}
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable striped>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Exam ID</CTableHeaderCell>
                        <CTableHeaderCell>Exam Name</CTableHeaderCell>
                        <CTableHeaderCell>Exam Date</CTableHeaderCell>
                        <CTableHeaderCell>Time</CTableHeaderCell>
                        <CTableHeaderCell>Course</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {exams.map((exam) => (
                        <CTableRow key={exam.exam_id}>
                            <CTableDataCell>{exam.exam_id}</CTableDataCell>
                            <CTableDataCell>{exam.exam_name}</CTableDataCell>
                            <CTableDataCell>{exam.exam_date.split('T')[0]}</CTableDataCell>
                            <CTableDataCell>{exam.exam_time}</CTableDataCell>
                            <CTableDataCell>{courses.find(course => course.course_code === exam.course_code)?.course_name || 'N/A'}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEdit(exam)}>Edit</CButton>
                                <CButton color="danger" onClick={() => handleDelete(exam.exam_id)}>Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default AdminExams;
