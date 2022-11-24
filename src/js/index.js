import './general';
//import navbar from './navbar';

class Home {
    constructor() {
        this.init();
    }
    init() {
        //document.querySelector('.navbar').innerHTML = navbar(1);
    
        go.licenseKey = "54ff40e6b21c28c702d95d76423d38f919a57563c8841da30a0717f6ef086c46729cb87154c19bc7daa84efc492e928d88c56e299344073eb538d6d810e587fde23023b0175b419cb40573939ffa78f1fd6a61f1c3b57ebdd8678cf6";
    
        let $ = go.GraphObject.make;
        let myDiagram = $(go.Diagram, "myDiagramDiv",
            {
                "draggingTool.isEnabled": false
            });
    
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", { fill: "#7289da", strokeCap: "round", stroke: "", strokeWidth: "3",}),
                $(go.TextBlock, { margin: 8, font: "bold 24px Brush Script MT, cursive"},
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
                  { isPanelMain: true, stroke: null, strokeWidth: 5 }),
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
                    ]
                }
            );
    }
}


let home;
window.onload = () => {new Home();};