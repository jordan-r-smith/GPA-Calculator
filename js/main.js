$(function() {

  var gpaView = {
    init: function() {
      console.log('View Retrieved GPA: ' + localStorage.gpa);

      this.questionText = $('.question');
      this.inputDump = $('#input-dump');
      this.gpaNextButton = $('#nextButton');

      this.render();
    },
    render: function() {
      this.questionText.text('Enter your current GPA:');
      this.inputDump.html('<input type="text" class="form-control answer">');
      this.answerInput = $('input.answer').val(gpa.getGPA());
      this.gpaNextButton.click(function() {
        gpaController.submit();
      });
    }
  }

  var creditHoursView = {
    init: function() {
      console.log('View Retrieved Credit Hours: ' + localStorage.creditHours);

      this.questionText = $('.question');
      this.inputDump = $('#input-dump');
      this.creditHoursNextButton = $('#nextButton');
      this.creditHoursNextButton.off('click');

      this.render();
    },
    render: function() {
      this.questionText.text('Enter your total credit hours before the current semester:');
      this.inputDump.html('<input type="text" class="form-control answer">');
      this.answerInput = $('input.answer').val(creditHour.getCreditHours());
      this.creditHoursNextButton.click(function() {
        creditHoursController.submit();
      });
    }
  }

  var coursesView = {
    init: function() {
      console.log('View Retrieved Courses:');
      console.log(JSON.parse(localStorage.courses));

      this.questionText = $('.question');
      $('#input-dump').html('');
      this.inputDump = document.getElementById('input-dump');

      for (var i = 0; i < course.getCourses().length; i++) {
        var singleCourse = course.getCourses()[i];
        console.log(singleCourse);
        this.addCourse(singleCourse);
        console.log('Course Added');
      }

      this.addCourseButton = $('#addCourse');
      this.coursesNextButton = $('#nextButton');
      this.coursesNextButton.off('click');

      this.render();
    },
    render: function() {
      this.addCourseButton.removeClass('hidden');

      this.questionText.text('Enter the credit hours for each course you are taking this semester, along with the expected grade:');

      var _this = this;
      this.addCourseButton.click(function() {
        _this.addCourse();
      });

      this.coursesNextButton.click(function() {
        coursesController.submit();
      });
    },
    addCourse: function(singleCourse) {
      if (singleCourse) {
        var courseID = singleCourse.id;
        var courseCreditHours = singleCourse.creditHours;
        var courseGrade = singleCourse.grade;
      }

      console.log(courseID);

      var form = document.createElement('form');
      form.setAttribute('class', 'form-horizontal');
      if (singleCourse) {
        form.setAttribute('id', courseID);
      } else {
        form.setAttribute('id', coursesController.generateID());
      }

      var formGroup = document.createElement('div');
      formGroup.setAttribute('class', 'form-group');

      form.appendChild(formGroup);

      var creditHourCol = document.createElement('div');
      creditHourCol.setAttribute('class', 'col-md-5');

      formGroup.appendChild(creditHourCol);

      var gradeCol = document.createElement('div');
      gradeCol.setAttribute('class', 'col-md-5');

      formGroup.appendChild(gradeCol);

      var creditHoursInput = document.createElement('input');
      creditHoursInput.setAttribute('class', 'form-control credit-hour');
      creditHoursInput.setAttribute('type', 'number');
      creditHoursInput.setAttribute('placeholder', 'Credit Hours');
      if (singleCourse) {
        creditHoursInput.value = courseCreditHours;
      }

      creditHourCol.appendChild(creditHoursInput);

      var gradeInput = document.createElement('input');
      gradeInput.setAttribute('class', 'form-control grade');
      gradeInput.setAttribute('type', 'number');
      gradeInput.setAttribute('placeholder', 'Grade');
      if (singleCourse) {
        gradeInput.value = courseGrade;
      }

      gradeCol.appendChild(gradeInput);

      var removeButtonCol = document.createElement('div');
      removeButtonCol.setAttribute('class', 'col-md-2');
      removeButtonCol.setAttribute('id', 'remove-button-dump');

      formGroup.appendChild(removeButtonCol);

      var removeButton = document.createElement('button');
      removeButton.setAttribute('class', 'btn btn-warning remove-course');
      removeButton.setAttribute('type', 'button');
      removeButton.textContent = 'Remove';

      removeButtonCol.appendChild(removeButton);

      this.inputDump.appendChild(form);

      var _this = this;
      removeButton.onclick = function() {
        _this.removeCourse(removeButton);
      }
    },
    removeCourse: function(removeButton) {
      var courseRow = removeButton.parentElement.parentElement.parentElement;
      courseRow.remove();
    }
  }

  var resultsView = {
    init: function() {
      this.questionText = $('.question');
      $('#input-dump').html('');
      this.inputDump = document.getElementById('input-dump');
      this.addCourseButton = $('#addCourse');
      this.coursesNextButton = $('#nextButton');

      this.render();
    },
    render: function() {
      this.addCourseButton.addClass('hidden');
      this.coursesNextButton.addClass('hidden');

      this.questionText.text('Calculated Expected GPA:');

      var gpaText = document.createElement('h2');
      gpaText.setAttribute('class', 'text-success')
      gpaText.textContent = resultsController.calculateGPA();

      this.inputDump.appendChild(gpaText);
    }
  }

  var gpaController = {
    init: function() {
      gpaView.init();
    },
    submit: function() {
      console.log('Retrieved GPA: ' + localStorage.gpa);
      gpa.currentGPA = gpaView.answerInput.val();
      gpa.save();
      console.log('Saved GPA: ' + localStorage.gpa);

      creditHoursController.init();
    }
  }

  var creditHoursController = {
    init: function() {
      creditHoursView.init();
    },
    submit: function() {
      console.log('Retrieved Credit Hours: ' + localStorage.creditHours);
      creditHour.currentCreditHours = creditHoursView.answerInput.val();
      creditHour.save();
      console.log('Saved Credit Hours: ' + localStorage.creditHours);

      coursesController.init();
    }
  }

  var coursesController = {
    init: function() {
      coursesView.init();
    },
    submit: function() {
      console.log('Retrieved Courses:');
      console.log(JSON.parse(localStorage.courses));

      var coursesArray = [];
      var courseRows = document.getElementsByClassName('form-horizontal');
      for (var i = 0; i < courseRows.length; i++) {
        var currentCourseID = courseRows[i].id
        var currentCreditHour = courseRows[i].elements[0].value;
        var currentGrade = courseRows[i].elements[1].value;

        console.log('ID: ' + currentCourseID + ' / Credit Hour: ' + currentCreditHour + ' / Grade: ' + currentGrade);

        var courseEntry = {
          id: currentCourseID,
          creditHours: currentCreditHour,
          grade: currentGrade
        };

        coursesArray.push(courseEntry);
      }

      course.currentCourses = JSON.stringify(coursesArray);
      console.log(course.currentCourses);
      course.save();
      console.log('Saved Courses:');
      console.log(JSON.parse(localStorage.courses));

      resultsController.init();
    },
    generateID: function() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  }

  var resultsController = {
    init: function() {
      resultsView.init();
    },
    calculateGPA: function() {
      var previousGPA = gpa.getGPA();
      var previousCreditHours = creditHour.getCreditHours();
      var totalPoints = previousGPA * previousCreditHours;
      var totalHours = parseInt(previousCreditHours);

      var allCourses = course.getCourses();
      for (var i = 0; i < allCourses.length; i++) {
        totalPoints += allCourses[i].grade * allCourses[i].creditHours;
        totalHours += parseInt(allCourses[i].creditHours);
      }
      // fix divide by 0
      if (totalHours === 0) {
        totalHours = 1;
      }
      var result = totalPoints / totalHours;
      return result.toFixed(2);
    }
  }

  var gpa = {
    currentGPA: localStorage.gpa,
    getGPA: function() {
      return localStorage.gpa;
    },
    save: function() {
      var gpa = this.getGPA();
      gpa = this.currentGPA;
      localStorage.gpa = gpa;
    }
  }

  var creditHour = {
    currentCreditHours: localStorage.creditHours,
    getCreditHours: function() {
      return localStorage.creditHours;
    },
    save: function() {
      var creditHours = this.getCreditHours();
      creditHours = this.currentCreditHours;
      localStorage.creditHours = creditHours;
    }
  }

  var course = {
    init: function() {
      if (!localStorage.courses) {
        localStorage.courses = JSON.stringify([{
          id: coursesController.generateID(),
          creditHours: 0,
          grade: 0
        }, {
          id: coursesController.generateID(),
          creditHours: 0,
          grade: 0
        }]);
      }
    },
    getCourses: function() {
      return JSON.parse(localStorage.courses);
    },
    save: function() {
      var courses = this.getCourses();
      localStorage.courses = this.currentCourses;
    }
  }

  course.init();
  gpaController.init();
});
