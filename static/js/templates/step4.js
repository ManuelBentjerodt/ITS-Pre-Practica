
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


const dclJSON = document.querySelector("#dclJSON").textContent;

let dcl;
let initialBeam;

const DCL = {}


if (dclJSON == "null") {
    [dcl, initialBeam] = createBeam(nameBeam="initialBeam");
    dcl.setIsOrigin(true);
    const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
    shadowLine.hide();
    listenNodeMovement(initialBeam, shadowLine, "initialBeam");
    console.log("primera vez editando");
    
} else {
    dcl = recreateDcl(dclJSON);

    
    drawDCL(dcl);
    initialBeam = dcl.childNodes[0].konvaObjects.beam
    console.log("ya has editado otras veces")
}

//borrar cosas innesesarias///////////////

const pDificulty = document.querySelector("#difficultyValue");
pDificulty.innerText = "";

const eq = document.querySelector("#equations");
const cl = document.querySelector("#classification");
const removed = el => el.parentElement.removeChild(el);
removed(eq);
removed(cl);
/////////////////////////


x_reference.hideAll();
y_reference.hideAll();

const initialBeamSubElements = initialBeam.getChildren();




paintIfMouseOver(initialBeamSubElements[0], nfillc, nstrokec, initialBeamSubElements[0].getAttr("fill"), initialBeamSubElements[0].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[1], nfillc, nstrokec, initialBeamSubElements[1].getAttr("fill"), initialBeamSubElements[1].getAttr("stroke"));
paintIfMouseOver(initialBeamSubElements[2], nfillc, nstrokec, initialBeamSubElements[2].getAttr("fill"), initialBeamSubElements[2].getAttr("stroke"));

const shadowLine = createShadowBeam(8*blockSnapSize, 8*blockSnapSize,  3*blockSnapSize, 0,  "shadowInitialBeam");
shadowLine.hide();


listenCreateElement();
listenDeleteElement();
listenHiddePanels();

showReferences();
turnToRealDCL(listenUpdate=false);

const taskInfo = document.querySelector("#taskInfo").dataset;
const statement = taskInfo.statement;
console.log("statement",statement);
document.querySelector("#statement").innerHTML = statement;


const dclReal  = document.getElementById("turnToRealDCL");
dclReal.click();