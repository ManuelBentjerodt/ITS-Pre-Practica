const imagePreview = document.getElementById("imagePreview");

if (imagePreview.dataset.image == "None") {
    imagePreview.style.display = "none"

} else {
    imagePreview.style.display = "block";
    imagePreview.src = imagePreview.dataset.image;

}