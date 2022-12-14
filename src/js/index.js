import './general';
import toastr from 'toastr';
import 'toastr/toastr.scss';
window.bootstrap = require('bootstrap');

class Home {
  constructor() {
    //grab page elements
    this.$resetButton = document.getElementById('reset');
    this.$courseForm = document.getElementById('courseForm');
    this.$searchButtonContainer = document.getElementById('searchButtonContainer');
    this.$searchButton = document.getElementById('searchButton')
    this.$addCourseModal = document.getElementById('addCourseModal');
    this.$searchDescriptionModal = document.getElementById('searchCourseModal');
    this.$addPrereqsModal = document.getElementById('prereqModal');
    this.$courseAddButton = document.getElementById('coursesAddButton');

    //adjust the framing of the div that will have our diagram to be the size of the page
    let navbarHeight = document.querySelector('nav').offsetHeight;
    let $canvasDiv = document.getElementById('myDiagramDiv');
    $canvasDiv.style.height = `100vh - ${navbarHeight}px`;
    $canvasDiv.style.top = `${navbarHeight}px`;

    this.myDiagram;

    this.init();

    //document.querySelector('canvas').style.paddingTop = `${navbarHeight / 4}px`;
  }

  init() {
    //set toaster alert settings
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "2500",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    //add click handlers to buttons that are hard coded into the html
    this.$resetButton.onclick = this.resetDiagram;

    this.$courseForm.addEventListener('submit', (event) => {
      this.submitSearch(event);
    })

    this.$courseAddButton.addEventListener('click', () => {
      this.handleModalSubmit();
    });
    
    let courseInputBox = document.getElementById('inputCRN');

    courseInputBox.addEventListener("keydown", function (event) {
      if (event.key == "Enter") {
        event.preventDefault();
        document.getElementById('coursesAddButton').click();
      }
    });

    //creates the flowchart and it's canvas
    this.myDiagram = this.createDiagram();
  }

  /*the function that creates the flowchart and sets all the settings
  also sets the default flowchart*/
  createDiagram = () => {

    let $ = go.GraphObject.make;
    let myDiagram = $(go.Diagram, "myDiagramDiv",
      {
        "draggingTool.isEnabled": false,
        "allowSelect": false,
        padding: 90,
      });

    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: "#7289da", strokeCap: "round", stroke: "", strokeWidth: "3", }),
        $(go.TextBlock, { margin: 8, font: "bold 24px Verdana, sans-serif" },
          new go.Binding("text", "key")),
        {
          selectionAdornmentTemplate:
            $(go.Adornment, "Auto",
              $(go.Shape, "RoundedRectangle",
                { fill: null, stroke: null, strokeWidth: 0 }),
              $(go.Placeholder)
            )  // end Adornment
        }
      );

    myDiagram.linkTemplate =
      $(go.Link,
        $(go.Shape, { strokeWidth: 3, stroke: "#000000" }),
        $(go.Shape, { toArrow: "Standard" }),
        {
          selectionAdornmentTemplate:
            $(go.Adornment,
              $(go.Shape,
                { isPanelMain: true, stroke: "#000000", strokeWidth: 5 }),
              $(go.Shape,
                { toArrow: "Standard", fill: "#FF000080", stroke: null, scale: 3 })
            )  // end Adornment
        }
      );

    myDiagram.layout =
      $(go.LayeredDigraphLayout,
        {
          direction: 90,

        }
      );

    myDiagram.model =
      $(go.GraphLinksModel,
        {
          nodeDataArray: [
            {key: 'Example Diagram. Hit "Reset" to clear!\nUse "ctl + +" or "ctrl + -" to zoom or the mouse to pan'},

            {key: 'MTH 111'},
            {key: 'MTH 112'},
            {key: 'MTH 251'},
            {key: 'MTH 252'},
            {key: 'MTH 253'},
            {key: 'MTH 254'},
            {key: 'MTH 255'},
            {key: 'MTH 261'},

            {key: 'ECE 101'},
            {key: 'ECE 102'},
            {key: 'ECE 103'},
            {key: 'ECE 211'},
            {key: 'ECE 212'},
            {key: 'ECE 171'},
            {key: 'ECE 172'},
          ],

          linkDataArray: [
            {to: 'MTH 111', from: 'Example Diagram. Hit "Reset" to clear!\nUse "ctl + +" or "ctrl + -" to zoom or the mouse to pan'},
            {to: 'MTH 112', from: 'MTH 111'},
            {to: 'MTH 251', from: 'MTH 112'},
            {to: 'MTH 252', from: 'MTH 251'},
            {to: 'MTH 253', from: 'MTH 252'},
            {to: 'MTH 254', from: 'MTH 253'},
            {to: 'MTH 255', from: 'MTH 254'},
            {to: 'MTH 261', from: 'MTH 252'},

            {to: 'ECE 101', from: 'MTH 111'},
            {to: 'ECE 102', from: 'ECE 101'},
            {to: 'ECE 103', from: 'ECE 102'},
            {to: 'ECE 211', from: 'ECE 103'},
            {to: 'ECE 211', from: 'MTH 252'},
            {to: 'ECE 212', from: 'ECE 211'},

            {to: 'ECE 171', from: 'MTH 111'},
            {to: 'ECE 172', from: 'ECE 171'},
            {to: 'ECE 211', from: 'ECE 172'},
          ]
        }
      );
    return myDiagram;
  }

  /*handles submission of the data from the modal that pops up when you click the "Add Courses" button
  validates the corse numbers and runs fetch requests for each.
  then creates the modal that handles adding prereqs to courses*/
  handleModalSubmit = async () => {
    let userInput = document.getElementById('inputCRN');
    let CRNList = this.genCRNList(userInput.value.toUpperCase());
    userInput.value = "";

    

    let requestedCourseList = [];

    if (CRNList.length > 0) {
      let requestElements = this.getRequestElements(CRNList);

      for (const course in requestElements) {
        let requestURL = `https://raw.githubusercontent.com/DrunkBelligerentWizard/PSU-Courses/main/${requestElements[course][0]}.json`
        //toastr.info('Retrieving Course Info');
        await fetch(requestURL)
          .then(response => {
            if (!response.ok) {
              toastr.error(`${requestElements[course][0]} ${requestElements[course][1]} is an invalid course code`)
              throw new Error('invalid request URL')
            }
            else {
              response = response.json()
                .then(courseList => {
                  let courseFound = false;
                  for (const key in courseList) {
                    if (courseList[key]["dist"].length > 0 && courseList[key]["dist"][0]["courseDigit"] == requestElements[course][1]) {
                      courseFound = true;
                      requestedCourseList.push(courseList[key]["dist"][0]);
                      break;
                    }
                  }
                  if (!courseFound) {
                    toastr.error(`Could not find ${requestElements[course][0]} ${requestElements[course][1]}. Try search again without ${requestElements[course][0]} ${requestElements[course][1]}`);
                  }
                  else if (requestedCourseList.length == requestElements.length) {
                    let addCoursesModal = new bootstrap.Modal(this.$addCourseModal);
                    
              
                    this.addPrereqModal(requestedCourseList, addCoursesModal, false)
                  }
                })
            }
          },
            () => { throw new Error('Invalid Course Subject Identifier') })
          .catch((error) => {
            //console.error('Error:', error);
            toastr.error('Could not find requested course');
          });
      }
    }
    else {
      toastr.error(`No valid courses inputed`);
    }
  }

  /*The method used to add an individual course node and it's prequisite links
  to the flowchart*/
  addCourse = (courseCode, prereq) => {
    this.myDiagram.model.addNodeData({ key: `${courseCode}` });

    for (const course in prereq) {
      let charCount = 0;
      const pattern = /[A-Z]/i;
      for (const char in prereq[course]) {
        if (pattern.test(prereq[course][char])) charCount++;
      }
      let prereqDisplay = "";
      if (prereq[course].slice(charCount).length <= 2) {
        prereqDisplay = prereq[course].slice(0, charCount) + " 0" + prereq[course].slice(charCount);
      }
      else {
        prereqDisplay = prereq[course].slice(0, charCount) + " " + prereq[course].slice(charCount);
      }
      this.myDiagram.model.addLinkData({ from: `${prereqDisplay}`, to: `${courseCode}` });
    }

    console.log(this.myDiagram.model.linkDataArray);
    console.log(this.myDiagram.model.nodeDataArray);
    //diagram.requestUpdate();
  }

  /*Handles searching for an individual class via the search bar
  gives more detailed information such as when the course is offered
  does almost the exact same process as handle modal submit except it brings up a course descriptional modal
  instead of the prerequisite modal*/
  submitSearch = (event) => {
    event.preventDefault();
    let searchBar = document.getElementById('CRNSearch');
    let userInput = searchBar.value.toUpperCase();
    searchBar.value = "";
    let CRNList = this.genCRNList(userInput);


    if (CRNList.length == 1) {
      let requestElements = this.getRequestElements(CRNList);

      let requestURL = `https://raw.githubusercontent.com/DrunkBelligerentWizard/PSU-Courses/main/${requestElements[0][0]}.json`

      let requestedCourse = {};

      let defaultSearchButtonHTML = this.$searchButtonContainer.innerHTML;
      this.$searchButtonContainer.innerHTML = `
            <button id="searchButtonLoading" class="btn btn-lg btn-secondary text-nowrap me-2" type="submit" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="">Loading...</span>
            </button>
            `;
      //toastr.info('Retrieving Course Info');
      fetch(requestURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('invalid request URL')
          }
          else {
            response = response.json()
              .then(courseList => {
                let courseFound = false;
                for (const key in courseList) {
                  if (courseList[key]["dist"].length > 0 && courseList[key]["dist"][0]["courseDigit"] == requestElements[0][1]) {
                    courseFound = true;
                    requestedCourse = courseList[key]["dist"][0];
                    break;
                  }
                }
                if (courseFound) {
                  //toastr.success('Course Found!');
                  this.createDescriptionModal(requestedCourse);
                }
                else {
                  toastr.error('Could not find requested course');
                }
              })
          }
        },
          () => { throw new Error('Invalid Course Subject Identifier') })
        .catch((error) => {
          //console.error('Error:', error);
          toastr.error('Could not find requested course');
        });
      this.$searchButtonContainer.innerHTML = defaultSearchButtonHTML;
    }
    else {
      if (CRNList.length > 1) {
        toastr.error(`You may only search for one class at a time!`)
      }
      else { toastr.error('Invalid Course Number') };
    }
  }


  /*formats user input by removing space and splitting at commas to make an array of CRNs*/
  genCRNList = (userInput) => {
    userInput = userInput.replace(/\s+/g, '')
    let CRNList = userInput.split(',');
    let validCRNList = [];

    //validates that each CRN is properly formatted and adds it to a list of valid CRNS if it is
    CRNList.forEach(CRN => {
      if (this.validateCRN(CRN)) {
        validCRNList.push(CRN);
      }
    });

    return validCRNList
  }

  /*checks to see if the provided input is a valid CRN format*/
  validateCRN = (userInput) => {
    const pattern = /^[a-z]{2,4}\s?\d{1,3}$/i;
    let test = pattern.test(userInput);
    return test;
  }

  /*splits an array of CRNs into an array of pairs including the Course department identifier and the specific number*/
  getRequestElements = (CRNList) => {
    let requestArr = [];
    CRNList.forEach(CRN => {
      let department = "";
      let num = "";
      for (let i = 0; i < CRN.length; i++) {
        if (this.isLetter(CRN[i])) {
          department += CRN[i];
        }
        else if (this.isDigit(CRN[i])) {
          num += CRN[i];
        }
      }
      requestArr.push([department, num])
    });
    return requestArr;
  }


  //checks if the provided character is a letter
  isLetter = (char) => {
    const pattern = /[A-Z]/i;
    return pattern.test(char);
  }

  //checks if the provided character is a digit
  isDigit = (char) => {
    const pattern = /\d/;
    return pattern.test(char);
  }

  /*Clears the flowchart's nodes and links, effectively reseting it to a blank slate*/
  resetDiagram = () => {
    this.myDiagram.model.nodeDataArray = [];
    this.myDiagram.model.linkDataArray = [];
  }

  /* dynamically creates the modal that shows the user additional course information for courses searched via
  the search bar. Also allows the user to add that course by creating the same preq modal used in handleModalSubmit*/
  createDescriptionModal = (requestedCourse) => {
    this.$searchDescriptionModal.innerHTML = `
         <div class="modal-dialog">
           <div class="modal-content bg-secondary">
             <div class="modal-header">
               <h3 class="modal-title text-light" id="searchCourseModalTitle">${requestedCourse.displayTitle}</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body fw-bold">
               <ul class="list-group">
                 <li class="list-group-item">
                     <div id="descriptionCRN">CRN: ${requestedCourse.courseCode}</div>
                 </li>
                 <li class="list-group-item">
                 <div id="descriptionCredits">Credits: ${requestedCourse.credits}</div>
             </li>
                 <li class="list-group-item" id="courseProjection">
                   <span>3-Year Course Projection:</span>
                   <div class="pt-sm-2">
                     <table class="table table-secondary table-striped table-bordered border-secondary">
                       <thead>
                         <tr class="text-center">
                           <th scope="col">Year</th>
                           <th class="w-25" scope="col">FA</th>
                           <th class="w-25" scope="col">WI</th>
                           <th class="w-25" scope="col">SP</th>
                           <th class="w-25" scope="col">SU</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <th scope="row">2022-2023</th>
                           <td id="FA22" align="center" class="">FA22</td>
                           <td id="WI23" align="center" class="">WI23</td>
                           <td id="SP23" align="center" class="">SP23</td>
                           <td id="SU23" align="center" class="">SU23</td>
                         </tr>
                         <tr>
                           <th scope="row">2023-2024</th>
                           <td id="FA23" align="center" class="">test</td>
                           <td id="WI24" align="center" class=""></td>
                           <td id="SP24" align="center" class="">@fat</td>
                           <td id="SU24" align="center" class="">@mdo</td>
                         </tr>
                         <tr>
                           <th scope="row">2024-2025</th>
                           <td id="FA24" align="center" class="">test</td>
                           <td id="WI25" align="center" class="">Larry</td>
                           <td id="SP25" align="center" class="">@twitter</td>
                           <td id="SU25" align="center" class="">@mdo</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 </li>
               </ul>
             </div>
             <div class="modal-footer">
               <div class="d-grid gap-2 col-10 mx-auto">
                 <div class="row justify-content-evenly">
                   <button id="addButton" type="button" class="btn btn-light col-sm-10 me-1">Add Course</button>
                 </div>
               </div>
             </div>
           </div>
         </div>
        `

    for (const year in requestedCourse["years"]) {
      for (const term in requestedCourse["years"][year]["terms"]) {
        const currentTerm = requestedCourse["years"][year]["terms"][term];

        let tableIcon = document.getElementById(`${currentTerm.term}${currentTerm.yearyy}`);

        if (currentTerm.active == true && currentTerm.cancelled != true) {
          tableIcon.classList.add('text-success');
          tableIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="60%" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
              <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>`
        }
        else {
          tableIcon.classList.add('text-secondary');
          tableIcon.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="60%" fill="currentColor" class="bi bi-calendar-x" viewBox="0 0 16 16">
                                 <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
                                 <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                               </svg>
              `
        }
      }
    }

    let searchModal = new bootstrap.Modal(this.$searchDescriptionModal);

    let addButton = document.getElementById('addButton')

    addButton.addEventListener('click', () => {
      this.addPrereqModal([requestedCourse], searchModal)
    });

    searchModal.toggle();
  }

  addPrereqModal = (courseList, parentModal, toggleParrent = true) => {
    this.$addPrereqsModal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content bg-secondary">
        <div class="modal-header">
          <h3 class="modal-title text-light" id="addCourseModalLabel">Add Prerequisites</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div id="courseField" class="form-group d-grid col-12">
              
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <div class="d-grid gap-2 col-10 mx-auto">
            <div class="row justify-content-evenly">
              <button id="prereqAddButton" type="button" class="btn btn-light col-sm-10 me-1">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    let courseField = document.getElementById('courseField');
    let prereqInsertList = [];

    for (const course in courseList) {
      let prereqInsert = this.elementFromHTML(`
      <div class="row justify-content-evenly my-1">
          <label class="col-sm-3 text-light" for="${courseList[course].subjectCode}${courseList[course].courseDigit}">${courseList[course].courseCode}:</label>
            <input id="${courseList[course].subjectCode}${courseList[course].courseDigit}" class="form-conntrol col-sm-8 rounded border-0 ml-n5" placeholder="Ex: MTH 252, MTH 253, ECE 101" type="text">
      </div>
      `)
      courseField.append(prereqInsert);
      let prereqInputBox = document.getElementById(`${courseList[course].subjectCode}${courseList[course].courseDigit}`)

      prereqInputBox.addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
          event.preventDefault();
          prereqAddButton.click();
        }
      });

      prereqInsertList.push(prereqInputBox);
    }

    let prereqModal = new bootstrap.Modal(this.$addPrereqsModal);

    let prereqAddButton = document.getElementById('prereqAddButton')

    prereqAddButton.addEventListener('click', () => {
      let validPrereqs = true;
      for (const inputField in prereqInsertList) {
        let prereqList = prereqInsertList[inputField].value;
        courseList[inputField]["prereqs"] = [];

        if (prereqList) {
          prereqList = prereqList.replace(/\s+/g, '');
          prereqList = prereqList.split(',');

          for (const prereq in prereqList) {
            if (!this.validateCRN(prereqList[prereq])) {
              validPrereqs = false;
              toastr.error(`${prereqList[prereq]} is not a valid CRN`);
            }
            else {
              courseList[inputField]["prereqs"].push(`${prereqList[prereq].toUpperCase()}`);
            }
          }
        }
      }
      if (validPrereqs) {
        this.addCourses(courseList, prereqModal);
      }
    })
    if(toggleParrent) {
      parentModal.toggle();
    }
    prereqModal.toggle();
  }

  /*takes in a list of courses to be added to the flowchart and lets the user know when they've been added
  toggles the prequisite modal that called addCourses after adding all the courses*/
  addCourses = (courseList, prereqModal) => {
    for (const course in courseList) {
      this.addCourse(courseList[course].courseCode, courseList[course].prereqs);
      toastr.success(`${courseList[course].courseCode} added!`)
    }
    prereqModal.toggle();
  }

  /*returns an html element from the argument that should include the html as a string*/
  elementFromHTML(html) {
    const template = document.createElement('template');

    //sets the generated element's html and trims off white space
    template.innerHTML = html.trim()

    return template.content.firstElementChild;
  }
}

/*creates the home object when the page loads*/
let home;
window.onload = () => { new Home(); };