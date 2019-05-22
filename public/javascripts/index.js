setInterval(function () {
    $.post("/data", function(data) {
        // data is array of player states
        let players = new Map(data);
        let div = $("<div>");
        let ol = $('<ol>');
        div.append(ol);
        for ([key, player] of players) {
            let ul = $("<ul>");
            ol.append($("<li>").html(ul));
            for (prop in player) {
                ul.append("<li>" + prop + ": " + player[prop] + "</li>");
            }
        }

        $("#container").html(div);
    }, "json");
}, 50);