let taskIdCounter = 0;
let tasks = [];

const formEl = document.querySelector("#task-form");
const tasksOpenedEl = document.querySelector("#tasks-opened");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksClosedEl = document.querySelector("#tasks-closed");
const tasksBlockedEl = document.querySelector("#tasks-blocked");
const pageContentEl = document.querySelector("#page-content");

const completeEditTask = function (taskTitle, taskDescription, taskId) {
    // find the matching task list item
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].title = taskTitle;
            tasks[i].description = taskDescription;
            break;
        }
    };

    saveTasks();

    formEl.removeAttribute("data-task-id");

    document.querySelector("#save-task").textContent = "Add Task";
};

const createTaskEl = function (taskDataObj) {
    // create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    listItemEl.setAttribute("draggable", "true");

    // create div to hold task info and add to list item
    let taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.title + "</h3><span class='task-type'>" + taskDataObj.description + "</span>";

    listItemEl.appendChild(taskInfoEl);

    const taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    taskDataObj.id = taskIdCounter;

    // set status of task based on dropZone id
    const statusSelectEl = listItemEl.querySelector("select[name='status-change']");

    if (taskDataObj.status === "Opened") {
        statusSelectEl.selectedIndex = 0;
        tasksOpenedEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === "In Progress") {
        statusSelectEl.selectedIndex = 1;
        tasksInProgressEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === "Closed") {
        statusSelectEl.selectedIndex = 2;
        tasksClosedEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === "Blocked") {
        statusSelectEl.selectedIndex = 3;
        tasksBlockedEl.appendChild(listItemEl);
    }

    tasks.push(taskDataObj);

    // increase task counter for next unique id
    taskIdCounter++;
};

const createTaskActions = function (taskId) {
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["Opened", "In Progress", "Closed", "Blocked"];
    for (let i = 0; i < statusChoices.length; i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

// TODO: We may not need this
const editTask = function (taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

const taskStatusChangeHandler = function (event) {
    // get the task item's id
    const taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    const statusValue = event.target.value;

    // find the parent task item element based on the id
    const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "Opened") {
        tasksOpenedEl.appendChild(taskSelected);
    }
    else if (statusValue === "In Progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "Closed") {
        tasksClosedEl.appendChild(taskSelected);
    }
    else if (statusValue === "Blocked") {
        tasksBlockedEl.appendChild(taskSelected);
    }

    // update task's information in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
            break;
        }
    }

    saveTasks(taskId);
};

const dragTaskHandler = function (event) {
    const taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
};

const dropZoneDragHandler = function (event) {
    const taskListEl = event.target.closest(".task-list");

    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

const dropTaskHandler = function (event) {
    const id = event.dataTransfer.getData("text/plain");
    const draggableElement = document.querySelector("[data-task-id='" + id + "']");

    const dropZoneEl = event.target.closest(".task-list");
    const statusType = dropZoneEl.id;

    // set status of task based on dropZone id
    const statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if (statusType === "tasks-opened") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-closed") {
        statusSelectEl.selectedIndex = 2;
    }
    else if (statusType === "tasks-blocked") {
        statusSelectEl.selectedIndex = 3;
    }

    dropZoneEl.appendChild(draggableElement);
    dropZoneEl.removeAttribute("style");

    // loop through tasks array to find and update the updated task's status
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value;
            break;
        }
    }

    saveTasks(id);
};

const dragLeaveHandler = function (event) {
    const taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

const saveTasks = function (taskId) {
    // Save updated task information to server
    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateIssueState(tasks[taskId]);
};

const loadTasks = function () {
    // Gets task items from server
    fetch(`/api/issue/user/${userID}`, { // User ID is set by server on rendered HTML
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(function (Response) {
            if (Response.ok) {
                return Response.json();
            }
            else {
                alert("Error"); // TODO - Don't alert like a weirdo
            }
        })
        .then(userIssues => {
            clearSpinners();
            for (let i = 0; i < userIssues.issues.length; i++) {
                let newTask = {};

                newTask.id = i;
                newTask.issue_id = userIssues.issues[i].id;
                newTask.project_id = userIssues.issues[i].project_id;
                newTask.github_user_number = userIssues.issues[i].github_issue_number;
                newTask.title = userIssues.issues[i].github_issue_details.title;
                newTask.description = descriptionTrimmer(userIssues.issues[i].github_issue_details.body);
                newTask.fullDescription = userIssues.issues[i].github_issue_details.body;
                newTask.issue_state_id = userIssues.issues[i].project_id;
                newTask.status = (userIssues.issues[i].issue_state) ? userIssues.issues[i].issue_state.name : 'Opened'; // get from status - null means open

                createTaskEl(newTask);
            }
        });
}

const clearSpinners = function () {
    tasksOpenedEl.innerHTML = '';
    tasksInProgressEl.innerHTML = '';
    tasksClosedEl.innerHTML = '';
    tasksBlockedEl.innerHTML = '';
};

const descriptionTrimmer = function (description) {
    return description.substring(0, 20) + "...";
};

pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();