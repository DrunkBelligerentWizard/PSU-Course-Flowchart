import './general';
import toastr from 'toastr';
window.bootstrap = require('bootstrap');

class Home {
    constructor() {
        this.$courseForm = document.getElementById('courseForm');
        this.$searchButtonContainer = document.getElementById('searchButtonContainer');
        this.$searchButton = document.getElementById('searchButton')
        this.$SearchDescriptionModal = document.getElementById('searchCourseModal');

        //adjust the framing of the div that will have our diagram
        let navbarHeight = document.querySelector('nav').offsetHeight;
        let $canvasDiv = document.getElementById('myDiagramDiv');
        $canvasDiv.style.height = `100vh - ${navbarHeight}px`;
        $canvasDiv.style.top = `${navbarHeight}px`;

        this.$courseForm.addEventListener('submit', (event) => {
            this.submitSearch(event)
          })

       this.myDiagram = this.createDiagram();

        this.init();

        //document.querySelector('canvas').style.paddingTop = `${navbarHeight / 4}px`;
    }

    init() {
        this.addCourseNode();
        this.createDescriptionModal();
    }

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
                $(go.Shape, "RoundedRectangle", { fill: "#7289da", strokeCap: "round", stroke: "", strokeWidth: "3",}),
                $(go.TextBlock, { margin: 8, font: "bold 24px Verdana, sans-serif"},
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
          $(go.Shape, {strokeWidth: 3, stroke: "#000000"}),
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
                        { key: "MTH 111" },
                        { key: "MTH 112" },
                        { key: "MTH 231" },
                        { key: "MTH 251" },
                        { key: "MTH 252" },
                        { key: "MTH 253" },
                        { key: "MTH 260" },
    
                        { key: "ECE 101" },
                        { key: "ECE 102" },
                        { key: "ECE 103" },
                        { key: "ECE 171" },
                        { key: "ECE 172" },
                        { key: "ECE 201" },
                        { key: "ECE 202" },
                        { key: "ECE 203" },
                        { key: "ECE 301" },
                        { key: "ECE 302" },
                        { key: "ECE 303" },
                        { key: "ECE 401" },
                        { key: "ECE 402" },
                        { key: "ECE 403" },
    
                    ],
    
                    linkDataArray: [
                        { from: "MTH 111", to: "MTH 112" },
                        { from: "MTH 112", to: "MTH 231" },
                        { from: "MTH 112", to: "MTH 251" },
                        { from: "MTH 251", to: "MTH 252" },
                        { from: "MTH 252", to: "MTH 260" },
                        { from: "MTH 252", to: "MTH 253" },
    
                        { from: "ECE 101", to: "ECE 102" },
                        { from: "ECE 102", to: "ECE 103" },
                        { from: "ECE 103", to: "ECE 201" },
                        { from: "ECE 201", to: "ECE 202" },
                        { from: "ECE 202", to: "ECE 203" },
                        { from: "MTH 111", to: "ECE 101" },
                        { from: "MTH 111", to: "ECE 171" },
                        { from: "ECE 171", to: "ECE 172" },
                        { from: "ECE 172", to: "ECE 201" },
                        { from: "MTH 252", to: "ECE 201" },

                        { from: "ECE 203", to: "ECE 301" },
                        { from: "ECE 301", to: "ECE 302" },
                        { from: "ECE 302", to: "ECE 303" },
                        { from: "ECE 303", to: "ECE 401" },
                        { from: "ECE 401", to: "ECE 402" },
                        { from: "ECE 402", to: "ECE 403" },
                    ]
                }
            );
        return myDiagram;
    }

    handleModalSubmit = () => {
        let userInput = document.getElementById('inputCRN').value;
        let CRNList = this.genCRNList(userInput);

        requestedCourseList = {}

        CRNList.forEach(CRN => {
            let requestURL = `https://app.banner.pdx.edu/cpg/offeringServices/browse/?search=${CRN}&dedup=`
            fetch(CRN)
            .then()
        });
    }

    addCourseNode = () => {

        let CRN = "test";
        this.myDiagram.model.addNodeData({ key: `${CRN}` });
        //diagram.requestUpdate();
    }

    submitSearch = (event) => {
        event.preventDefault();
        let searchBar = document.getElementById('CRNSearch');
        let userInput = searchBar.value;
        searchBar.value = "";
        let CRNList = this.genCRNList(userInput);

        let requestedCourse = {}
        

        if(CRNList.length == 1) {
            let requestURL = `https://app.banner.pdx.edu/cpg/offeringServices/browse/?search=${CRNList[0]}&dedup=`

            let defaultSearchButtonHTML = this.$searchButtonContainer.innerHTML;
            this.$searchButtonContainer.innerHTML = `
            button class="btn btn-primary" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            </button>
            `;
            toastr.info('Retrieving Course Info');
            fetch(requestURL)
            .then(response => {
                requestedCourse['PreviewInfo'] = response;
                courseSumURL = `https://app.banner.pdx.edu/cpg/courseServices/read/${response.id}`;
                fetch(courseSumURL)
                .then(summarry => {
                    requestedCourse['summaryInfo'] = summarry;
                    console.log(requestedCourse);
                    this.createDescriptionModal(requestedCourse);
                })
            });
        }
        else {
            if (CRNList.length > 1) {
                toastr.error(`You may only search for one class at a time\n
            However, you may add multiple courses at once via the "Add Class" button`)
            }
            else {toastr.error('Invalid Course Number')};
        }
    }
    
    genCRNList = (userInput) => {
        userInput = userInput.replace(/\s+/g, '')
        let CRNList = userInput.split(',');
        let validCRNList = [];
        
        CRNList.forEach(CRN => {
            if (this.validateCRN(CRN)) {
                validCRNList.push(CRN);
            }
        });
        
        return validCRNList
    }

    validateCRN = (userInput) => {
        const pattern = /^[a-z]{2,3}\s?\d{1,3}/;
        let test = pattern.test(userInput);
        return test;
    }

    resetDiagram = () => {
        
    }

    createDescriptionModal = (requestedCourse) => {
        this.$SearchDescriptionModal.innerHTML = `
         <div class="modal-dialog">
           <div class="modal-content bg-secondary">
             <div class="modal-header">
               <h3 class="modal-title text-light" id="searchCourseModalTitle">Calculus II</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body fw-bold">
               <ul class="list-group">
                 <li class="list-group-item">
                     <div id="descriptionCRN">CRN: MTH 252</div>
                     <div id="descriptionCredits">Credits: 5</div>
                     <div id="descriptionPreqs">Prerequisites: MTH 251</div>
                 </li>
                 <li class="list-group-item" id="courseProjection">
                   <span>3-Year Course Projection:</span>
                   <div class="pt-sm-2">
                     <table class="table table-secondary table-striped table-bordered border-secondary">
                       <thead>
                         <tr class="text-center">
                           <th scope="col">Year</th>
                           <th class="w-25" scope="col">Fall</th>
                           <th class="w-25" scope="col">Winter</th>
                           <th class="w-25" scope="col">Spring</th>
                           <th class="w-25" scope="col">Summer</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <th scope="row">2022-2023</th>
                           <td align="center" class="">Mark</td>
                           <td align="center" class="">Otto</td>
                           <td align="center" class="">@mdo</td>
                           <td align="center" class="">@mdo</td>
                         </tr>
                         <tr>
                           <th scope="row">2023-2024</th>
                           <td align="center" class="">test</td>
                           <td align="center" class="text-danger">
                               <svg xmlns="http://www.w3.org/2000/svg" width="60%" fill="currentColor" class="bi bi-calendar-x" viewBox="0 0 16 16">
                                 <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
                                 <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                               </svg>
                           </td>
                           <td align="center" class="">@fat</td>
                           <td align="center" class="">@mdo</td>
                         </tr>
                         <tr>
                           <th scope="row">2024-2025</th>
                           <td align="center" class="">test</td>
                           <td align="center" class="">Larry</td>
                           <td align="center" class="">@twitter</td>
                           <td align="center" class="">@mdo</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 </li>
                 <li class="list-group-item" id="courseDescription">Course Description:<div class="fw-normal">
                   Integral calculus of functions of a single variable, including the Fundamental Theorem of Calculus, numerical integration and applications.  This is the second course in a sequence of three: Mth 251, Mth 252, and Mth 253, which must be taken in sequence. Prerequisite: Mth 251.
                 </div></li>
               </ul>
             </div>
             <div class="modal-footer">
               <div class="d-grid gap-2 col-10 mx-auto">
                 <div class="row justify-content-evenly">
                   <button type="button" class="btn btn-light col-sm-10 me-1">Add Course</button>
                 </div>
               </div>
             </div>
           </div>
         </div>
        `
        let myModal = new bootstrap.Modal(this.$SearchDescriptionModal); 
        myModal.toggle();
    }

    elementFromHTML(html) {
        const template = document.createElement('template');

        //sets the generated element's html and trims off white space
        template.innerHTML = html.trim()

        return template.content.firstElementChild;
    }
}


let home;
window.onload = () => {new Home();};