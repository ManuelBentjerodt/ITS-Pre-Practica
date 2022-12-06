class Node {
    constructor(_coordinate){

        this.coordinate = _coordinate;  // array(x, y)
        this.parent = false;            // node
        this.attached = {
            childreanNodes: [],         // node
            vinculo: null,              // type: 'deslizante', 'empotrado', etc
            fuerzas: [],                // array(magnitud, angle)
            momentos: []                // magnitud   
        }
    }

    changeCoordinate(newCoordinate){
        this.coordinate = newCoordinate;
    }

    putParent(parentNode){
        this.parent = parentNode;
    }

    addChildNode(node){
        this.attached.childreanNodes.push(node);
    }


    addVinculo(vinculo){
        const types = new Set(["deslizante", "noDeslizante", "empotrado", "rotula", "biela"]);
        if (vinculo in types){
            this.attached.vinculo.push(vinculo);
        }
    }

    addFuerza(magnitude, angle){
        this.attached.fuerzas.push((magnitude, angle));
    }

    addMomento(type, magnitud){
        if (type === "positivo"){
            this.attached.momentos.positivos.push(magnitud);
        } else if (type === "negativo"){
            this.attached.momentos.negativos.push(magnitud);
        }
    }

}

