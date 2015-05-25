var gpaView = {
  init: function() {
    this.questionText = document.getElementById('question');
    this.inputDump = document.getElementById('input-dump');
    this.inputDump.innerHTML = '';

    this.gpaNextButton = document.getElementById('nextButton');

    this.render();
  },
  render: function() {
    this.questionText.textContent = 'Enter your current GPA:';

    var answer = document.createElement('input');
    answer.setAttribute('type', 'number');
    answer.setAttribute('class', 'form-control');
    answer.setAttribute('id', 'answer');
    this.inputDump.appendChild(answer);

    this.answerInput = document.getElementById('answer');
    this.answerInput.value = gpa.getGPA();

    this.gpaNextButton.addEventListener('click', gpaController.submit);
  }
}

var creditHoursView = {
  init: function() {
    this.questionText = document.getElementById('question');
    this.inputDump = document.getElementById('input-dump');
    this.inputDump.innerHTML = '';

    this.creditHoursNextButton = document.getElementById('nextButton');
    this.creditHoursNextButton.removeEventListener('click', gpaController.submit);

    this.render();
  },
  render: function() {
    this.questionText.textContent = 'Enter your total credit hours before the current semester:';

    var answer = document.createElement('input');
    answer.setAttribute('type', 'number');
    answer.setAttribute('class', 'form-control');
    answer.setAttribute('id', 'answer');
    this.inputDump.appendChild(answer);

    this.answerInput = document.getElementById('answer');
    this.answerInput.value = creditHour.getCreditHours();

    this.creditHoursNextButton.addEventListener('click', creditHoursController.submit);
  }
}

var coursesView = {
  init: function() {
    this.questionText = document.getElementById('question');
    this.inputDump = document.getElementById('input-dump');
    this.inputDump.innerHTML = '';

    this.addCourseButton = document.getElementById('addCourse');
    this.coursesNextButton = document.getElementById('nextButton');
    this.coursesNextButton.removeEventListener('click', creditHoursController.submit);

    this.render();
  },
  render: function() {
    this.addCourseButton.classList.remove('hidden');

    this.questionText.textContent = 'Enter the credit hours for each course you are taking this semester, along with the expected grade:';

    var creditHoursLabelCol = document.createElement('div');
    creditHoursLabelCol.setAttribute('class', 'col-md-5');

    var creditHoursLabel = document.createElement('h3');
    creditHoursLabel.textContent = 'Credit Hours';
    creditHoursLabelCol.appendChild(creditHoursLabel);

    var gradeLabelCol = document.createElement('div');
    gradeLabelCol.setAttribute('class', 'col-md-5');

    var gradeLabel = document.createElement('h3');
    gradeLabel.textContent = 'Grade';
    gradeLabelCol.appendChild(gradeLabel);

    this.inputDump.appendChild(creditHoursLabelCol);
    this.inputDump.appendChild(gradeLabelCol);

    for (var i = 0; i < course.getCourses().length; i++) {
      var singleCourse = course.getCourses()[i];
      this.addCourse(singleCourse);
    }

    var _this = this;
    this.addCourseButton.addEventListener('click', function() {
      _this.addCourse();
    });

    this.coursesNextButton.addEventListener('click', coursesController.submit);
  },
  addCourse: function(singleCourse) {
    if (singleCourse) {
      var courseID = singleCourse.id;
      var courseCreditHours = singleCourse.creditHours;
      var courseGrade = singleCourse.grade;
    }

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
    creditHoursInput.setAttribute('placeholder', 'e.g. 30');
    if (singleCourse) {
      creditHoursInput.value = courseCreditHours;
    }

    creditHourCol.appendChild(creditHoursInput);

    var gradeInput = document.createElement('input');
    gradeInput.setAttribute('class', 'form-control grade');
    gradeInput.setAttribute('type', 'number');
    gradeInput.setAttribute('placeholder', 'e.g. 4.0');
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
    removeButton.addEventListener('click', function() {
      _this.removeCourse(removeButton);
    });
  },
  removeCourse: function(removeButton) {
    var courseRow = removeButton.parentElement.parentElement.parentElement;
    courseRow.remove();
  }
}

var resultsView = {
  init: function() {
    this.questionText = document.getElementById('question');
    this.inputDump = document.getElementById('input-dump');
    this.inputDump.innerHTML = '';

    this.addCourseButton = document.getElementById('addCourse');
    this.coursesNextButton = document.getElementById('nextButton');

    this.render();
  },
  render: function() {
    this.addCourseButton.classList.add('hidden');
    this.coursesNextButton.classList.add('hidden');

    this.questionText.textContent = 'Calculated Expected GPA:';

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
    gpa.currentGPA = gpaView.answerInput.value;
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
    creditHour.currentCreditHours = creditHoursView.answerInput.value;
    creditHour.save();
    console.log('Saved Credit Hours: ' + localStorage.creditHours);

    coursesController.init();
  }
}

var coursesController = {
  init: function() {
    course.init();
    coursesView.init();
  },
  submit: function() {
    var coursesArray = [];
    var courseRows = document.getElementsByClassName('form-horizontal');
    for (var i = 0; i < courseRows.length; i++) {
      var currentCourseID = courseRows[i].id
      var currentCreditHour = courseRows[i].elements[0].value;
      var currentGrade = courseRows[i].elements[1].value;

      var courseEntry = {
        id: currentCourseID,
        creditHours: currentCreditHour,
        grade: currentGrade
      };

      coursesArray.push(courseEntry);
    }

    course.currentCourses = JSON.stringify(coursesArray);
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
        creditHours: '',
        grade: ''
      }, {
        id: coursesController.generateID(),
        creditHours: '',
        grade: ''
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

gpaController.init();
