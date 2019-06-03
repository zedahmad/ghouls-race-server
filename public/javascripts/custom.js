// TODO: make this be not hardcoded garbage
let sm = [];
sm[1] = 5;
sm[2] = 5;
sm[3] = 5;

let custom = {
    spritemap: sm
};

let data = JSON.stringify(custom);

$.post("/data/customize",
    {
        id: 26,
        custom: data
    },
    function(data) {
        $("#container").html(data);
    });