import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
} from '@coreui/react'

const FacultyCourses = () => {
  const [facultyId, setFacultyId] = useState('')
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
//   const [instructors, setInstructors] = useState([])
  const baseURL = 'http://localhost:5000'

  const getFacultyId = () => {
    console.log(localStorage.getItem('instructorId'))
    return localStorage.getItem('instructorId')
  }

  useEffect(() => {
    // Retrieve faculty ID from local storage on component mount
    const storedFacultyId = getFacultyId()
    if (storedFacultyId) {
      setFacultyId(storedFacultyId)
      console.log(facultyId);
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, deptRes, instRes] = await Promise.all([
          axios.get(`${baseURL}/api/courses`),
          axios.get(`${baseURL}/api/departments`),
        //   axios.get(`${baseURL}/api/instructors`),
        ])
        setCourses(courseRes.data)
        setDepartments(deptRes.data)
        // setInstructors(instRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    fetchData()
  }, [facultyId])

  // Filter courses based on facultyId
  const filteredCourses = courses.filter((course) => course.instructor_id === facultyId)
  console.log(courses)
  return (
    <div className="admin-container">
      <h1>Courses</h1>
      <CTable hover responsive className="mt-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Course Name</CTableHeaderCell>
            <CTableHeaderCell>Department</CTableHeaderCell>
            <CTableHeaderCell>Course Code</CTableHeaderCell>
            <CTableHeaderCell>Credits</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCourses.map((course) => {
            const departmentName = departments.find((d) => d.department_id === course.department_id)?.department_name

            return (
              <CTableRow key={course.course_id}>
                <CTableDataCell>{course.course_name}</CTableDataCell>
                <CTableDataCell>{course.department_name || 'N/A'}</CTableDataCell>
                <CTableDataCell>{course.course_code}</CTableDataCell>
                <CTableDataCell>{course.credits}</CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default FacultyCourses
