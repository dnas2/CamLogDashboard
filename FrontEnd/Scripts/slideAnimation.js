




function doAnimation() {
    var slides = new Array("currentFrequencies", "totalQsos", "qsosByOp", "modeSplit", "news");
    // There are five slides, each is visible for 12 seconds, depending on the current number of seconds in the time
    var d = new Date();
    var n = d.getSeconds();
    // Convert the current number of seconds to a slide:
    n = Math.floor(n / 12);
    // Hide the old slide
    var oldSlide = n - 1;
    if (oldSlide < 0) { oldSlide = 4; }
    $("#" + slides[oldSlide]).fadeOut("fast", function () {
        // show the new slide
        // Putting this as the complete action fro fadeOut ensures they can't overlap, which looks ugly
        $("#" + slides[n]).fadeIn("fast");
    });
    
    var animationTimeout = setTimeout(doAnimation, 12000);
}