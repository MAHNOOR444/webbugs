let form = document.getElementById("taskForm");
let taskList = document.getElementById("taskList");
let search = document.getElementById("search");
let filter = document.getElementById("filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function showTasks() {
    taskList.innerHTML = "";

    let searchText = search.value.toLowerCase();
    let filterValue = filter.value;

    tasks.forEach(function (task, index) {
        if (task.name.toLowerCase().includes(searchText) && (filterValue == "All" || task.status == filterValue)) {
            let div = document.createElement("div");
            div.className = "task-card";
            const statusClass = task.status.toLowerCase().replace(/\s+/g, "-");
            div.innerHTML = "<div><h3>" + task.name + "</h3><p>" + task.description + "</p></div><div><span class='" + statusClass + "'>" + task.status + "</span> <button onclick='deleteTask(" + index + ")'>Delete</button></div>";
            taskList.appendChild(div);
        }
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("taskName").value;
    let description = document.getElementById("taskDescription").value;
    let status = document.getElementById("taskStatus").value;

    let task = {
        name: name,
        description: description,
        status: status
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    form.reset();
    showTasks();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
}

search.addEventListener("input", showTasks);
filter.addEventListener("change", showTasks);

showTasks();