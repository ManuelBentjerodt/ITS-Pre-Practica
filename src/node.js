class Node {
    constructor(_coordinate, id=Date.now()){
        this.id = id
        this.coordinate = _coordinate;  // array(x, y)
        this.parent = null;            // node
        
        this.childreanNodes = [],         // node
        this.vinculo = null,              // type = 'deslizante', 'empotrado', etc
        this.fuerzas = [],                // array(magnitud, angle)
        this.momentos = []                // magnitud   
        
        this.konvaObject = null;
    }

    setId(id){
        this.id = id
    }

    changeCoordinate(newCoordinate){
        this.coordinate = newCoordinate;
    }

    setParent(parentNode){
        this.parent = parentNode;
    }

    addChild(node){
        this.childreanNodes.push(node);
    }


    getChildren(){
        return this.childreanNodes
    }


    addVinculo(vinculo){
        const types = new Set(["deslizante", "noDeslizante", "empotrado", "rotula", "biela"]);
        if (vinculo in types){
            this.vinculo.push(vinculo);
        }
    }

    addFuerza(magnitud, angle){
        this.fuerzas.push((magnitud, angle));
    }

    addMomento(type, magnitud){
        if (type === "positivo"){
            this.momentos.positivos.push(magnitud);
        } else if (type === "negativo"){
            this.momentos.negativos.push(magnitud);
        }
    }

    setKonvaObject(object){
        this.konvaObject = object;
    }

    findNodeById(_id, root=this){
        const queue = [];
        queue.push(root);

        const discovered = [];
        discovered.push(root);

        while (queue.length){
            let actual = queue.shift();
            
            if (actual.id == _id){
                return actual;
            }
            actual.childreanNodes.forEach( child => {
                if (!(child in discovered)){
                    discovered.push(child)
                    queue.push(child)
                }
            });
        }






        console.log("could not find element... returning null");
        return null;

    }
    
}


class Viga {
    constructor(){
        this.parents = [];
    }

    setParents(node1, node2){
        this.parents = [node1, node2];
    }
}

// function joinNodes(parent, child){
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



// console.log(n1.findNodeById(0))
// console.log(Date.now())

