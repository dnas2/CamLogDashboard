function plotLocator(ctx, locator) {
    locator = locator.toUpperCase();
    const canvasWidth = 1280;
    const canvasHeight = 640;
    let fieldLong = locator.charCodeAt(0) - 65;
    let fieldLat = locator.charCodeAt(1) - 65;
    let squareLong = locator.charCodeAt(2) - 48;
    let squareLat = locator.charCodeAt(3) - 48;
    let subLong = 0, subLat = 0;
    if (locator.length > 4)
    {
        subLong = locator.charCodeAt(4) - 65;
        subLat = locator.charCodeAt(5) - 65;
    }

    let latitude = (fieldLat * 10) + squareLat + (subLat / 24) - 90;
    let longitude = (fieldLong * 20) + squareLong * 2 + (subLong / 12) - 180;

    let x = (canvasWidth / 2) + (canvasWidth * longitude / 360);
    let y = (canvasHeight / 2) - (canvasHeight * latitude / 180);
    ctx.beginPath();
    ctx.arc(x,y,3,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function loadData()
{
    $.getJSON('http://server/dashboardDataApi.php', function (data) {
        var c = document.getElementById("qsoCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0,0,1280,640);
        var basemap = document.getElementById("baseMap");
        ctx.beginPath();
        ctx.drawImage(basemap, 0,0);
        ctx.fillStyle = 'red';

        $.each(data, function (type, typeData) {
            // Switch on the type of data
            switch (type) {
                case "frequencies":
                    var htmlOut = "";
                    $.each(typeData, function (station, freq) {
                        if (freq == null) { freq = "<span class=\"gray\">(No recent QSOs)</span>"; }
                        else { freq = freq.toFixed(3); }
                        htmlOut += "<span class=\"station\">" + station + ":&nbsp;<span class=\"variable\">" + freq + "</span></span> ";
                    });
                    $("#currentFrequencyTable").html(htmlOut);
                    break;

                case "totals":
                    $.each(typeData, function (key, val) {
                        $("#" + key).html(val); // Cunningly, the spans/divs in the HTML have the same names as the keys in the Json the correspond to :)
                    });
                    break;

                case "topOps":
                    var htmlOut = "";
                    i = 1; // Counts the number of ops. 5 per slide max
                    $.each(typeData, function (opCall, qsos) {
                        if (i == 6) {
                            $("#qsosByOpTable").html(htmlOut);
                            htmlOut = "";
                        }
                        else if (i == 11) {
                            $("#qsosByOpTable2").html(htmlOut);
                            htmlOut = "";
                        }
                        histWidth = getHistogramWidth(1500, qsos);
                        htmlOut += "<tr><td class=\"opPhoto\"><img src=\"Photos/" + opCall.toLowerCase() + ".jpg\" height=\"82px\" /><div class=\"photoCall\">" + opCall + "</div></td>";
                        htmlOut += "<td class=\"histogram\"><img src=\"CSS/bar.png\" style=\"height:82px; width:" + histWidth + "px;\" /></td>";
                        htmlOut += "<td class=\"variable\">" + qsos + "</td></tr>";
                        i = i + 1;
                    });
                    $("#qsosByOpTable3").html(htmlOut);
                    break;

                case "modes":
                    var htmlOut = "";
                    $.each(typeData, function (mode, percent) {
                        histWidth = getHistogramWidth(100, percent);
                        htmlOut += "<tr><td>" + mode + "</td>";
                        htmlOut += "<td class=\"histogram\"><img src=\"CSS/bar.png\" style=\"height:82px; width:" + histWidth + "px;\" /></td>";
                        htmlOut += "<td class=\"variable\">" + percent + "%</td></tr>";
                    });
                    $("#modeSplitTable").html(htmlOut);
                    break;

                case "dxccs":
                    var htmlOut = "";
                    $.each(typeData, function (dxcc, percent) {
                        histWidth = getHistogramWidth(100, percent);
                        htmlOut += "<tr><td>" + dxcc + "</td>";
                        htmlOut += "<td class=\"histogram\"><img src=\"CSS/bar.png\" style=\"height:82px; width:" + histWidth + "px;\" /></td>";
                        htmlOut += "<td class=\"variable\">" + percent + "%</td></tr>";
                    });
                    $("#topDxccsTable").html(htmlOut);
                    break;
                case "lastLocators":
                    typeData.forEach(function(loc) {
                        plotLocator(ctx, loc);
                    });
                    break;
                case "meta":
                    $.each(typeData, function (key, value) {
                        if (key == "created") {
                            $(".dataDelay").html("Last updated: " + value);
                        }
                    });
                    break;


                default:
                    // Do nothing (unknown data type in Json)
            }
        });
    });

    $("#newsText").load("news.html");
    $("#news2Text").load("news2.html");
    setTimeout(reloadData, 60000); // Reload every 1 mins = 60,000 ms
}



function reloadData() {
    $("#spinny").show();
    if (typeof(animationTimeout) != "undefined") {
        clearTimeout(animationTimeout);
    }
    loadData();
    $("#spinny").hide();
    doAnimation();
}

function getHistogramWidth(maxExpected, currentValue) {
    if (currentValue > maxExpected) { currentValue = maxExpected; } // Ensures the length of the bar can't overflow!
    maxPermitted = 500; // No bar can be more than 500 px long
    ratio = maxPermitted / maxExpected;
    return Math.floor(currentValue * ratio);
}
