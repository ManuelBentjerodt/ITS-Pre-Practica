
const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;

const stage = createStage("containerKonva");

const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
generateGrid(layer);

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

const [dcl, group] = createBeam(layer, nameBeam="initialBeam"); // initialBeam no puede ser destruida
dcl.setIsOrigin(true);

paintIfMouseOver(dcl, group.getChildren()[0], nfillc, nstrokec, group.getChildren()[0].getAttr("fill"), group.getChildren()[0].getAttr("stroke"));
paintIfMouseOver(dcl, group.getChildren()[1], nfillc, nstrokec, group.getChildren()[1].getAttr("fill"), group.getChildren()[1].getAttr("stroke"));
paintIfMouseOver(dcl, group.getChildren()[2], nfillc, nstrokec, group.getChildren()[2].getAttr("fill"), group.getChildren()[2].getAttr("stroke"));

const shadowLine = createShadowBeam(layer, 8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();

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

// listenPanelMovement(panel);
listenPanelMovement(anglePanel); //new
listenPanelMovement(delPanel);
listenPanelMovement(modalMoment); 
listenPanelMovement(modalForce); 
listenPanelMovement(modalFixedSupport);
listenPanelMovement(modalRollerSupport); 
listenPanelMovement(modalPinnedSupport);


listenNodeMovement(dcl, group, shadowLine, "initialBeam", listenUpdate=false);
listenCreateElement(divKonvaContainer);
listenDeleteElement(divKonvaContainer);
listenHiddePanels();


showReferences();
turnToRealDCL(dcl, listenUpdate=false);
