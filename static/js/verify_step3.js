const button = document.querySelector("#verifyButton")
button.addEventListener("click", verifyTask);
function verifyTask() {
    // const taskId = this.dataset.taskid;
    //const studentJSON = dcl.generateCopy();
    const href = window.location.href;
    const csfrToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    const copyDCL = getCopyDcl(dcl);
    const data = JSON.stringify({
        "studentDcl": copyDCL,
    })
    
    fetch(`${href}`, {
        method: "POST",
        headers: {
            "Content-Type": "verify/json",
            "X-CSRFToken": csfrToken
        },
        body: data
    })
    .then((response) => {
        return response.json()
        
    })
    .then((data) => {
        console.log(data)
        //window.location.href = data.redirect
    })
}   