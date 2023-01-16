//const { listen } = require("express/lib/application");

const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;


//------------------------------------------------------Creacion canvas-----------------------------------------------//
const stage = createStage("containerKonva");


const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
generateGrid(layer);

//------------------------------------------------------Creacion paneles-----------------------------------------------//
const divKonvaContainer = document.querySelector("#containerKonva");

const modalForce = createModalForce(); 
const modalMoment = createModalMoment(); 
const modalFixedSupport = createModalFixedSupport();
const modalRollerSupport = createModalRollerSupport(); 
const modalPinnedSupport = createModalPinnedSupport();
const delPanel = createDelPanel();
const anglePanel = createAngleReferencePanel(); //new
const panel = createPanel();

divKonvaContainer.appendChild(modalForce);
divKonvaContainer.appendChild(modalMoment);
divKonvaContainer.appendChild(modalFixedSupport);
divKonvaContainer.appendChild(modalRollerSupport);
divKonvaContainer.appendChild(modalPinnedSupport);
divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);
divKonvaContainer.appendChild(anglePanel); //new

listenPanelMovement(panel);
listenPanelMovement(delPanel);
listenPanelMovement(modalMoment); 
listenPanelMovement(modalForce); 
listenPanelMovement(modalFixedSupport);
listenPanelMovement(modalRollerSupport); 
listenPanelMovement(modalPinnedSupport);
listenPanelMovement(anglePanel); 

listenCreateElement();
listenDeleteElement();
listenHiddePanels();
listenAngleReference(); 


x_reference = new xReference([0,heightStage-5*blockSnapSize]);
y_reference = new yReference([widthStage-5*blockSnapSize,0]);

x_reference.createKonvaLine();
y_reference.createKonvaLine();

x_reference.buildLine();
y_reference.buildLine();

x_reference.updateSegmentedLines();
y_reference.updateSegmentedLines();

layer.add(x_reference.getKonvaLine());
layer.add(y_reference.getKonvaLine());

const dclJSON = document.querySelector("#dclJSON").textContent;


let dcl;
let initialBeam;

const DCL = {}


if (dclJSON == "null") {
    [dcl, initialBeam] = createBeam(nameBeam="initialBeam");
    dcl.setIsOrigin(true);
    const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
    shadowLine.hide();
    listenNodeMovement(initialBeam, shadowLine, "initialBeam");
    console.log("primera vez editando");
    
} else {
    dcl = recreateDcl(dclJSON);

    
    const otherCopy = recreateDcl(dclJSON); 
    const otherCopy2 = recreateDcl(dclJSON);

    const standarizedDCL1 = standarizeDCL(otherCopy); // dcl con coordenadas en referencia al nodo izquierdo abajo
    const standarizeDCL2 = standarizeDCL(otherCopy2); 
    
    // console.log("standarizedDCL", standarizedDCL1);
    // console.log("othercopy2 without standarization", otherCopy2);


    const ejemDCL = areDclEqual(standarizedDCL1, standarizeDCL2); 
    
    drawDCL(dcl);
    initialBeam = dcl.childNodes[0].konvaObjects.beam
    console.log("ya has editado otras veces")
}


x_reference.hideAll();
y_reference.hideAll();

const initialBeamSubElements = initialBeam.getChildren();

showReferences();


paintIfMouseOver(initialBeamSubElements[0], nfillc, nstrokec, initialBeamSubElements[0].getAttr("fill"), initialBeamSubElements[0].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[1], nfillc, nstrokec, initialBeamSubElements[1].getAttr("fill"), initialBeamSubElements[1].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[2], nfillc, nstrokec, initialBeamSubElements[2].getAttr("fill"), initialBeamSubElements[2].getAttr("stroke"));


updateDificulty();
updateClassification();
turnToRealDCL();

const taskInfo = document.querySelector("#taskInfo");

const statement = taskInfo.dataset.statement;
if (statement != "None") document.querySelector("#statement").value = statement;

const sizeFactor = taskInfo.dataset.sizefactor;
document.querySelector("#dim").value = sizeFactor;

const applySizeFactor = document.querySelector("#dimSubmit");



x_reference.newUnitSize(sizeFactor);
y_reference.newUnitSize(sizeFactor);

x_reference.drawIndexes();
x_reference.updateSegmentedLines();
y_reference.drawIndexes();
y_reference.updateSegmentedLines();

if (sizeFactor < 1){       
    unitSize = sizeFactor*100; // ahora esta en cm
    dimensionValue = "cm";
    distanceMultiplier = unitSize;
    
}
else{
    dimensionValue = "m";
    distanceMultiplier = sizeFactor;
}
updateEquations();
