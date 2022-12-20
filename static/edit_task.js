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

const panel = createPanel(250, 80);
const delPanel = createDelPanel(0,0);

const modalForce = createModalForce(250, 80); // NUEVO
const modalMoment = createModalMoment(250,80) // nuevo

divKonvaContainer.appendChild(panel);
divKonvaContainer.appendChild(delPanel);
divKonvaContainer.appendChild(modalForce);
divKonvaContainer.appendChild(modalMoment);

listenPanelMovement(panel);
listenPanelMovement(delPanel);

listenPanelMovement(modalMoment); // NUEVO
listenPanelMovement(modalForce); // NUEVO


listenCreateElement();
listenDeleteElement();
listenHiddePanels();

const dclJSON = document.querySelector("#dclJSON").textContent;

const dcl = recreateDcl(dclJSON);

drawDCL(dcl);
updateEquations();

