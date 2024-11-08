import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
} from '@coreui/react'
import './imagegallery.css'

const ImageGallery = () => {
  const [imageName, setImageName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [gallery, setGallery] = useState([])
  const baseURL = 'http://localhost:5000'

  // Fetch images from the database on component load
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/imagegallery`)
        setGallery(response.data)
      } catch (err) {
        console.error('Error fetching images:', err)
      }
    }

    fetchImages()
  }, [])

  // Handle form submission for image upload
  const onSubmitImage = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('image_name', imageName)

    try {
      await axios.post(`${baseURL}/api/imagegallery/admin/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // Re-fetch gallery after adding new image
      const response = await axios.get(`${baseURL}/api/imagegallery`)
      setGallery(response.data)
      setImageName('')
      setImageFile(null)
    } catch (err) {
      console.error('Error uploading image:', err)
    }
  }

  // Handle image deletion
  const deleteImage = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/imagegallery/admin/delete/${id}`)
      // Re-fetch gallery after deleting image
      const response = await axios.get(`${baseURL}/api/imagegallery`)
      setGallery(response.data)
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  }

  // Handle image editing (for now, just updating the name)
  const editImage = async (id) => {
    const newName = prompt('Enter new image name:')
    if (newName) {
      try {
        await axios.put(`${baseURL}/api/imagegallery/admin/edit/${id}`, { image_name: newName })
        // Re-fetch gallery after updating image name
        const response = await axios.get(`${baseURL}/api/imagegallery`)
        setGallery(response.data)
      } catch (err) {
        console.error('Error editing image:', err)
      }
    }
  }

  return (
    <CCard className="gallery-container">
      <CCardHeader>
        <h1>Image Gallery</h1>
      </CCardHeader>
      <CCardBody>
        {/* Image upload form */}
        <CForm onSubmit={onSubmitImage} className="upload-form mb-4">
          <CFormInput
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="Image Name"
            className="mb-2"
          />
          <CFormInput
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            className="mb-2"
          />
          <CButton type="submit" color="primary">
            Upload Image
          </CButton>
        </CForm>

        {/* Table to display images */}
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Image</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {gallery.map((image) => (
              <CTableRow key={image.image_id}>
                <CTableDataCell>
                  <img
                    src={`http://localhost:5000${image.image_url}`}
                    alt={image.image_name}
                    style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                  />
                </CTableDataCell>
                <CTableDataCell>{image.image_name}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton color="danger" onClick={() => deleteImage(image.image_id)}>
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default ImageGallery
