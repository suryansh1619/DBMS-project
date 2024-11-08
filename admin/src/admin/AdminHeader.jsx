import React from 'react';
import '../header.css';
import { Link } from 'react-router-dom';

export default function AdminHeader() {
    return (
        <div className='header'>
            <nav className='nav'>
                <ul className='nav-list'>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/departments' 
                            className='nav-link'>
                            Departments
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/courses' 
                            className='nav-link'>
                            Courses
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/students' 
                            className='nav-link'>
                            Students
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/enrollments' 
                            className='nav-link'>
                            Enrollments
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/instructors' 
                            className='nav-link'>
                            Instructors
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/hods' 
                            className='nav-link'>
                            HOD
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/exams' 
                            className='nav-link'>
                            Exams
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/admin/marks' 
                            className='nav-link'>
                            Marks
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/departments' 
                            className='nav-link'>
                            Logout
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
