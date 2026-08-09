const totalTasksElem = document.getElementById("totalTasks");
const completedTasksElem = document.getElementById("completedTasks");
const inProgressTasksElem = document.getElementById("inProgressTasks");
const overdueTasksElem = document.getElementById("overdueTasks");
const progressTasksElem = document.getElementById("progressTasks");
const progressCompletedElem = document.getElementById("progressCompleted");
const progressInProgressElem = document.getElementById("progressInProgress");
const todoTasksElem = document.getElementById("todoTasks");
const todoCountElem = document.getElementById("todoCount");
const inProgressCountElem = document.getElementById("inProgressCount");
const doneCountElem = document.getElementById("doneCount");
const todoListElem = document.getElementById("todoList");
const inProgressListElem = document.getElementById("inProgressList");
const doneListElem = document.getElementById("doneList");
const teamDashboardList = document.getElementById("teamDashboardList");

function renderTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
        <div>
            <h3>${task.name}</h3>
            <p>${task.description}</p>
        </div>
        <div>
            <span class="${task.status.toLowerCase().replace(/\s+/g, "-")}">${task.status}</span>
        </div>
    `;
    return card;
}

function renderTeamDashboard() {
    if (!teamDashboardList) return;
    const team = JSON.parse(localStorage.getItem("teamMembers")) || [];
    teamDashboardList.innerHTML = "";

    if (team.length === 0) {
        teamDashboardList.innerHTML = "<div class='empty-panel'>No team members added yet.</div>";
        return;
    }

    team.forEach(member => {
        const row = document.createElement("div");
        row.className = "team-member-item";
        row.innerHTML = `
            <div>
                <h4>${member.name}</h4>
                <p>${member.role}</p>
            </div>
        `;
        teamDashboardList.appendChild(row);
    });
}

function getDashboardEvents() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || [];
}

function renderDashboardCalendar(date = new Date()) {
    const monthLabel = document.getElementById("dashboardCalendarMonth");
    const grid = document.getElementById("dashboardCalendarGrid");
    if (!monthLabel || !grid) return;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const events = getDashboardEvents();

    monthLabel.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = "";

    for (let i = 0; i < startDay; i++) {
        const cell = document.createElement("div");
        cell.className = "day blank";
        grid.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "day";
        cell.textContent = day;

        const cellDate = new Date(year, month, day);
        const eventCount = events.filter(event => new Date(event.date).toDateString() === cellDate.toDateString()).length;
        if (eventCount > 0) {
            const badge = document.createElement("span");
            badge.className = "event-badge";
            badge.textContent = eventCount;
            cell.appendChild(badge);
        }

        const today = new Date();
        if (cellDate.toDateString() === today.toDateString()) {
            cell.classList.add("active");
        }

        grid.appendChild(cell);
    }
}

function loadDashboardTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Completed").length;
    const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
    const todoTasks = tasks.filter(task => task.status === "Pending").length;
    const overdueTasks = 0;

    totalTasksElem.textContent = totalTasks;
    completedTasksElem.textContent = completedTasks;
    inProgressTasksElem.textContent = inProgressTasks;
    overdueTasksElem.textContent = overdueTasks;

    progressTasksElem.textContent = totalTasks;
    progressCompletedElem.textContent = completedTasks;
    progressInProgressElem.textContent = inProgressTasks;
    todoTasksElem.textContent = todoTasks;

    todoCountElem.textContent = todoTasks;
    inProgressCountElem.textContent = inProgressTasks;
    doneCountElem.textContent = completedTasks;

    todoListElem.innerHTML = "";
    inProgressListElem.innerHTML = "";
    doneListElem.innerHTML = "";

    if (tasks.length === 0) {
        todoListElem.innerHTML = "<div class='task-card empty'>No tasks yet.</div>";
    } else {
        tasks.forEach(task => {
            const status = task.status;
            if (status === "Completed") {
                doneListElem.appendChild(renderTaskCard(task));
            } else if (status === "In Progress") {
                inProgressListElem.appendChild(renderTaskCard(task));
            } else {
                todoListElem.appendChild(renderTaskCard(task));
            }
        });
    }

    renderTeamDashboard();
    renderDashboardCalendar();
}

// Dark Mode Toggle
function initDarkMode() {
    const toggleSwitch = document.querySelector(".toggle-switch");
    const html = document.documentElement;
    
    // Load saved dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
        html.classList.add("dark-mode");
        if (toggleSwitch) toggleSwitch.classList.add("active");
    }
    
    // Add click event to toggle
    if (toggleSwitch) {
        toggleSwitch.addEventListener("click", function() {
            html.classList.toggle("dark-mode");
            toggleSwitch.classList.toggle("active");
            const isDark = html.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDark);
        });
    }
}

window.addEventListener("DOMContentLoaded", function() {
    loadDashboardTasks();
    initDarkMode();
});
