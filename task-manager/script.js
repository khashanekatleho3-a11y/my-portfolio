
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = [];
let currentFilter = "all";

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from the browser
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks !== null) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks;
        }
    }
}

// Update the remaining-task counter
function updateTaskCount() {
    let remainingTasks = 0;

    tasks.forEach(function (task) {
        if (!task.completed) {
            remainingTasks++;
        }
    });

    taskCount.textContent = remainingTasks + " tasks remaining";
}

// Display tasks on the webpage
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");
        const taskText = document.createElement("span");

        taskText.textContent = task.text;
        li.appendChild(taskText);

        if (task.completed) {
            li.classList.add("completed");
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        li.appendChild(deleteButton);
        li.appendChild(editButton);

        // Mark a task complete or incomplete
        li.addEventListener("click", function () {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        // Delete a task
        deleteButton.addEventListener("click", function (event) {
            event.stopPropagation();

            tasks = tasks.filter(function (item) {
                return item !== task;
            });

            saveTasks();
            renderTasks();
        });

        // Edit a task
        editButton.addEventListener("click", function (event) {
            event.stopPropagation();

            const newTaskText = prompt(
                "Edit your task:",
                task.text
            );

            if (
                newTaskText !== null &&
                newTaskText.trim() !== ""
            ) {
                task.text = newTaskText.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Apply the selected filter
        if (
            currentFilter === "active" &&
            task.completed
        ) {
            li.style.display = "none";
        } else if (
            currentFilter === "completed" &&
            !task.completed
        ) {
            li.style.display = "none";
        }

        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);

// Filter tasks
const filterButtons = document.querySelectorAll("[data-filter]");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

// Restore saved tasks when the page opens
loadTasks();
renderTasks();
