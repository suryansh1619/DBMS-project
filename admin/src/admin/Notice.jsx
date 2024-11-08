import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CButton,
    CForm,
    CFormInput,
    CFormTextarea,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CContainer,
    CImage,
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ heading: '', content: '', image_url: '' });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const fetchNotices = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/notices`);
            setNotices(response.data);
        } catch (err) {
            console.error('Error fetching notices:', err);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleInputChange = (e) => {
        setNewNotice({ ...newNotice, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${baseURL}/api/notices/admin/${editingId}`, newNotice);
                console.log('Notice updated');
            } else {
                await axios.post(`${baseURL}/api/notices/admin/add`, newNotice);
                console.log('New notice added');
            }
            fetchNotices();
            setNewNotice({ heading: '', content: '', image_url: '' });
            setEditing(false);
            setEditingId(null);
        } catch (err) {
            console.error('Error adding/updating notice:', err);
        }
    };

    const handleEdit = (notice) => {
        setNewNotice({ heading: notice.heading, content: notice.content, image_url: notice.image_url });
        setEditing(true);
        setEditingId(notice.notice_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/notices/admin/${id}`);
            fetchNotices();
        } catch (err) {
            console.error('Error deleting notice:', err);
        }
    };

    return (
        <CContainer className='notice-container'>
            <h1>Manage Notices</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Notice' : 'Add New Notice'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <CFormInput
                                type='text'
                                name='heading'
                                value={newNotice.heading}
                                onChange={handleInputChange}
                                placeholder='Notice Heading'
                                required
                            />
                            <CFormTextarea
                                name='content'
                                value={newNotice.content}
                                onChange={handleInputChange}
                                placeholder='Notice Content'
                                required
                                rows="3"
                            />
                            <CFormInput
                                type='text'
                                name='image_url'
                                value={newNotice.image_url}
                                onChange={handleInputChange}
                                placeholder='Image URL (optional)'
                            />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <CButton type='submit' color={editing ? 'primary' : 'success'} style={{ width: '15%' }}>
                                {editing ? 'Update' : 'Add'} Notice
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable striped responsive className="mt-4">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Heading</CTableHeaderCell>
                        <CTableHeaderCell>Content</CTableHeaderCell>
                        <CTableHeaderCell>Image</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {notices.map(notice => (
                        <CTableRow key={notice.notice_id}>
                            <CTableDataCell>{notice.heading}</CTableDataCell>
                            <CTableDataCell>{notice.content}</CTableDataCell>
                            <CTableDataCell>
                                {notice.image_url && <CImage src={notice.image_url} alt="Notice" width="50" />}
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    onClick={() => handleEdit(notice)}
                                    color="info"
                                    className="me-2"
                                >
                                    Edit
                                </CButton>
                                <CButton
                                    onClick={() => handleDelete(notice.notice_id)}
                                    color="danger"
                                >
                                    Delete
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </CContainer>
    );
};

export default Notice;
