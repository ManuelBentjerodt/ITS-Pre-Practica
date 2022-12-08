const l = [[1, 90], [2,  90]]
const i = [1,   901]






function idxForceInNode(nodeForces, myForce){
    for(let i = 0; i < nodeForces.length; i++){
        if(nodeForces[i][0] == myForce[0] && nodeForces[i][1] == myForce[1]){
            return i;
        }
    }
    console.log("index not found")
    return;
}

console.log(idxForceInNode(l, i))

    