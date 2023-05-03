function loadData()
{
    $.getJSON('data.js', function (data) {
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
    setTimeout(reloadData, 300000); // Reload every 5 mins = 300,000 ms
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
