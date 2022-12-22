let turnToRealDCLFlag = false;

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
const panel = createPanel(250, 80);

divKonvaContainer.appendChild(modalForce);
divKonvaContainer.appendChild(modalMoment);
divKonvaContainer.appendChild(modalFixedSupport);
divKonvaContainer.appendChild(modalRollerSupport);
divKonvaContainer.appendChild(modalPinnedSupport);
divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);

listenPanelMovement(panel);
listenPanelMovement(delPanel);
listenPanelMovement(modalMoment); 
listenPanelMovement(modalForce); 
listenPanelMovement(modalFixedSupport);
listenPanelMovement(modalRollerSupport); 
listenPanelMovement(modalPinnedSupport);
//------------------------------------------------------elements dcl-----------------------------------------------//

const [dcl, group] = createBeam(nameBeam="initialBeam"); // initialBeam no puede ser destruida
const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();

dcl.setIsOrigin(true);

//------------------------------------------------------Eventos usuario-----------------------------------------------//
listenNodeMovement(group, shadowLine, "initialBeam");
listenCreateElement();
listenDeleteElement();
listenHiddePanels();

turnToRealDCL();



