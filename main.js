const form = document.querySelector('#form');
const commInput = document.querySelector('#commInput');
const commDate = document.querySelector('#commDate');
const commBody = document.querySelector('#commTextarea');
const commList = document.querySelector('#commList');
const emptyList = document.querySelector('#emptyList');



let comms = [];

if (localStorage.getItem('comms')) {
    comms = JSON.parse(localStorage.getItem('comms'));
}

comms.forEach(function (comm) {
    const cssClass = comm.done ? "btn-like btn-like--ective" : "btn-like";

    const commHTML = `
    <li class="list-item" id="${comm.id}">
    <div class="comm-info">
    <span class="text-name">${comm.text}</span>
    <span class="text-body">${comm.body}</span>
    <span class="text-date">${checkEmptyDate(comm.dateInput)}</span>
    <span class="text-time">${moment(new Date()).calendar()}</span>
    </div>
    <div class="comm__buttons">
    <div>
        <button type="button" data-action="like"><i class="${cssClass} fa-solid fa-heart"></i></button>
    </div>
        <button type="button" data-action="delete"><i class="fa-solid fa-trash"></i></button>
    </div>
    </li>`;
    commList.insertAdjacentHTML('beforeend', commHTML);
})

checkEmptyList();



form.addEventListener('submit', addComm);
form.addEventListener('submit', function(e) {
    if (e.keyCode === 13) {
        addComm()
    }
  });
commList.addEventListener('click', deleteComm);
commList.addEventListener('click', likeComm);

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function addComm(event) {
    event.preventDefault();

    const commText = commInput.value
    const commBody = commTextarea.value
    const commDates = commDate.value

    
    

    const newComm = {
        id: Date.now(),
        text: commText,
        body: commBody,
        dateInput: commDates,
        done: false,
    }


    comms.push(newComm);

    saveToLocalStorage();

    const cssClass = newComm.done ? "btn-like btn-like--ective" : "btn-like";

    const commHTML = `
    <li class="list-item" id="${newComm.id}">
    <div class="comm-info">
    <span class="text-name">${newComm.text}</span>
    <span class="text-body">${newComm.body}</span>
    <span class="text-date"><em>${checkEmptyDate(newComm.dateInput)}</em></span>
    <span class="text-time"><em>${moment(new Date()).calendar()}</em></span>
    </div>
    <div class="comm__buttons">
    <div class="">
        <button type="button" data-action="like"><i class="${cssClass} fa-solid fa-heart"></i></button>
    </div>
        <button type="button" data-action="delete"><i class="fa-solid fa-trash"></i></button>
    </div>
    </li>`;

    commList.insertAdjacentHTML('beforeend', commHTML);

    commInput.value = "";
    commTextarea.value = "";
    commDate.value = "";
    commInput.focus();


    checkEmptyList();
}


function deleteComm(event) {
    if (event.target.dataset.action !== 'delete') return;


    const parentNode = event.target.closest('li');

    const id = parentNode.id

    const index = comms.findIndex((comm) => comm.id == id);

    comms.splice(index, 1);

    saveToLocalStorage();

    parentNode.remove();

    checkEmptyList()
}

function likeComm(event) {
    if (event.target.dataset.action !== 'like') return;

    const parentNode = event.target.closest('li');

    const id = parentNode.id;
    const comm = comms.find((comm) => comm.id == id);
    comm.done = !comm.done;

    saveToLocalStorage();

    const commTitle = parentNode.querySelector('.btn-like');
    commTitle.classList.toggle('btn-like--ective');
}

function checkEmptyList() {
    if (comms.length == 0) {
        const emptyListHTML = `
        <li id="emptyList">
            <div class="empty">no comments</div>
        </li>`;
        commList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (comms.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function checkEmptyDate(commDate) {
    if (commDate == 0) {
       return commDate = new Date().toLocaleDateString('ru-RU')
    } else{
        return commDate
    }
}



function saveToLocalStorage() {
    localStorage.setItem('comms', JSON.stringify(comms))
}