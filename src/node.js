class Node {
    constructor(_coordinate, id=Date.now()) {
        this.id = id
        this.coordinate = _coordinate;  // array(x, y)
        this.parent = null;            // node
        
        this.childreanNodes = [],         // node
        this.vinculo = null,              // type = 'deslizante', 'fixedSupport', etc
        this.forces = [],                // array(magnitud, angle)
        this.moments = []                // magnitud   
        

        this.konvaObjects = {
            beam: null,
            shadowBeam: null,
            vinculo: null,
            forces: [],
            moments: [],
            circle: null
            
        }


    }

    setId(id) {
        this.id = id
    }

    setCoordinate(newCoordinate) {
        this.coordinate = newCoordinate;
    }

    setParent(parentNode) {
        this.parent = parentNode;
    }

    addChild(node) {
        this.childreanNodes.push(node);
    }

    setVinculo(vinculo) {
        const types = new Set(["rollerSupport", "pinnedSupport", "fixedSupport", "ballJoint", "connectingRod"]);
        if (types.has(vinculo)) {
            this.vinculo = vinculo;
        }
    }

    deleteVinculo(){
        this.vinculo = null;
    }

    addForce(magnitud, angle) {
        this.forces.push([magnitud, angle]);
    }

    addMoment(magnitud) {
        this.moments.push(magnitud)
    }



    setKonvaBeam(object){
        this.konvaObjects.beam = object;
    }

    setKonvaVinculo(object){
        this.konvaObjects.vinculo = object
    }

    addKonvaForce(object){
        this.konvaObjects.forces.push(object)
    }

    addKonvaMoment(object){
        this.konvaObjects.forces.push(object)
    }

    generateJSON(){
        // const copy = Object.assign(Object.create(Object.getPrototypeOf(dclStructure)), dclStructure)
        const copy = this.clone()
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
            actual.childreanNodes.forEach( child => {
                if (!(discovered.includes(child))) {
                    discovered.push(child)
                    queue.push(child)
                }
            });
        }

        console.log("could not find element... returning null");
        return null;

    }

    getAllDecendents(root=this) {
        const queue = [];
        queue.push(root);

        const discovered = [];
        
        while (queue.length) {
            let actual = queue.shift();

            
            actual.childreanNodes.forEach( child => {
                if (!(discovered.includes(child))) {
                    discovered.push(child);
                    queue.push(child);
                }
            });
        }

        return discovered;
    }
    
}




// function joinNodes(parent, child) {
//     parent.addChild(child);
//     child.setParent(parent);
// }

// const n1 = new Node(null, 1)
// const n2 = new Node(null, 2)
// const n3 = new Node(null, 3)
// const n4 = new Node(null, 4)

// joinNodes(n1,n2)
// joinNodes(n2,n3)
// joinNodes(n3,n4)
// joinNodes(n1,n3)
// const l =[n1]
// console.log(l.includes(n1))

// console.log(n1.getAllDecendents(n2))


// console.log(n1.findNodeById(0))
// console.log(Date.now())

