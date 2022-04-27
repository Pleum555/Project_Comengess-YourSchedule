let pop = document.getElementById("popup")
let edit = document.getElementById('edit_popup')

function openPopup() {
    pop.classList.add("open-popup");

}
function closePopup() {
    pop.classList.remove("open-popup")
    document.getElementById('subject').value = ''
    document.getElementById('description').value = ''
}

function openEditPopup(id) {
    edit.classList.add("edit_open-popup");
    document.getElementById('edit_date').value = (document.getElementById('date' + id).innerHTML).trim()
    document.getElementById('edit_subject').value = document.getElementById('subject' + id).innerHTML.trim()
    document.getElementById('edit_description').value = document.getElementById('description' + id).innerHTML.trim()
    document.getElementById('edit_id').value = id
}

function closeEditPopup() {
    edit.classList.remove("edit_open-popup")
}

function hiddenButton(e) {
    let list = document.getElementById('showandhide');
    if (e.name === 'menu-outline') {
        list.classList.add('onlyshow')
        e.name = 'close-outline'
    } else {
        list.classList.remove('onlyshow')
        e.name = 'menu-outline'
    }
}