import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [studentId, setStudentId] = useState('')  // Using studentId for login
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const baseURL = "http://localhost:5000"  // Adjust the base URL to your backend

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Sending login data to the backend
      const response = await axios.post(`${baseURL}/api/students/login`, {
        studentId,
        password,
      }, { withCredentials: true })

      // console.log(response)

      // Assuming the backend responds with a success message and student data
      if (response.data.success) {
        localStorage.setItem('studentId', response.data.student.studentId)
        // Redirect to dashboard or specific page after login
        navigate(`/`)
      }
    } catch (err) {
      // Handle error (e.g., invalid credentials)
      console.log(err)
      setError('Invalid student ID or password')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Student ID Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Student ID"
                        autoComplete="student-id"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                      />
                    </CInputGroup>

                    {/* Password Input */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    {/* Display error message if login fails */}
                    {error && <p className="text-danger">{error}</p>}

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
