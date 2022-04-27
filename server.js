
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBOJGge9auS75ChDdUFJd1iVusi3H9MMtI",
    authDomain: "com-eng-ess-45425.firebaseapp.com",
    projectId: "com-eng-ess-45425",
    storageBucket: "com-eng-ess-45425.appspot.com",
    messagingSenderId: "150713748088",
    appId: "1:150713748088:web:d9c53308de32809bce7b8d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
    orderBy,
    query,
    where
} from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js';

const db = getFirestore()
var items_ref = collection(db, 'Schedule')
var filter = 'all'
const items_list = query(items_ref, orderBy('date'))


window.addItem = addItem

async function addItem(){
    const date = document.getElementById('date').value
    const subject = document.getElementById('subject').value
    const description = document.getElementById('description').value
    var today = new Date().getTime();
    var dueDate= new Date(date).getTime();
    var state = ''
    if(today > dueDate){
        state = "Missed"
    }
    else{
        state = "No submitted"
    }
    await addDoc(items_ref, {
        date: date,
        description : description,
        state : state,
        subject : subject,
    });
    closePopup()
}

async function waitforadd(){
    addItem().then(updateItem())
}

window.waitforadd = waitforadd;

async function showItemsInTable() {
    const table_body = document.getElementById('table')
    table_body.innerHTML = ''
    var filtered_list = items_list;
    const today = new Date();
    var month = today.getMonth()+1;
    var day = today.getDate();
    if(day < 10){
        day = "0" + day;
    }
    if(month < 10){
        month = "0" + month
    }
    var date = today.getFullYear()+'-'+month+'-'+day;
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date+'T'+time;
    if(filter != 'all'){
        if(filter != 'Missed'){
            filtered_list = query(items_ref ,where('date','>', dateTime), orderBy('date'));
            // filtered_list = query(tmp_list, orderBy('date'))
        }
        else{
            filtered_list = query(items_ref ,where('date','<=', dateTime), orderBy('date'));
        }
    }
    const collection = await getDocs(filtered_list)
    const items = collection.docs
     
    items.map((item) => {
        var buttoncolor;
        if(!item.data().state.localeCompare("Missed")){
            buttoncolor = "btn btn-2 color-2";
        }else if(!item.data().state.localeCompare("No submitted")){
            buttoncolor = "btn btn-3 color-3";
        }else{
            buttoncolor = "btn btn-5 color-4";
        }
        table_body.innerHTML += `
        <div class="flex flex-col mt-5" style="border: 1px solid black; border-radius: 1rem;background-color: #f9f9f8; padding: 1rem;">
            <div class="flex-special mt-5">
                <div id = "date${item.id}" class="text-center w1" style="padding-left: 2%;padding-right: 2%;height: 100%;">
                    ${item.data().date}
                </div>
                <div id = "subject${item.id}" class="text-center w2 mt-special-detail" style="padding-left: 2%;padding-right: 2%;">
                    ${item.data().subject}
                </div>
                <div id = "description${item.id}" class="text-center w3 mt-special-detail" style="padding-left: 2%;padding-right: 2%;">
                    ${item.data().description}
                </div>
            </div>
            <div class="flex-special mt-10" id="task" style="padding-bottom: 1.5rem;">
                <div class="flex flex-row">
                    <div>
                        <button class="btn btn-4 color-5 mr-2" onclick ="openEditPopup('${item.id}')">edit</button>
                    </div>
                    <div class="">
                        <button class="btn btn-2 color-2" onclick ="deleteItem('${item.id}')">delete</button>
                    </div>
                </div>
                <div class="mt-special">
                    <button class='${buttoncolor}' onclick ="changeState('${item.id}')">${item.data().state}</button>
                </div>
            </div>
        </div>
        `
    });
}

async function updateItem() {
    const collection = await getDocs(items_list)
    const items = collection.docs
    items.map(async(item) => {
        var today = new Date().getTime();
        var dueDate= new Date(item.data().date).getTime();
        const docref = await doc(db, 'Schedule', item.id)
        if(today > dueDate){
            const status = "Missed"
            const updateState = await updateDoc(docref, {
                state: status
            });
        }
        else{
            if(item.data().state == 'Missed'){
                const updateState = await updateDoc(docref, {
                    state: 'No submitted'
                });
            }
        }
    });
    showItemsInTable();
}

window.update = updateItem

async function deleteItem(docId) {
    const docRef = doc(db, `Schedule/${docId}`);
    await deleteDoc(docRef);
    updateItem();
}

document.addEventListener("DOMContentLoaded", function(event) {
    updateItem();
});

window.deleteItem = deleteItem;

function changeFilter(newFill){
    filter = newFill
    updateItem()
}

window.changeFilter = changeFilter

async function editItem(){
    const id = document.getElementById('edit_id').value
    const newDate = document.getElementById('edit_date').value
    const newSubject = document.getElementById('edit_subject').value
    const newDescription = document.getElementById('edit_description').value
    const docref = await doc(db, 'Schedule', id)
    const updateState = await updateDoc(docref, {
        date : newDate,
        subject : newSubject,
        description : newDescription
    });
    updateItem();
    closeEditPopup()
}

window.editItem = editItem

async function changeState(id){
    const docref = await doc(db, 'Schedule', id)
    const tmpdoc = await getDoc(docref)
    const curState = tmpdoc.data().state
    if(curState.localeCompare("Missed")){
        var status = ''
        if(curState.localeCompare('No submitted')){
            status = 'No submitted'
            const updateState = await updateDoc(docref, {
                state : status
            });
            updateItem();
        }
        else{
            status = 'Submitted'
            const updateState = await updateDoc(docref, {
                state : status
            });
            updateItem();
        }
    }
}
window.changeState = changeState
