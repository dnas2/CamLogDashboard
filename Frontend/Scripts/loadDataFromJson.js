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
                    countriesArray = ["algeria", "austria", "belgium", "bulgaria", "czech_republic", "croatia", "england", "estonia", "finland", "france", "germany", "hungary", "italy", "japan", "lithuania", "netherlands", "norway", "poland", "romania", "serbia", "slovak_republic", "south_africa", "spain", "sweden", "tunisia", "united_kingdom"];
		    var htmlOut = "";
		    flag1 = countriesArray[getRandomInt(0,25)];
		    flag2 = countriesArray[getRandomInt(0,25)];
		    flag3 = countriesArray[getRandomInt(0,25)];
		    flag4 = countriesArray[getRandomInt(0,25)];
		    flag5 = countriesArray[getRandomInt(0,25)];
		    htmlOut = "<p>&nbsp;</p>";
                    htmlOut += "<p align=\"center\"><img src=\"Photos/" + flag1 + ".png\" height=\"82px\" width=\"123px\" />&nbsp;<img src=\"Photos/" + flag2 + ".png\" height=\"82px\" width=\"123px\" />&nbsp;<img src=\"Photos/" + flag3 + ".png\" height=\"82px\" width=\"123px\" />&nbsp;<img src=\"Photos/" + flag4 + ".png\" height=\"82px\" width=\"123px\" />&nbsp;<img src=\"Photos/" + flag5 + ".png\" height=\"82px\" width=\"123px\" /></p>";
		    htmlOut += "<p align=\"center\">How has your country done? Find out later...</p>";
		    phrases = ["Well done!", "Keep it up!", "Doing good!", "Great work!", "Top operators", "Brilliant effort!", "Sterling operation!", "Not long to go!", "More QSOs needed!", "You can do it!", "Valiant effort!", "Doing well!"];
		    htmlOut += "<p align=\"center\">" + phrases[getRandomInt(0,11)] + "</p>";
                    $("#qsosByOpTable").html(htmlOut);
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

                
		case "bands":
                    var htmlOut = "";
                    $.each(typeData, function (band, percent) {
                        histWidth = getHistogramWidth(100, percent);
                        htmlOut += "<tr><td>" + band + "</td>";
                        htmlOut += "<td class=\"histogram\"><img src=\"CSS/bar.png\" style=\"height:82px; width:" + histWidth + "px;\" /></td>";
                        htmlOut += "<td class=\"variable\">" + percent + "%</td></tr>";
                    });
                    $("#bandSplitTable").html(htmlOut);
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}