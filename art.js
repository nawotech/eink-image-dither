var canvas = document.getElementById("imageCanvas");
var previewCanvas = document.getElementById("previewCanvas");
var ctx = canvas.getContext('2d');
var ctxPreview = previewCanvas.getContext('2d');
var imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener('change', handleImage, false);
var zoom = document.getElementById("zoom");
var x = document.getElementById("x");
var y = document.getElementById("y");
var previewButton = document.getElementById("preview");
var downloadButton = document.getElementById("downloadImage");

var options = {
    "step": 1, // The step for the pixel quantization n = 1,2,3...
    // "palette": [[0, 0, 0], [255, 255, 255], [255, 0, 0]], // black, white and red
    "palette": [[0, 0, 0], [255, 255, 255]], // black ad white
    "algorithm": "atkinson" // one of ["ordered", "diffusion", "atkinson"]
};

var ditherjs = new DitherJS(options);

var currentZoom = 0;
var currentX = 0;
var currentY = 0;
var img;

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function redrawImage() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var w = img.width * currentZoom;
    var h = img.height * currentZoom;
    var x = -1 * (w * currentX);
    var y = -1 * (h * currentY);
    ctx.drawImage(img, x, y, w, h);
}

zoom.oninput = function () {
    currentZoom = this.value / 100.0;
    redrawImage();
}

x.oninput = function () {
    currentX = this.value / 100.0;
    redrawImage();
}

y.oninput = function () {
    currentY = this.value / 100.0;
    redrawImage();
}

function ditherImage() {
    var currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ditherjs.ditherImageData(currentImageData);
    // var newImageData = ctxPreview.createImageData(canvas.width, canvas.height);
    // newImageData.data.set(buffer);
    ctxPreview.putImageData(currentImageData, 0, 0);
}

previewButton.onclick = function () {
    ditherImage();
}

downloadButton.onclick = function () {
    var link = document.createElement('a');
    link.download = 'pic.png';
    link.href = previewCanvas.toDataURL();
    link.click();
}

