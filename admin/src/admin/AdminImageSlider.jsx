import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell, CFormLabel } from '@coreui/react';

const AdminImageSlider = () => {
    const [images, setImages] = useState([]);
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const fetchImages = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/imageslider`);
            setImages(response.data);
        } catch (err) {
            console.error("Error fetching images:", err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const resetForm = () => {
        setContent('');
        setImageFile(null);
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        if (imageFile) formData.append('image', imageFile);

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/imageslider/admin/${editingId}`, formData, { withCredentials: true });
                console.log("Image updated");
            } else {
                await axios.post(`${baseURL}/api/imageslider/admin/add`, formData, { withCredentials: true });
                console.log("New image added");
            }

            fetchImages();
            resetForm();
        } catch (err) {
            console.error("Error adding/updating image:", err);
        }
    };

    const handleEdit = (image) => {
        setContent(image.content);
        setEditing(true);
        setEditingId(image.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/imageslider/admin/${id}`, { withCredentials: true });
            fetchImages();
        } catch (err) {
            console.error("Error deleting image:", err);
        }
    };

    return (
        <div className="admin-container">
            <h1>Image Slider Management</h1>
            <CCard>
                <CCardHeader>{editing ? 'Edit Image' : 'Add New Image'}</CCardHeader>
                <CCardBody>
                    <CForm onSubmit={onSubmitImage}>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <CFormLabel htmlFor="content">Image Content</CFormLabel>
                            <CFormInput
                                type="text"
                                id="content"
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter content for the image"
                                required
                            />
                            <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                            <CFormInput
                                type="file"
                                id="image"
                                name="image"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                accept="image/*"
                            />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <CButton type="submit" color="primary">
                                {editing ? 'Update' : 'Add'} Image
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

            <CTable hover responsive className="mt-4">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Content</CTableHeaderCell>
                        <CTableHeaderCell>Image</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {images.map((image) => (
                        <CTableRow key={image.id}>
                            <CTableDataCell>{image.id}</CTableDataCell>
                            <CTableDataCell>{image.content}</CTableDataCell>
                            <CTableDataCell>
                                <img
                                    src={`${baseURL}/${image.image_path}`}
                                    alt={image.content}
                                    style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEdit(image)} className="edit-btn">
                                    Edit
                                </CButton>
                                <CButton color="danger" onClick={() => handleDelete(image.id)} className="delete-btn">
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

export default AdminImageSlider;
