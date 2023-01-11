const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const clearImage = document.getElementById("clearImage");

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        }
        reader.readAsDataURL(file);
    }
});

clearImage.addEventListener("click", function () {
    imagePreview.src = "";
    imagePreview.style.display = "none";
    imageInput.value = "";
});
