import './general';
import toastr from 'toastr';
window.bootstrap = require('bootstrap');

class Home {
    constructor() {
        this.$searchButtonContainer = document.getElementById('searchButtonContainer');
        this.$SearchDescriptionModal = document.getElementById('searchCourseModal');

        //adjust the framing of the div that will have our diagram
        let navbarHeight = document.querySelector('nav').offsetHeight;
        let $canvasDiv = document.getElementById('myDiagramDiv');
        $canvasDiv.style.height = `100vh - ${navbarHeight}px`;
        $canvasDiv.style.top = `${navbarHeight}px`;

        this.$searchButtonContainer.addEventListener('onclick', () => {
            this.createDescriptionModal()
          })

       this.myDiagram = this.createDiagram();
       

        this.init();

        //document.querySelector('canvas').style.paddingTop = `${navbarHeight / 4}px`;
    }

    init() {
        this.addCourseNode()
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
        let userInput = document.getElementById('CRNSearch').value;
        let CRNList = this.genCRNList(userInput);

        let requestedCourse = {}
        

        if(CRNList.length == 1) {
            let requestURL = `https://app.banner.pdx.edu/cpg/offeringServices/browse/?search=${CRNList[0]}&dedup=`

            let defaultSearchButtonHTML = $searchButtonContainer.innerHTML;
            $searchButtonContainer.innerHTML = `
            button class="btn btn-primary" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
            </button>
            `;
            toastr.info('Retrieving Course Info')
            fetch(requestURL)
            .then(response => {
                requestedCourse['PreviewInfo'] = response;
                courseSumURL = `https://app.banner.pdx.edu/cpg/courseServices/read/${response.id}`;
                fetch(courseSumURL)
                .then(summarry => {
                    requestedCourse['summaryInfo'] = summarry;
                    this.createDescriptionModal(requestedCourse);
                })
            })
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
                validCRNList.append(CRN);
            }
        });
        
        return validCRNList
    }

    validateCRN = (userInput) => {
        const pattern = /^[a-z]{2,3}\s?\d{1,3}/;
        return pattern.test(userInput);
    }

    resetDiagram = () => {
        
    }

    createDescriptionModal = (requestedCourse) => {
        // this.$SearchDescriptionModal.innerHTML = `
        // <div class="modal-dialog">
        //     <div class="modal-content bg-secondary">
        //       <div class="modal-header">
        //         <h3 class="modal-title text-light" id="searchCourseModalTitle">Course Title</h5>
        //         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        //       </div>
        //       <div class="modal-body fw-bold">
        //         <ul class="list-group">
        //           <li class="list-group-item" id="descriptionCRN">CRN: </li>
        //           <li class="list-group-item" id="descriptionCredits">Credits: 5</li>
        //           <li class="list-group-item" id="descriptionDepartment">Department: Mathematics</li>
        //           <li class="list-group-item" id="courseDescription">Course Description:<div class="fw-normal">lormen ahdwkjadhkjaskjda ashdakjdhjkad kajsd</div></li>
        //         </ul>
        //       </div>
        //       <div class="modal-footer">
        //         <div class="d-grid gap-2 col-10 mx-auto">
        //           <div class="row justify-content-evenly">
        //             <button type="button" class="btn btn-light col-sm-10 me-1">Add Course</button>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // `
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