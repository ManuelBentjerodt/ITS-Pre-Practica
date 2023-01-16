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

x_reference.hideAll();
y_reference.hideAll();


const correctDclJson = document.querySelector("#correctDcl").textContent;
const correctDcl = recreateDcl(correctDclJson);

drawDcl(correctDcl, layerTeacher, null, null, false);

visibilityLines(layerTeacher, "horizontalLine", "hide");
visibilityLines(layerTeacher, "verticalLine", "hide");