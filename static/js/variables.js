let countFixedSupport = 0;
let countRollerSupport = 0;
let countpoyoNoDeslizante = 0;

const blockSnapSize = 40;
const widthStage = blockSnapSize * 36;
const heightStage = blockSnapSize * 15;
const nodeRadius = 5;
const largeForce = 2*blockSnapSize;
const strokeForce = 4;
const lasForce = largeForce + strokeForce + 2*nodeRadius;
const allDCLelements = [];

const nfillc = "#0000FF";
const nstrokec = "#0000FF";
const shadowFill = "#CF6412";
const shadowStroke = "#FF7B17";
const nodeColor = "red";
const originColor = "green";
const originColorMouseOver = "#00ff00";

let turnToRealDCLFlag = false;
let showReferencesFlag = false;

let distanceMultiplier = 1;
let dimensionValue = "m";

const WIDTHPANEL = 280;
const HEIGHTPANEL = 360;

const baseUrl = window.location.origin;
const imagesFolder = `${baseUrl}/static/images/elementImages`;
