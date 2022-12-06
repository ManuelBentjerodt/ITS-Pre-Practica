class Node {
    constructor(_coordinate){
        this.coordinate = _coordinate;
        this.parent = false;
        this.attached = {
            childreanNodes: [],
            apoyosDeslizantes: [],
            apoyosNoDeslizantes: [],
            empotrados: [],
            rotulas: [],
            bielas: [],
            fuerzas: [],
            momentos: {
                positivos: [],
                negativos: []
            }
        }
    }

    changeCoordinate(newCoordinate){
        this.coordinate = newCoordinate;
    }

    addParent(parentNode){
        this.parent = parentNode;
    }

    addChildNode(node){
        this.attached.childreanNodes.push(node)
    }

    addApoyoDeslizante(coordinate){
        this.attached.apoyosDeslizantes.push(coordinate)
    }

    addApoyoNoDeslizante(coordinate){
        this.attached.apoyosNoDeslizantes.push(coordinate)
    }

    addEmpotrado(coordinate){
        this.attached.empotrados.push(coordinate)
    }

    addRotula(coordinate){
        this.attached.rotulas.push(coordinate)
    }

    addBiela(coordinate){
        this.attached.bielas.push(coordinate)
    }

    addFuerza(magnitude, angle){
        this.attached.fuerzas.push((magnitude, angle))
    }

    addMomento(type, magnitud){
        if (type === "positivo"){
            this.attached.momentos.positivos.push(magnitud)
        } else if (type === "negativo"){
            this.attached.momentos.negativos.push(magnitud)
        }
    }

}

