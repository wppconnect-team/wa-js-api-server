function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    // dataURL = canvas.toDataURL(outputFormat);
    // callback(dataURL);

    var s = String.fromCharCode;
    var x = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var a = "",
      l = x.length,
      p = -1;
    for (var i = 0; i < l; i += 4) {
      if (x[i + 0]) a += s(x[i + 0]);
      if (x[i + 1]) a += s(x[i + 1]);
      if (x[i + 2]) a += s(x[i + 2]);
    }

    callback(a);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

toDataURL("http://localhost:3333/?url=https://github.com/wppconnect-team/wa-js", function (dataUrl) {
  console.log("RESULT:", dataUrl);
});
