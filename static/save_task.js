function saveTask() {
    const dclForm = document.querySelector("#id_dcl");
    const dateForm = document.querySelector("#id_date");

    dclForm.value = dcl.generateJSON()
    dateForm.value = getDate()
}