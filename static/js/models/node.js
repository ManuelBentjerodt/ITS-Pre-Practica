class Node {
    constructor(_coordinate, id=Date.now()) {
        this.id = id
        this.coordinate = _coordinate;  // array(x, y)
        this.parent = null;            // node
        
        this.childNodes = [],         // node
        this.link = null,              // type = 'deslizante', 'fixedSupport', etc
        this.forces = [],                // array(magnitud, angle, type)
        this.moments = [],                // magnitud   

        this.konvaObjects = {
            beam: null,
            shadowBeam: null,
            link: null,
            forces: [],
            moments: [],
            circle: null,

            forceXsupport: null,
            forceYsupport: null,
            momentSupport: null
            
        }

        this.linkRotation = null

        this.isOrigin = false;
        this.name = null;

        this.turnedToRealDCL = false;
    }

    setNodeWithObject({
        id,
        coordinate,
        parent,
        childNodes,
        link,
        forces,
        moments,
        isOrigin,
        linkRotation,
        }, _id=this.id, setChilds=true) {

        
        this.setCoordinate(coordinate);
        this.setParent(parent);
        this.setLink(link);
        this.setIsOrigin(isOrigin);
        this.setLinkRotation(linkRotation);

        forces.forEach(force => {
            this.addForce(force[0], force[1],force[2])
        })

        moments.forEach(moment => {
            this.addMoment(moment[0], moment[1])
        })

            if (setChilds) {
            childNodes.forEach(child => {
                let node = createNodeWithObject(child, id=child.id)
            
                joinNodes(this, node)
            })
        }
        
    }

    setTurnedToRealDCL(boolean) {
        this.turnedToRealDCL = boolean;
    }

    setLinkRotation(rotation) {
        this.linkRotation = rotation;
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

    addForce(magnitud, angle, type) {
        this.forces.push([magnitud, angle,type]);
    }


    addMoment(magnitud, type) {
        this.moments.push([magnitud, type]);
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

    setKonvaShadowBeam(object) {
        this.konvaObjects.shadowBeam = object;
    }

    setKonvaCircle(object) {
        this.konvaObjects.circle = object;
    }

    setKonvaForceXsupport(object) {
        this.konvaObjects.forceXsupport = object;
    }

    setKonvaForceYsupport(object) { 
        this.konvaObjects.forceYsupport = object;
    }

    setKonvaMomentSupport(object) {
        this.konvaObjects.momentSupport = object;
    }

    updateAngleForce(index, newAngle) {
        this.forces[index][1] = newAngle
    }

    generateCopy() {
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        copy.getAllDecendents().forEach(descendent => {
            removeAttributesForJSON(descendent);
        });
        removeAttributesForJSON(copy);
        return copy;
    }


    generateJSON() {
        const copy = this.generateCopy();
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

    getCopy(root=this) {
        const queue = [];
        let copy = Object.assign(Object.create(Object.getPrototypeOf(root)), root)
        queue.push(copy);


        const discovered = [];

        while (queue.length) {
            let actual = queue.shift();

            
            actual.childNodes.forEach( child => {
                if (!(discovered.includes(child))) {
                    discovered.push(child);
                    queue.push(child);
                    actual.childNodes[actual.childNodes.indexOf(child)] = Object.assign(Object.create(Object.getPrototypeOf(child)), child);
                    delete actual.parent;
                    delete actual.konvaObjects;
                    delete actual.turnedToRealDCL;
                    delete actual.id;
                    delete actual.name;
                }
            });
        }

        return copy;
    }

    algo(node){
        for (let i = 0; i < node.childNodes.length; i++) {
            const inside_copy = Object.assign(Object.create(Object.getPrototypeOf(node.childNodes[i])), node.childNodes[i]);
            console.log("inside_copy", inside_copy);
            delete inside_copy.parent;
            delete inside_copy.konvaObjects;
            delete inside_copy.turnedToRealDCL;
            delete inside_copy.id;
            delete inside_copy.name;
            node.childNodes[i] = inside_copy;
            console.log("hijos:: ",node.childNodes);
            this.algo(inside_copy);
     }
    }

    getCopy2(root=this) {
        let copy = Object.assign(Object.create(Object.getPrototypeOf(root)), root);
        delete copy.parent;
        delete copy.konvaObjects;
        delete copy.turnedToRealDCL;
        delete copy.id;
        delete copy.name;
        this.algo(copy);
        
        return copy;
    }




}

