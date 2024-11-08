const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = 5000;
const URL = ['http://localhost:5173','http://localhost:3000','http://localhost:3001','http://localhost:3002'];
app.use(cors({
    origin: URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json()); 

const departmentsRoutes = require('./routes/department');
const instructorsRoutes = require('./routes/instructor');
const coursesRoutes = require('./routes/course');
const studentsRoutes = require('./routes/student');
const enrollmentsRoutes = require('./routes/enrollment');
const hodsRoutes = require('./routes/hod');
const marksRoutes = require('./routes/marks');
const examsRoutes = require('./routes/exams');
const performanceRoutes = require('./routes/performance');
const loginRoutes = require('./routes/login');
const noticeRouter = require('./routes/notice');  // Adjust path as needed
const imageslideRouter = require('./routes/imageslide');  // Adjust path as needed
const imageGalleryRoutes = require('./routes/imagegallery');
app.use('/api/imagegallery', imageGalleryRoutes);
app.use('/api/imageslider', imageslideRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/departments/', departmentsRoutes);
app.use('/api/instructors/', instructorsRoutes);
app.use('/api/courses/', coursesRoutes);
app.use('/api/students/', studentsRoutes);
app.use('/api/enrollments/', enrollmentsRoutes);
app.use('/api/hods/', hodsRoutes);
app.use('/api/marks/', marksRoutes);
app.use('/api/exams/', examsRoutes);
app.use('/api/performance/', performanceRoutes);
app.use('/api', loginRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});