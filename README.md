# ITS-Pre-Practica

Propuesta estructura DCL

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
}

