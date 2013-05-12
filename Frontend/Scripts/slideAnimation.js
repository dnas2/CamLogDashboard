




function doAnimation() {
    var slides = new Array("totalQsos", "qsosByOp", "qsosByOp2", "qsosByOp3", "modeSplit", "news", "news2");
    // There are 7 slides, each is visible for 8 seconds, depending on the current number of seconds in the time
    var d = new Date();
    var n = d.getSeconds();
    debug = "It is " + n + " seconds";
    // Convert the current number of seconds to a slide:
    n = Math.floor(n / 8.57);
    // Hide the old slide
    var oldSlide = n - 1;
    if (oldSlide < 0) { oldSlide = 6; }
    debug += "\nRemoving slide " + oldSlide + "\nShowing slide " + n;
    $("#" + slides[oldSlide]).fadeOut("fast", function () {
        // show the new slide
        // Putting this as the complete action fro fadeOut ensures they can't overlap, which looks ugly
        $("#" + slides[n]).fadeIn("fast");
    });
    //alert(debug);
    var animationTimeout = setTimeout(doAnimation, 8570);
}