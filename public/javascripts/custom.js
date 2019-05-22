// TODO: make this be not hardcoded garbage
let sm = [];
sm[1] = 4;
sm[2] = 5;
sm[3] = 6;

let custom = {
    spritemap: sm
};

let data = JSON.stringify(custom);

$.post("/data/customize",
    {
        id: 1,
        custom: data
    },
    function(data) {
        $("#container").html(data);
    });