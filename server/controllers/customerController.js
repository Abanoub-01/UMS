const Student = require('../models/Student');
const Course = require('../models/Course');

const mongoose = require('mongoose');

//dashboard
exports.homepage = async (req, res) => {
    const messages = req.flash('info'); // Retrieve flash messages using req.flash()
    const local = {
      title: "my page",
    };
  
    let perPage  = 12;
    let page = req.query.page || 1;
  
    try {
      const students = await Student.aggregate([{$sort:{updatedAt:-1}}])
        .skip(perPage * page-perPage)
        .limit(perPage)
        .exec();
      const count = await Student.count() ;
      res.render('index', { local,students,current:page,pages:Math.ceil(count/perPage),messages});
    } catch (error) {
      console.log(error);
    }
  
  };


//about  page 
exports.about = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "about page",
  };
  try {
    res.render('about', { local});
  } catch (error) {
    console.log(error);
  }

};

//add new user

exports.addCustomer = async (req, res) => {
  const local = {
    title: "student-page",
  };
  res.render('students/add', local);
};


exports.postStudent = async (req, res) => {
  console.log(req.body);

  const newStudent = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    detail: req.body.detail,
  });

  try {
    await newStudent.save();
    req.flash('info', 'New student added'); // Set flash message using req.flash()
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};


exports.view = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'view Student Data',
      };
      res.render('students/view', { local, student });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};


exports.edit= async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'Edit Student Data',
      };
      res.render('students/edit', { local, student });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};



exports.editPost= async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id,{
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      tel:req.body.tel,
      details:req.body.details,
      email:req.body.email,
      updatedAt:Date.now(),

    });
    res.redirect(`/edit/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }
};


exports.deleteStudent= async (req, res) => {
  try {
    await Student.deleteOne({_id: req.params.id});
    res.redirect('/');

  } catch (error) {
    console.log(error);
  }
};


exports.searchStudents = async (req, res) => {
  const local = {
    title: "my page",
  };
  try {
    let searchTerm = req.body.searchTerm || req.session.searchTerm || '';
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const regex = new RegExp(searchNoSpecialChar, "i"); // "i" flag for case-insensitive search

    const students = await Student.find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ],
    });

    req.session.searchTerm = searchTerm; // Store the search term in the session

    if (students.length === 0) {
      // If no search results found, render a message in the view
      res.render("search", {
        students: [],
        local,
        message: "No results found.",
      });
    } else {
      // If search results are found, render the students in the view
      res.render("search", {
        students,
        local,
      });
    }
  } catch (error) {
    console.log(error); // Log the error for debugging purposes
    res.status(500).send("Internal Server Error"); // Send an appropriate error response
  }
};



//************************* FOR THE COURSES*********** */
// add course
exports.addCourse = async (req, res) => {
  const local = {
    title: "course-page",
  };
  res.render('students/addCourse', local);
};



//post course to data base
exports.postCourse = async (req, res) => {
  try {
    const newCourse = new Course({
      name: req.body.name,
      course_hours: parseInt(req.body.course_hours),
      year_works: parseInt(req.body.year_works),
      oral_p: parseInt(req.body.oral_p),
      written: parseInt(req.body.written),
      exam_hours: parseInt(req.body.exam_hours),
      department: req.body.department,
      subDepartment: req.body.subDepartment,
    });

    await newCourse.save(); // Save the new course to the database
    req.flash('info', 'New course added'); // Set flash message using req.flash()
    res.redirect('/'); // Redirect to the viewCourse page
  } catch (error) {
    console.log(error);
  }
};


// Display all courses
exports.allCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();

    // Render the allCourses view and pass the courses data
    res.render('students/viewCourse', { courses });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


// Render the edit course page


exports.editCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    if (!course) {
      console.log('Course not found'); // Add this line to check if course is null
      // Handle the case when course is null (e.g., render an error page)
    } else {
      const local = {
        title: 'Edit Course Data',
      };
      res.render('students/editCourse', { local, course });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};





exports.editCoursePost = async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      course_hours: req.body.course_hours,
      year_works: req.body.year_works,
      oral_p: req.body.oral_p,
      written: req.body.written,
      exam_hours: req.body.exam_hours,
      department: req.body.department,
      subDepartment: req.body.subDepartment,
      updatedAt: Date.now(),
    });
    req.flash('info', 'course updated'); // Set flash message using req.flash()
    res.redirect('/'); // Redirect to the dashboard route
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.params.id });
    
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};
