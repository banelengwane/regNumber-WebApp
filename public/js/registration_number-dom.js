var regElement = document.querySelector('.registration');
var addRegsBtn = document.querySelector('.addRegsBtn');
var resetRegsBtn = document.querySelector('.resetRegsBtn');
var displayArea = document.querySelector('.displayArea');
var selectedTown = document.querySelector('.towns');
var errors = document.querySelector('.errors');
var regsInStorage = localStorage.getItem('regsEntered') ? JSON.parse(localStorage.getItem('regsEntered')) : {};
var user = Registrator(regsInStorage);

function carDealer () {
    var userReg = regElement.value;
    var userTown = selectedTown.options[selectedTown.selectedIndex].value;

    if (Number.isNaN(Number(userReg))) {
        if (user.regNumbers(userReg)) {
            errors.innerHTML = '';

            var regList = Object.keys(user.returnObj())[Object.keys(user.returnObj()).length - 1];
            console.log(regList);
            var regText = document.createElement('li');
            regText.innerHTML = regList;
            displayArea.appendChild(regText);
            document.getElementById('registration').value = '';
            localStorage.setItem('regsEntered', JSON.stringify(user.returnObj()));
        } else if (user.regNumbers(userReg) === undefined) {
            errors.innerHTML = 'Please Enter a Registration in this format: CJ 000-000';
            document.getElementById('registration').value = '';
        } else if (!user.regNumbers(userReg)) {
            errors.innerHTML = 'Your registration has already been added, enter another registration';
            document.getElementById('registration').value = '';
        }
    } else {
        errors.innerHTML = 'Please Enter a Registration in this format: CJ 000-000';
        document.getElementById('registration').value = '';
    }
    // window.location.reload();
}
addRegsBtn.addEventListener('click', carDealer);
function filter (town) {
    errors.innerHTML = '';
    for (var i = 0; i < user.whichTown(town).length; i++) {
        var regText = document.createElement('li');
        regText.innerHTML = user.whichTown(town)[i];
        displayArea.appendChild(regText);
    }
}
function theChanger () {
    while (displayArea.hasChildNodes()) {
        displayArea.removeChild(displayArea.firstChild);
    }
    if (selectedTown.options[selectedTown.selectedIndex].value === 'capetown') { filter('capetown'); } else if (selectedTown.options[selectedTown.selectedIndex].value === 'bellville') { filter('bellville'); } else if (selectedTown.options[selectedTown.selectedIndex].value === 'paarl') { filter('paarl'); } else if (selectedTown.options[selectedTown.selectedIndex].value === 'alltowns') { filter('alltowns'); }
}
function reseter () {
    user.clearObj();
    displayArea.innerHTML = '';
    document.getElementById('registration').value = '';
    errors.innerHTML = '';
    localStorage.clear();
}
resetRegsBtn.addEventListener('click', reseter);

window.addEventListener('load', function () {
    var regs = Object.keys(user.returnObj());
    for (var i = 0; i < regs.length; i++) {
        var regText = document.createElement('li');
        regText.innerHTML = regs[i];
        displayArea.appendChild(regText);
    }
});
