// routes/index.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/',customerController.homepage);
router.get('/about',customerController.about);
router.get('/add',customerController.addCustomer);
router.post('/add',customerController.postStudent);
router.get('/view/:id', customerController.view);
router.get('/edit/:id', customerController.edit);
router.put('/edit/:id', customerController.editPost);
router.delete('/edit/:id', customerController.deleteStudent);

router.all('/search', customerController.searchStudents);

//courses
router.get('/addCourse',customerController.addCourse);
router.post('/addCourse', customerController.postCourse); 
router.get('/viewCourse', customerController.allCourses);


//to update courses
// Route for displaying the edit form for a course
router.get('/editCourse/:id', customerController.editCourse);

// Route for updating a course
router.post('/editCourse/:id', customerController.editCoursePost);

// Route for deleting a course
router.delete('/editCourse/:id', customerController.deleteCourse);
module.exports = router;