class Node {
    constructor(_coordinate, id=Date.now()) {
        this.id = id
        this.coordinate = _coordinate;  // array(x, y)
        this.parent = null;            // node
        
        this.childNodes = [],         // node
        this.link = null,              // type = 'deslizante', 'fixedSupport', etc
        this.forces = [],                // array(magnitud, angle)
        this.moments = []                // magnitud   
        
        this.konvaObjects = {
            beam: null,
            shadowBeam: null,
            link: null,
            forces: [],
            moments: [],
            circle: null
            
        }
    }

    setId(id) {
        this.id = id;
    }

    setCoordinate(newCoordinate) {
        this.coordinate = newCoordinate;
    }

    setParent(parentNode) {
        this.parent = parentNode;
    }

    addChild(node) {
        this.childNodes.push(node);
    }

    setLink(link) {
        const types = new Set(["rollerSupport", "pinnedSupport", "fixedSupport", "ballJoint", "connectingRod"]);
        if (types.has(link)) {
            this.link = link;
        }
    }

    deleteLink(){
        this.link = null;
    }

    addForce(magnitud, angle, id) {
        this.forces.push([magnitud, angle]);
    }

    addMoment(magnitud) {
        this.moments.push(magnitud);
    }

    setKonvaBeam(object){
        this.konvaObjects.beam = object;
    }

    setKonvaLink(object){
        this.konvaObjects.link = object;
    }

    addKonvaForce(object){
        this.konvaObjects.forces.push(object);
    }

    addKonvaMoment(object){
        this.konvaObjects.forces.push(object);
    }

    setKonvaShadowBeam(object){
        this.konvaObjects.shadowBeam = object;
    }

    setKonvaCircle(object){
        this.konvaObjects.circle = object;
    }

    updateAngleForce(index, newAngle){
        this.forces[index][1] = newAngle
    }

    generateJSON(){
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        //const copy = this.clone()
        copy.getAllDecendents().forEach(descendent => {
            removeAttributesForJSON(descendent);
        });
        removeAttributesForJSON(copy);
    
        return JSON.stringify(copy);
    }


    findNodeById(_id, root=this) {
        const queue = [];
        queue.push(root);

        const discovered = [];
        discovered.push(root);

        while (queue.length) {
            let actual = queue.shift();
            
            if (actual.id == _id) {
                return actual;
            }
            actual.childNodes.forEach( child => {
                if (!(discovered.includes(child))) {
                    discovered.push(child)
                    queue.push(child)
                }
            });
        }

        console.log("could not find element by id... returning null");
        return null;

    }

    getAllDecendents(root=this) {
        const queue = [];
        queue.push(root);

        const discovered = [];
        
        while (queue.length) {
            let actual = queue.shift();

            
            actual.childNodes.forEach( child => {
                if (!(discovered.includes(child))) {
                    discovered.push(child);
                    queue.push(child);
                }
            });
        }

        return discovered;
    }
    
}

