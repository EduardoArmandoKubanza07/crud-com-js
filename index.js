const containerModal = document.querySelector(".container-modal");
const contentModal = document.querySelector(".content-modal");
const openModal = document.querySelector(".container .home button");
const closeModal = document.querySelector(".close-modal");

// Abertura e fechamento do modal
const toggleModal = () => {
    containerModal.classList.toggle("hide");
    contentModal.classList.toggle("hide");
}

openModal.addEventListener("click", toggleModal);
closeModal.addEventListener("click", toggleModal);

// Troca de páginas 
const pages = document.querySelectorAll(".pages");
let index = 0;

const changePage = page => {
    if(page !== index) {
        pages[index].style.display = "none";
        pages[page].style.display = "block";
        index = page;
    }
}

// Habilitar e desabilitar botão
const addBtn = document.querySelector(".add-btn");
const description = document.querySelector(".description");
const _name = document.querySelector(".name");

const verifyButton = () => {
    if(description.value.trim() && _name.value.trim()) {
        addBtn.disabled = false;

    } else {
        addBtn.disabled = true;
    }
} 

description.addEventListener("input", verifyButton);
_name.addEventListener("input", verifyButton);

// Cria  , editar , deletar , renderizar tarefa

var allTodos = JSON.parse(localStorage.getItem("allTodos")) ?? [] ;
var todoList = document.querySelector(".todos .todo-list ul");
const createTodoBtn = document.querySelector(".add-btn");

createTodoBtn.addEventListener("click", createTodos);

window.addEventListener("load", ()=> {
    renderTodos(allTodos);
});

function createTodos() {
    const allTodos = JSON.parse(localStorage.getItem("allTodos")) ?? [] ;

    const newTodo = {
        id: randomId(),
        name: _name.value,
        description : description.value
    };

    allTodos.unshift(newTodo);
    saveTodos(allTodos);
    resetForm(_name , description);
    renderTodos(allTodos);
    alert("Tarefa criada com sucesso!");

    setTimeout(()=> {
        toggleModal();
        pages[0].style.display = "none";
        pages[1].style.display = "block";
        index = 1;
        addBtn.disabled = true;
    }, 2000);
}

function renderTodos(todos) {
    todoList.innerHTML = "";

    todos.map((todo , pos) => {

        const container = document.createElement("li");

        const todoName = document.createElement("p");
        todoName.innerHTML = `${todo.name}`;
        todoName.setAttribute("title", todo.description);

        const div = document.createElement("div"); 

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Deletar";
        deleteBtn.addEventListener("click", ()=> {
            deleteTodos(pos);
        });

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Editar";
        editBtn.addEventListener("click", ()=> {
            editedDatas(todo , pos , todo.id);
            toggleEditModal();
        });

        div.appendChild(deleteBtn);
        div.appendChild(editBtn);

        container.appendChild(todoName);
        container.appendChild(div);

        todoList.appendChild(container);
    });
}

function deleteTodos(pos) {
    const conf = confirm("Tens a certeza que pretendes deletar a tarefa ?");

    if(conf) {
        const allTodos = JSON.parse(localStorage.getItem("allTodos")) ?? [];

        allTodos.splice(pos , 1);
        saveTodos(allTodos);
        renderTodos(allTodos);
    }
}

function saveTodos(element) {
    localStorage.setItem("allTodos", JSON.stringify(element));
}

function resetForm(...datas) {
    datas.forEach( data => {
        data.value = "";
    });
}

// Gerar id de form ade 
function randomId() {
    const id = Math.random().toString(16).substring(2);
    const allTodos = JSON.parse(localStorage.getItem("allTodos")) ?? [];
    let control = 0 ;

    allTodos.forEach( todo => {
        if( todo.id === id) {
            control++;
        }
    });

    if(control === 0 ){
        return id;

    } else {
        randomId();
    }
}

// Editar 
const containerEditModal =  document.querySelector(".edit-container-modal");
const contentEditModal = document.querySelector(".edit-content-modal");
const closeEditModal = document.querySelector(".close-edit-modal"); 
const editBtn = document.querySelector(".edit-btn");
const editedName = document.querySelector(".edited-name");
const editedDescription = document.querySelector(".edited-description");

closeEditModal.addEventListener("click", toggleEditModal);
editBtn.addEventListener("click", editTodos);

editedName.addEventListener("input", verifyEditBtn);
editedDescription.addEventListener("input", verifyEditBtn);

function verifyEditBtn() {
    if( editedName.value.trim() && editedDescription.value.trim()) {
        editBtn.disabled = false;

    } else {
        editBtn.disabled = true;
    }
}

function editedDatas(todo , pos , id){
    editedName.value = `${todo.name}`;
    editedDescription.innerHTML = `${todo.description}`;
    localStorage.setItem("editPos", JSON.stringify(pos));
    localStorage.setItem("id", JSON.stringify(id));
}

function toggleEditModal() {
    containerEditModal.classList.toggle("hide");
    contentEditModal.classList.toggle("hide");    
}

function editTodos() {
    const allTodos = JSON.parse(localStorage.getItem("allTodos")) ?? [];
    let pos = JSON.parse(localStorage.getItem("editPos"));
    let id = JSON.parse(localStorage.getItem("id"));

    const editedTodo = {
        id: id,
        name: editedName.value,
        description : editedDescription.value
    };

    allTodos[pos] = editedTodo;
    saveTodos(allTodos);
    renderTodos(allTodos)

    alert("Edição feita com sucesso.");
    toggleEditModal();
}

// Pesquisar por tarefas
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", ()=> {
    const allTodos = JSON.parse(localStorage.getItem("allTodos")) ?? [] ;
    
    const searchValue = searchInput.value;

    if(searchValue.trim()) {
        const searchResult = allTodos.filter( todo => {
            return todo.name.toString().toLowerCase().includes(searchValue.toString().toLowerCase());
        });

        if(searchResult.length !== 0) {
            renderTodos(searchResult);

        } else {
            todoList.innerHTML = `<li> Pesquisa não encontrada </li>`;
        }

    } else {
        renderTodos(allTodos);
    }
});