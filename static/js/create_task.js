
const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;

//------------------------------------------------------Creacion canvas-----------------------------------------------//
const stage = createStage("containerKonva");

// let stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');

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
listenPanelMovement(anglePanel); //new
listenPanelMovement(delPanel);
listenPanelMovement(modalMoment); 
listenPanelMovement(modalForce); 
listenPanelMovement(modalFixedSupport);
listenPanelMovement(modalRollerSupport); 
listenPanelMovement(modalPinnedSupport);


//------------------------------------------------------Creacion referencia-----------------------------------------------//


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
//------------------------------------------------------elements dcl-----------------------------------------------//

const [dcl, group] = createBeam(nameBeam="initialBeam"); // initialBeam no puede ser destruida

paintIfMouseOver(group.getChildren()[0], nfillc, nstrokec, group.getChildren()[0].getAttr("fill"), group.getChildren()[0].getAttr("stroke"));
paintIfMouseOver(group.getChildren()[1], nfillc, nstrokec, group.getChildren()[1].getAttr("fill"), group.getChildren()[1].getAttr("stroke"));
paintIfMouseOver(group.getChildren()[2], nfillc, nstrokec, group.getChildren()[2].getAttr("fill"), group.getChildren()[2].getAttr("stroke"));


const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();

dcl.setIsOrigin(true);


//------------------------------------------------------Eventos usuario-----------------------------------------------//
listenNodeMovement(group, shadowLine, "initialBeam");
listenCreateElement();
listenDeleteElement();
listenHiddePanels();

turnToRealDCL();
showReferences();

listenAngleReference();

updateDificulty();
updateClassification();
