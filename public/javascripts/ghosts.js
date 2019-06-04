let data = [];
let ghosts = new Set();

// TODO: calc refresh from tickrate in GhoulsServer object rather than setting separately OR make configurable by client?
const refresh = 33.333; // client refresh/animation interpolation time in ms
const sprites = new Map();
sprites.set(1, {
    src: "images/nakedrun.gif",
    offset: {x: 0, y: 2}
});
sprites.set(2, {
    src: "images/steelrun.gif",
    offset: {x: 0, y: 2}
});
sprites.set(3, {
    src: "images/goldrun.gif",
    offset: {x: 0, y: 2}
});
sprites.set(4, {
    src: "images/oldrun.gif",
    offset: {x: 0, y: 8}
});
sprites.set(5, {
    src: "images/prinrun.gif",
    offset: {x: 0, y: 4}
});
sprites.set(6, {
    src: "images/duckrun.gif",
    offset: {x: 0, y: 15}
});

// Stolen from the internet, don't blame me if it sucks please
function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

const id = Number.parseInt(getUrlVars()["id"]);

let loop = setInterval(function () {
    $.post("/data", function(data) {
        let container = $("#container");

        if (data === undefined || data.length === 0) {
            console.log(`There are no players connected to the server.`);
            container.append(`<p>There are no players connected to the server.</p>`);
            clearInterval(loop);
            return;
        }

        // data is a map of player id -> player state
        let players = new Map(data);

        if (!players.get(id)) {
            clearInterval(loop);
            console.log(`Player with ID ${id} does not exist`);
            container.append(`<p>Player with ID ${id} does not exist.</p>`);
            return;
        }

        let cam = {
            x: players.get(id).xcam,
            y: players.get(id).ycam
        };

        let disconnectedGhosts = new Set(ghosts);

        for (let [key, player] of players) {
            if (key === id) continue; // Skip perspective player

            // Ghost object selectors
            let ghostimg = $(`#ghost-${key}-img`);
            let ghostlabel = $(`#ghost-${key}-label`);

            // Create ghost objects if they don't yet exist
            if (!ghosts.has(key)) {
                ghostimg = $(`<img id="ghost-${key}-img" class="ghost">`);
                ghostlabel = $(`<span id="ghost-${key}-label" class="ghostlabel">${player.playername}</span>`);
                ghosts.add(key);
                container.append(ghostimg).append(ghostlabel);
            } else {
                disconnectedGhosts.delete(key);
            }

            // Only show/update ghosts if players are on the same loop and stage
            if (!(player.stage === players.get(id).stage && player.loop === players.get(id).loop)) {
                ghostimg.css({visibility: "hidden"});
                ghostlabel.css({visibility: "hidden"});
            } else {
                ghostimg.css({visibility: "visible"});
                ghostlabel.css({visibility: "visible"});

                // Update label text
                ghostlabel.text(player.playername);

                let sprite;

                if (player.spritemap !== undefined) {
                    sprite = sprites.get(player.spritemap[player.armor]);
                } else {
                    sprite = sprites.get(player.armor);
                }

                // Update ghost sprite
                if (ghostimg.attr("src") !== sprite.src) {
                    ghostimg.attr("src", sprite.src);
                }

                // Rotate sprites if they are moving left
                // TODO: upgrade this with in-game sprite data or inputs instead of using x position?  Not sure if necessary
                // Previous x position stored as a data-attribute - not reliable to pull from CSS because of the interpolated animation
                if (ghostimg.data('x') > player.xpos) {
                    ghostimg.css({transform: "scaleX(-1)"});
                } else if (ghostimg.data('x') < player.xpos) {
                    ghostimg.css({transform: "scaleX(1)"});
                }
                ghostimg.data('x', player.xpos);

                // Animate ghost with interpolation
                let x = player.xpos - cam.x + sprite.offset.x - ghostimg.width()/2;
                let y = 224 - (player.ypos - cam.y) + sprite.offset.y;
                ghostimg.stop().animate({left: x, top: y}, refresh, "linear");
                ghostlabel.stop().animate({left: x + (ghostimg.width() / 2), top: (y - (ghostimg.height()/2+4))}, refresh, "linear");
            }
        }

        // Cull disconnected ghost objects
        for (let key of disconnectedGhosts) {
            $(`#ghost-${key}-img`).remove();
            $(`#ghost-${key}-label`).remove();
        }

    }, "json");
}, refresh);