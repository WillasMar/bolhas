let runGame = function() {
    document.getElementById('startGameBtn').style.display = 'none';
    document.getElementById('theHeader').style.display = 'none';

    document.getElementById('credits').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    document.getElementById('creditBtn').style.display = 'none';
    anim();
};
let showCredits = function() {
    document.getElementById('theHeader').style.display = 'none';
    document.getElementById('creditBtn').style.display = 'none';
    document.getElementById('startGameBtn').style.display = 'none';

    document.getElementById('credits').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
};
let goBack = function() {
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('credits').style.display = 'none';

    document.getElementById('theHeader').style.display = 'block';
    document.getElementById('startGameBtn').style.display = 'block';
    document.getElementById('creditBtn').style.display = 'block';
};