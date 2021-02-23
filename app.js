const addTitle = document.getElementById("addTitle");
const addText = document.getElementById("addText");
const saveNoteButton = document.getElementById("save-button");

class NoteTemplate {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

saveNoteButton.addEventListener("click", function () {
  let notesArray = [];
  const alertDiv = document.getElementById("alert-user");
  const allNotes = localStorage.getItem("notes");
  if (allNotes === null) {
    notesArray = [];
  } else {
    notesArray = JSON.parse(allNotes);
  }
  let title = addTitle.value;
  let body = addText.value;

  const singleNote = new NoteTemplate(title, body);

  if (singleNote.title.length < 1 || singleNote.body.length < 1) {
    alertDiv.innerHTML = `<div class="alert alert-warning"  role="alert">
        Please enter a title and body texts both...
      </div>`;

    return;
  } else {
    alertDiv.innerHTML = "";
    notesArray.push(singleNote);

    localStorage.setItem("notes", JSON.stringify(notesArray));
    document.getElementById("display-notes").innerHTML = "";
    showNotes();
    addTitle.value = "";
    addText.value = "";
  }
});

const showNotes = () => {
  const notesDiv = document.getElementById("display-notes");
  let notesArray = [];

  const allNotes = localStorage.getItem("notes");
  if (allNotes === null) {
    notesArray = [];
  } else {
    notesArray = JSON.parse(allNotes);
    if (notesArray.length == 0) {
      document.getElementById("display-message").innerText =
        "No notes to display";
    } else {
      document.getElementById("display-message").innerText = "Your notes...";
    }
  }

  notesArray.map((element, index) => {
    notesDiv.innerHTML += `
<div class="single-card">
 <div class="col" style="max-height: 250px;overflow: scroll;scroll-behavior: smooth; overflow-x: auto">
          <div class="card text-dark bg-info">
            <div class="card-body">
              <h4 class="card-title text-center edit-content" onclick="contentEdit(this.id)"  onblur="editTitle(${index},this.id)" id="title${index}"> ${element.title}</h4>
             <hr/>
              <p class="card-text" style="text-align: justify" onclick="contentEdit(this.id)" onblur="editBody(${index},this.id)" id="body${index}">
                ${element.body}
              </p>
            </div>
          </div>
          <div class="d-flex justify-content-center">
         
        </div>
        
       
        </div>        
        <div class="d-flex justify-content-center position-relative">
      <button onclick="deleteNote(${index})" class="btn btn-warning mt-2 delete-btn">
        Delete note
      </button>
      <div id="confirm-delete${index}" style="position: absolute;
        width: auto;
        top: -30%;
        z-index: 1000;
        background: rgb(255, 238, 0, 0.8)"></div>
    </div>
        </div>
`;
  });
};

showNotes();

function contentEdit(id) {
  const content = document.getElementById(id);
  content.setAttribute("contenteditable", "true");
}

// const deleteNote = (index) => {
//   let notesArray = JSON.parse(localStorage.getItem("notes"));

//   notesArray.splice(index, 1);

//   localStorage.setItem("notes", JSON.stringify(notesArray));
//   document.getElementById("display-notes").innerHTML = "";

//   showNotes();
// };

const deleteNote = (index) => {
  deleteSingleNote(index);
  // showNotes();
};

function editTitle(index, id) {
  const content = document.getElementById(id);
  editText(index, id, "title");
  content.removeAttribute("contenteditable");
}

function editBody(index, id) {
  const content = document.getElementById(id);
  editText(index, id, "body");
  content.removeAttribute("contenteditable");
}

const editText = (index, id, toEdit) => {
  const changedText = document.getElementById(id).innerText;
  let notesArray = JSON.parse(localStorage.getItem("notes"));
  if (toEdit === "title") {
    notesArray[index].title = changedText;
  }
  if (toEdit === "body") {
    notesArray[index].body = changedText;
  }
  localStorage.setItem("notes", JSON.stringify(notesArray));
};

document.getElementById("search-btn").addEventListener("click", (e) => {
  const searchedKey = document
    .getElementById("searched-keyword")
    .value.toLowerCase();

  filterNotes(searchedKey);
  e.preventDefault();
});

function inputChange(event) {
  const searchedKey = event.target.value.toLowerCase();
  filterNotes(searchedKey);
}

const filterNotes = (searchedKey) => {
  const x = document.getElementsByClassName("single-card");

  for (let i = 0; i < x.length; i++) {
    const element = x[i];

    if (element.innerText.toLowerCase().includes(searchedKey)) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
};

function deleteSingleNote(index) {
  const confirmDiv = document.getElementById("confirm-delete" + index);
  confirmDiv.innerHTML = ` <p class="p-4">Are you sure to delete?</p>

      <div class="m-auto d-flex justify-content-between">
        <button class="btn btn-danger m-1" onclick="confirmDelete(true,${index})">
          Ok
        </button>
        <button class="btn btn-primary m-1" onclick="confirmDelete(false,${index})">
          Cancel
        </button>
      </div>`;

  disableAllDeleteButtons(true);
}

function confirmDelete(isTrue, index = 0) {
  const x = document.getElementById("confirm-delete" + index);

  if (isTrue) {
    let notesArray = JSON.parse(localStorage.getItem("notes"));

    notesArray.splice(index, 1);

    localStorage.setItem("notes", JSON.stringify(notesArray));
    document.getElementById("display-notes").innerHTML = "";

    x.innerHTML = "";
    showNotes();
    disableAllDeleteButtons(false);
  } else {
    x.innerHTML = "";
    disableAllDeleteButtons(false);
    return;
  }
}

const disableAllDeleteButtons = (isTrue) => {
  const deleteButtons = document.getElementsByClassName("delete-btn");
  if (isTrue) {
    for (let i = 0; i < deleteButtons.length; i++) {
      const element = deleteButtons[i];
      element.disabled = true;
    }
  } else {
    for (let i = 0; i < deleteButtons.length; i++) {
      const element = deleteButtons[i];
      element.disabled = false;
    }
  }
};
