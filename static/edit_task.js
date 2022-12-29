//const { listen } = require("express/lib/application");

const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;


//------------------------------------------------------Creacion canvas-----------------------------------------------//
const stage = new Konva.Stage({
    name: "stage",
    container: "container",
    width: widthStage,
    height: heightStage
});

// let stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');

const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
generateGrid(layer);

//------------------------------------------------------Creacion paneles-----------------------------------------------//
const divKonvaContainer = document.querySelector("#container");

const modalForce = createModalForce(250, 80); 
const modalMoment = createModalMoment(250, 80); 
const modalFixedSupport = createModalFixedSupport(250, 80);
const modalRollerSupport = createModalRollerSupport(250, 80); 
const modalPinnedSupport = createModalPinnedSupport(250, 80);
const delPanel = createDelPanel(0,0);
const anglePanel = createAngleReferencePanel(0,0); //new
const panel = createPanel(250, 80);

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
listenPanelMovement(anglePanel); //new

listenCreateElement();
listenDeleteElement();
listenHiddePanels();
listenAngleReference(); //new

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
drawDCL(dcl);

const initialBeam = dcl.childNodes[0].konvaObjects.beam.getChildren();

paintIfMouseOver(initialBeam[0], nfillc, nstrokec, initialBeam[0].getAttr("fill"), initialBeam[0].getAttr("stroke"));
paintIfMouseOver(initialBeam[1], nfillc, nstrokec, initialBeam[1].getAttr("fill"), initialBeam[1].getAttr("stroke"));
paintIfMouseOver(initialBeam[2], nfillc, nstrokec, initialBeam[2].getAttr("fill"), initialBeam[2].getAttr("stroke"));


updateEquations();



