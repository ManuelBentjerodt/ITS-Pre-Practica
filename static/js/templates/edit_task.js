const divKonvaContainer = document.querySelector("#containerKonva");

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
console.log("dclJSON: ", dclJSON);


let dcl;
let initialBeam;

const DCL = {}


if (dclJSON == "null") {
    [dcl, initialBeam] = createBeam(layer, nameBeam="initialBeam");
    dcl.setIsOrigin(true);

    const shadowLine = createShadowBeam(layer, 8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
    shadowLine.hide();

    listenNodeMovement(dcl, initialBeam, shadowLine, "initialBeam");
    console.log("primera vez editando");
    
} else {
    dcl = recreateDcl(dclJSON);
    console.log("dcl", dcl);
    
    initialBeam = dcl.childNodes[0].konvaObjects.beam
    drawDcl(dcl, layer);

    console.log("ya has editado otras veces")
}
const panel = createPanel(divKonvaContainer, layer, dcl);


const modalForce = createModalForce(divKonvaContainer, layer, dcl); 
const modalMoment = createModalMoment(divKonvaContainer, layer, dcl); 
const modalFixedSupport = createModalFixedSupport(divKonvaContainer, layer, dcl);
const modalRollerSupport = createModalRollerSupport(divKonvaContainer, layer, dcl); 
const modalPinnedSupport = createModalPinnedSupport(divKonvaContainer, layer, dcl);
const delPanel = createDelPanel(divKonvaContainer, layer, dcl);
const anglePanel = createAngleReferencePanel(divKonvaContainer, layer, dcl); //new

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

listenCreateElement(divKonvaContainer);
listenDeleteElement(divKonvaContainer);
listenAngleReference(divKonvaContainer); 
listenHiddePanels();

hideAllPanels();




x_reference.hideAll();
y_reference.hideAll();

const initialBeamSubElements = initialBeam.getChildren();

showReferences();


paintIfMouseOver(initialBeamSubElements[0], nfillc, nstrokec, initialBeamSubElements[0].getAttr("fill"), initialBeamSubElements[0].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[1], nfillc, nstrokec, initialBeamSubElements[1].getAttr("fill"), initialBeamSubElements[1].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[2], nfillc, nstrokec, initialBeamSubElements[2].getAttr("fill"), initialBeamSubElements[2].getAttr("stroke"));


updateDificulty();
updateClassification();
turnToRealDCL(layer);

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
