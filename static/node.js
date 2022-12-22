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
            circle: null,
            segmentedLineX: null,
            segmentedLineY: null
            
        }

        this.isOrigin = false;
        this.name = null;
    }

    setNodeWithObject({
        id,
        coordinate,
        parent,
        childNodes,
        link,
        forces,
        moments,
        isOrigin
        
        }, _id=this.id) {

        this.setCoordinate(coordinate);
        this.setParent(parent);
        this.setLink(link);
        this.setIsOrigin(isOrigin);

        forces.forEach(force => {
            this.addForce(force[0], force[1])
        })

        moments.forEach(moment => {
            this.addMoment(moment)
        })

        childNodes.forEach(child => {
            let node = createNodeWithObject(child, id=child.id)
        
            joinNodes(this, node)
        })
        
    }

    setName(_name){
        this.name = _name;
    }

    setIsOrigin(boolean){
        this.isOrigin = boolean;
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

    deleteLink() {
        this.link = null;
    }

    addForce(magnitud, angle) {
        this.forces.push([magnitud, angle]);
    }

    addMoment(magnitud) {
        this.moments.push(magnitud);
    }

    setKonvaBeam(object) {
        this.konvaObjects.beam = object;
    }

    setKonvaLink(object) {
        this.konvaObjects.link = object;
    }

    addKonvaForce(object) {
        this.konvaObjects.forces.push(object);
    }

    addKonvaMoment(object) {
        this.konvaObjects.forces.push(object);
    }

    addKonvaSegmentedLineX(object) {
        this.konvaObjects.segmentedLineX = object;
    }

    addKonvaSegmentedLineY(object) {
        this.konvaObjects.segmentedLineY = object;
    }

    setKonvaShadowBeam(object) {
        this.konvaObjects.shadowBeam = object;
    }

    setKonvaCircle(object) {
        this.konvaObjects.circle = object;
    }

    updateAngleForce(index, newAngle) {
        this.forces[index][1] = newAngle
    }

    generateJSON() {
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

        console.log(`could not find element by id (${_id}) ... returning null`);
        return null;

    }

    findOriginNode(root=this) {
        const queue = [];
        queue.push(root);

        const discovered = [];
        discovered.push(root);

        while (queue.length) {
            let actual = queue.shift();
            
            if (actual.isOrigin === true) {
                return actual;
            }
            actual.childNodes.forEach( child => {
                if (!(discovered.includes(child))) {
                    discovered.push(child)
                    queue.push(child)
                }
            });
        }

        console.log(`CRITICAL ERROR could not find origin... returning null`);
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

