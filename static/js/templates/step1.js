
const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;

const stage = createStage("containerKonva");

const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
generateGrid(layer);

const divKonvaContainer = document.querySelector("#containerKonva");

const modalForce = createModalForce(listenUpdate=false);
const modalMoment = createModalMoment(listenUpdate=false); 
const modalFixedSupport = createModalFixedSupport(listenUpdate=false);
const modalRollerSupport = createModalRollerSupport(listenUpdate=false); 
const modalPinnedSupport = createModalPinnedSupport(listenUpdate=false);
const delPanel = createDelPanel(listenUpdate=false);
const anglePanel = createAngleReferencePanel(listenUpdate=false); //new
const panel = createPanel(listenUpdate=false);


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

const [dcl, group] = createBeam(nameBeam="initialBeam"); // initialBeam no puede ser destruida

paintIfMouseOver(group.getChildren()[0], nfillc, nstrokec, group.getChildren()[0].getAttr("fill"), group.getChildren()[0].getAttr("stroke"));
paintIfMouseOver(group.getChildren()[1], nfillc, nstrokec, group.getChildren()[1].getAttr("fill"), group.getChildren()[1].getAttr("stroke"));
paintIfMouseOver(group.getChildren()[2], nfillc, nstrokec, group.getChildren()[2].getAttr("fill"), group.getChildren()[2].getAttr("stroke"));


const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();

dcl.setIsOrigin(true);
console.log("dcl",dcl);
listenNodeMovement(group, shadowLine, "initialBeam", listenUpdate=false);
listenCreateElement();
listenDeleteElement();
listenHiddePanels();

showReferences();
turnToRealDCL(listenUpdate=false);

const taskInfo = document.querySelector("#taskInfo").dataset;
const statement = taskInfo.statement;
document.querySelector("#statement").innerHTML = statement;


const correctJson = document.getElementById('correctDcl').textContent;
const correctDcl = recreateDcl(correctJson);
console.log("correct Dcl: ",correctDcl);
