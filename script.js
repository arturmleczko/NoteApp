// Note.js
class Note {
    constructor(title, content, color = "") {
        this.title = title;
        this.content = content;
        this.color = color;
        this.date = new Date().toLocaleString();
    }
}


// Contents.js
class Contents {
    constructor() {
        this.title = undefined;
        this.content = undefined;
        this.color = undefined;

        const labels = document.querySelectorAll("label");

        labels.forEach(label => {
            label.addEventListener("click", this.getColor.bind(this));
        })
    }
    getTitle() {
        this.title = document.querySelector("#title").value;
    }

    getContent() {
        this.content = document.querySelector("#content").value;
    }

    getColor(e) {
        const label = e.target;
        const cssLabelProperties = window.getComputedStyle(label);
        this.color = cssLabelProperties.getPropertyValue("background-color");
    }

    clearContents() {
        document.querySelector("#title").value = "";
        document.querySelector("#content").value = "";
        this.color = "";
    }
}


// Memory.js
class Memory {
    constructor(notes) {
        this.lsKey = "notes";
        
        this.notes = notes;
        this.mappedNotes = [];
        this.notesFromLocalStorage = undefined;
    }

    writeLocalStorage(notes) {
        localStorage.setItem(this.lsKey, JSON.stringify(notes));
    }

    readLocalStorage() {
        this.notesFromLocalStorage = JSON.parse(localStorage.getItem(this.lsKey));
        
        if(this.notesFromLocalStorage !== null) {
            this.mappedNotes = this.notesFromLocalStorage.map(note => {
                return note;
            })
        }
    }

    checkMemory(contents, builder) {
        if (localStorage.length != 0) {
            this.readLocalStorage();
            for (const note of this.mappedNotes) {
                contents.color = note.color;
                contents.title = note.title;
                contents.content = note.content;
                builder.showNote(contents.color, note, contents.title, contents.content);
            }
        }

        this.mappedNotes.forEach(note => {
            this.notes.push(note);
        })
    }
}


// Builder.js
class Builder {
    constructor(importantNotes) {
        this.notesWrapper = document.querySelector(".readyNotes");
        this.notesWrapperWidth = 320;
        this.singleNote = undefined;

        this.importantNotes = importantNotes;

        this.removeNote = (e) => {
            const noteToRemove = e.currentTarget.parentNode;
            this.notesWrapper.removeChild(noteToRemove);
        }
    }

    createNote() {
        if (this.notesWrapperWidth <= 1280) {
            this.notesWrapper.style.width = this.notesWrapperWidth + "px";
            this.notesWrapperWidth += 320;
        }

        this.singleNote = document.createElement("div");
        this.singleNote.classList.add("note");
        this.notesWrapper.appendChild(this.singleNote);
    }

    addColor(color) {
        this.singleNote.style.backgroundColor = color;
    }

    addDate(note) {
        const htmlDate = document.createElement("p");
        htmlDate.textContent = note.date;
        this.singleNote.appendChild(htmlDate);
    }

    addTitle(title) {
        const htmlTitle = document.createElement("h3");
        htmlTitle.textContent = title;
        this.singleNote.appendChild(htmlTitle);
        
    }

    addContent(content) {
        const htmlContent = document.createElement("h4");
        htmlContent.textContent = content;
        this.singleNote.appendChild(htmlContent);
    }

    addThumbtack() {
        const htmlThumbtack = document.createElement("div");
        htmlThumbtack.innerHTML = `<i class="fas fa-thumbtack"></i>`;
        htmlThumbtack.classList.add("thumbtack");
        this.singleNote.appendChild(htmlThumbtack);
        htmlThumbtack.addEventListener("click", this.importantNotes.addImportantNote.bind(this.importantNotes));
    }

    addRemove() {
        const htmlRemove = document.createElement("div");
        htmlRemove.innerHTML = `<i class="fas fa-trash"></i>`;
        htmlRemove.classList.add("remove");
        this.singleNote.appendChild(htmlRemove);
        htmlRemove.addEventListener("click", this.removeNote);
    }

    showNote(color, note, title, content) {
        this.createNote();
        this.addColor(color);
        this.addDate(note);
        this.addTitle(title);
        this.addContent(content);
        this.addThumbtack();
        this.addRemove();
    }
}


// Notes.js
class Notes {
    constructor(contents, memory, builder, notes) {
        this.contents = contents;
        this.memory = memory;
        this.builder = builder;

        this.notes = notes;
        this.note = undefined;

        this.memory.checkMemory(this.contents, this.builder);

        const addBtn = document.querySelector("button");
        addBtn.addEventListener("click", this.addNote.bind(this));
    }

    addNote() {
        this.contents.getTitle();
        this.contents.getContent();

        this.note = new Note(this.contents.title, this.contents.content, this.contents.color);
        this.notes.push(this.note);
        this.memory.writeLocalStorage(this.notes);

        this.builder.showNote(this.contents.color, this.note, this.contents.title, this.contents.content);
        this.contents.clearContents();
    }
}


// BuilderForImportantNotes.js
class BuilderForImportantNotes extends Builder {
    constructor(singleNote) {
        super(singleNote);
        this.importantNotesWrapper = document.querySelector(".importantNotes");
        this.importantNotesWrapperWidth = 320;
    }
    
    createImportantNote() {
        if (this.importantNotesWrapperWidth <= 1280) {
            this.importantNotesWrapper.style.width = this.importantNotesWrapperWidth + "px";
            this.importantNotesWrapperWidth += 320;
        }

        this.singleNote = document.createElement("div");
        this.singleNote.classList.add("note");
        
        this.importantNotesWrapper.classList.add("clearfix");
        this.importantNotesWrapper.appendChild(this.singleNote);
    }

    addThumbtackForImportant() {
        const htmlThumbtack = document.createElement("div");
        htmlThumbtack.innerHTML = `<i class="fas fa-thumbtack"></i>`;
        htmlThumbtack.classList.add("thumbtackImp");
        this.singleNote.appendChild(htmlThumbtack);
    }

    showNoteForImportant(color, note, title, content) {
        this.createImportantNote();
        this.addColor(color);
        this.addDate(note);
        this.addTitle(title);
        this.addContent(content);
        this.addThumbtackForImportant();

        this.importantNotesWrapper.style.marginBottom = "50px";
    }
}


// ImportantNotes.js 
class ImportantNotes {
    constructor(notes) {
        this.notes = notes;
        this.importantNotes = [];

        this.builderForImpNot = new BuilderForImportantNotes();
    }
    
    addImportantNote(e) {
        const target = e.currentTarget.parentNode;
        const targetTitle = target.querySelector("p").textContent;
        const notesFromLocalStorage = JSON.parse(localStorage.getItem("notes"));
        let number;
        
        notesFromLocalStorage.forEach((note, index) => {
            if(note.date === targetTitle) {
                number = index;
            }
        })

        const importantElement = this.notes[number];
        this.importantNotes.push(importantElement);

        this.notesWrapper = document.querySelector(".readyNotes");
        const noteToRemove = e.currentTarget.parentNode;
        this.notesWrapper.removeChild(noteToRemove);

        const idxImpNote = this.importantNotes.indexOf(importantElement);
        const impNote = this.importantNotes[idxImpNote];

        this.builderForImpNot.showNoteForImportant(impNote.color, impNote, impNote.title, impNote.content);
    }
}


// App.js
class App {
    constructor(notes) {
        this.contents = new Contents();
        this.memory = new Memory(notes);
        this.importantNotes = new ImportantNotes(notes);
        this.builder = new Builder(this.importantNotes);
        this.notes = new Notes(this.contents, this.memory, this.builder, notes);
    }
}


window.onload = function() {
    const notes = [];
    const app = new App(notes);
}