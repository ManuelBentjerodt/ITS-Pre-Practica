const resolvingTask = false;
//------------------------------------------------------Creacion canvas-----------------------------------------------//
const stage = new Konva.Stage({
    name: "stage",
    container: "container",
    width: widthStage,
    height: heightStage
});

let stage2 = Konva.Node.create(JSON.parse(stage.clone({name: "stage2"}).toJSON()), 'container2');

const layer = new Konva.Layer({name: "layer"});
stage.add(layer);

//------------------------------------------------------Creacion grilla-----------------------------------------------//
generateGrid(layer);

//------------------------------------------------------Creacion paneles-----------------------------------------------//
const divKonvaContainer = document.querySelector("#container");

const panel = createPanel(400, 80);
const delPanel = createDelPanel(0,0);

divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);

listenPanelMovement(panel);
listenPanelMovement(delPanel);

//------------------------------------------------------elements dcl-----------------------------------------------//
const lastBeamNodeClick = {x: 0, y: 0};
let lastNodeClick = null;
let lastElementClick = undefined;

const [dcl, group] = createBeam(nameBeam="initialBeam"); // initialBeam no puede ser destruida
const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();

//------------------------------------------------------Eventos usuario-----------------------------------------------//
listenNodeMovement(group, shadowLine, "initialBeam");
listenCreateElement();
listenDeleteElement();
listenHiddePanels();

replaceSupports();




