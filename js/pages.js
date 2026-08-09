function getStoredTeam() {
    return JSON.parse(localStorage.getItem("teamMembers")) || [];
}

function saveStoredTeam(team) {
    localStorage.setItem("teamMembers", JSON.stringify(team));
}

function renderTeamList() {
    const teamList = document.getElementById("teamList");
    if (!teamList) return;

    const team = getStoredTeam();
    teamList.innerHTML = "";

    if (team.length === 0) {
        teamList.innerHTML = "<div class='empty-panel'>No team members added yet.</div>";
        return;
    }

    team.forEach((member, index) => {
        const card = document.createElement("div");
        card.className = "team-card";
        card.innerHTML = `
            <div class="member-info">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        teamList.appendChild(card);
    });
}

function initTeamPage() {
    const teamForm = document.getElementById("teamForm");
    if (!teamForm) return;

    renderTeamList();

    teamForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("teamName").value.trim();
        const role = document.getElementById("teamRole").value.trim();

        if (!name) return;

        const team = getStoredTeam();
        team.push({ name, role });
        saveStoredTeam(team);
        renderTeamList();
        teamForm.reset();
    });

    document.getElementById("teamList").addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-btn")) {
            const index = Number(e.target.dataset.index);
            const team = getStoredTeam();
            team.splice(index, 1);
            saveStoredTeam(team);
            renderTeamList();
        }
    });
}

function getStoredSettings() {
    return JSON.parse(localStorage.getItem("appSettings")) || {
        profileName: "",
        profileEmail: "",
        profileRole: "",
        notifications: true,
        theme: "Light"
    };
}

function saveStoredSettings(settings) {
    localStorage.setItem("appSettings", JSON.stringify(settings));
}

function initSettingsPage() {
    const form = document.getElementById("settingsForm");
    if (!form) return;

    const settings = getStoredSettings();
    document.getElementById("profileName").value = settings.profileName;
    document.getElementById("profileEmail").value = settings.profileEmail;
    document.getElementById("profileRole").value = settings.profileRole;
    document.getElementById("notificationToggle").checked = settings.notifications;
    document.getElementById("themePreference").value = settings.theme;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const newSettings = {
            profileName: document.getElementById("profileName").value.trim(),
            profileEmail: document.getElementById("profileEmail").value.trim(),
            profileRole: document.getElementById("profileRole").value.trim(),
            notifications: document.getElementById("notificationToggle").checked,
            theme: document.getElementById("themePreference").value
        };
        saveStoredSettings(newSettings);
        const status = document.getElementById("settingsStatus");
        if (status) {
            status.textContent = "Settings updated successfully.";
            setTimeout(() => status.textContent = "", 2500);
        }
    });
}

function getStoredEvents() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || [];
}

function saveStoredEvents(events) {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function renderEventList() {
    const eventList = document.getElementById("eventList");
    if (!eventList) return;
    const events = getStoredEvents().sort((a, b) => new Date(a.date) - new Date(b.date));
    eventList.innerHTML = "";

    if (events.length === 0) {
        eventList.innerHTML = "<div class='empty-panel'>No events added yet.</div>";
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <h4>${event.title}</h4>
            <p>${event.description}</p>
            <span>${new Date(event.date).toLocaleDateString()}</span>
        `;
        eventList.appendChild(card);
    });
}

function renderCalendar(monthDate) {
    const grid = document.getElementById("calendarGrid");
    const monthYear = document.getElementById("calendarMonthYear");
    if (!grid || !monthYear) return;

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const currentDate = new Date(year, month, 1);
    const startDay = currentDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    monthYear.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = "";

    for (let i = 0; i < startDay; i++) {
        const cell = document.createElement("div");
        cell.className = "day blank";
        grid.appendChild(cell);
    }

    const events = getStoredEvents();

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        const cellDate = new Date(year, month, day);
        cell.className = "day";
        cell.textContent = day;

        const eventCount = events.filter(event => new Date(event.date).toDateString() === cellDate.toDateString()).length;
        if (eventCount > 0) {
            const badge = document.createElement("span");
            badge.className = "event-badge";
            badge.textContent = eventCount;
            cell.appendChild(badge);
        }

        if (cellDate.toDateString() === new Date().toDateString()) {
            cell.classList.add("today");
        }

        grid.appendChild(cell);
    }
}

function initCalendarPage() {
    const form = document.getElementById("eventForm");
    if (!form) return;

    let currentMonth = new Date();
    renderCalendar(currentMonth);
    renderEventList();

    document.getElementById("prevMonth").addEventListener("click", function () {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        renderCalendar(currentMonth);
    });

    document.getElementById("nextMonth").addEventListener("click", function () {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        renderCalendar(currentMonth);
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("eventTitle").value.trim();
        const date = document.getElementById("eventDate").value;
        const description = document.getElementById("eventDescription").value.trim();

        if (!title || !date) return;

        const events = getStoredEvents();
        events.push({ title, date, description });
        saveStoredEvents(events);
        renderEventList();
        renderCalendar(currentMonth);
        form.reset();
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.classList.toggle('active');
        });
    }
});
// Dark Mode Toggle for Pages
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

function initPages() {
    initTeamPage();
    initSettingsPage();
    initCalendarPage();
    initDarkMode();
}

document.addEventListener("DOMContentLoaded", initPages);
