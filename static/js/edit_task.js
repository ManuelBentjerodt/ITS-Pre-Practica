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
const dcl = recreateDcl(dclJSON);

x_reference.hideAll();
y_reference.hideAll();


showReferences();

drawDCL(dcl);

const initialBeam = dcl.childNodes[0].konvaObjects.beam.getChildren();

paintIfMouseOver(initialBeam[0], nfillc, nstrokec, initialBeam[0].getAttr("fill"), initialBeam[0].getAttr("stroke"));
paintIfMouseOver(initialBeam[1], nfillc, nstrokec, initialBeam[1].getAttr("fill"), initialBeam[1].getAttr("stroke"));
paintIfMouseOver(initialBeam[2], nfillc, nstrokec, initialBeam[2].getAttr("fill"), initialBeam[2].getAttr("stroke"));

updateEquations();
updateDificulty();
updateClassification();
turnToRealDCL();

const taskInfo = document.querySelector("#taskInfo");

const statement = taskInfo.dataset.statement;
document.querySelector("#statement").value = statement;

const sizeFactor = taskInfo.dataset.sizefactor;
document.querySelector("#dim").value = sizeFactor;
console.log(document.querySelector("#dim"))

const applySizeFactor = document.querySelector("#dimSubmit");
applySizeFactor.click();




