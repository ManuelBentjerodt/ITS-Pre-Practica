const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;

const stage = createStage("containerKonva");
const stageTeacher = createStage("containerKonvaTeacher");

const layer = new Konva.Layer({name: "layer"});
const layerTeacher = new Konva.Layer({name: "layerTeacher"});

stage.add(layer);
stageTeacher.add(layerTeacher);

generateGrid(layer);
generateGrid(layerTeacher);

const divKonvaContainer = document.querySelector("#containerKonva");

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

x_reference.hideAll();
y_reference.hideAll();


const correctDclJson = document.querySelector("#correctDcl").textContent;
const correctDcl = recreateDcl(correctDclJson);

const dcl = recreateDcl(correctDclJson);

const modalForce = createModalForce(divKonvaContainer, layer, dcl, false); 
const modalMoment = createModalMoment(divKonvaContainer, layer, dcl, false); 
const modalFixedSupport = createModalFixedSupport(divKonvaContainer, layer, dcl, false);
const modalRollerSupport = createModalRollerSupport(divKonvaContainer, layer, dcl, false); 
const modalPinnedSupport = createModalPinnedSupport(divKonvaContainer, layer, dcl, false);
const delPanel = createDelPanel(divKonvaContainer, layer, dcl, false);
const anglePanel = createAngleReferencePanel(divKonvaContainer, layer, dcl, false); //new
const panel = createPanel(divKonvaContainer, layer, dcl, false);

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
listenHiddePanels();
listenAngleReference(divKonvaContainer); 


drawDcl(correctDcl, layerTeacher, null, null, false);
removeDraggableFromAllNodes(correctDcl);

const allCorrectNodes = [correctDcl, ...correctDcl.getAllDecendents()];
allCorrectNodes.forEach(node => {
    removePaintIsMouseOver(node);
});

visibilityLines(layerTeacher, "horizontalLine", "hide");
visibilityLines(layerTeacher, "verticalLine", "hide");



const allNodes = [dcl, ...dcl.getAllDecendents()]
allNodes.forEach(node => {
    node.link = null;
    node.linkRotarion = null;
    node.forces = [];
    node.moments = [];
});

drawDcl(dcl, layer, null, null, false);

const initialBeam = dcl.childNodes[0].konvaObjects.beam 

const initialBeamSubElements = initialBeam.getChildren()
paintIfMouseOver(dcl, initialBeamSubElements[0], nfillc, nstrokec, initialBeamSubElements[0].getAttr("fill"), initialBeamSubElements[0].getAttr("stroke"));
paintIfMouseOver(dcl, initialBeamSubElements[1], nfillc, nstrokec, initialBeamSubElements[1].getAttr("fill"), initialBeamSubElements[0].getAttr("stroke"));
paintIfMouseOver(dcl, initialBeamSubElements[2], nfillc, nstrokec, initialBeamSubElements[2].getAttr("fill"), initialBeamSubElements[2].getAttr("stroke"));
paintIfM