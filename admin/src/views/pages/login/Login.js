import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // import useNavigate
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
  const [username, setUsername] = useState('') // Using studentId for login
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // To handle errors
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Hardcoded username and password check
    if (username === 'Admin' && password === 'admin') {
      localStorage.setItem('studentId', 'admin') // Simulating a successful login by setting studentId
      navigate(`/`) // Redirect to the dashboard or homepage after login
    } else {
      setError('Invalid username or password')
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
                    
                    {/* Username Field */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Username" 
                        autoComplete="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Bind state to the input
                      />
                    </CInputGroup>
                    
                    {/* Password Field */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Bind state to the input
                      />
                    </CInputGroup>

                    {/* Display error message */}
                    {error && <div className="text-danger mb-3">{error}</div>}

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
