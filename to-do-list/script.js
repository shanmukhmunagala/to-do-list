window.onload = function() {
    // Load tasks from local storage on page load
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const dueDate = document.getElementById('dueDate').value;

    if (taskText !== '') {
        const newTask = { text: taskText, completed: false, dueDate: dueDate };
        addTaskToList(newTask);

        // Save tasks to local storage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        taskInput.value = '';
        document.getElementById('dueDate').value = '';
    }
}

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}">${task.text} - ${task.dueDate}</span>
        <button onclick="toggleComplete(this)">Complete</button>
        <button onclick="editTask(this)">Edit</button>
        <button onclick="deleteTask(this)">Delete</button>
    `;
    taskList.appendChild(li);
}

function toggleComplete(button) {
    const taskText = button.parentElement.querySelector('span');
    taskText.classList.toggle('completed');

    // Update task status in local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.text === taskText.innerText.split(' - ')[0]) {
            task.completed = !task.completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(button) {
    const taskText = button.parentElement.querySelector('span');
    const newText = prompt('Edit task:', taskText.innerText.split(' - ')[0]);

    if (newText !== null) {
        taskText.innerText = newText + ' - ' + taskText.innerText.split(' - ')[1];

        // Update task text in local storage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.text === taskText.innerText.split(' - ')[0]) {
                task.text = newText;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function deleteTask(button) {
    const taskText = button.parentElement.querySelector('span');
    button.parentElement.remove();

    // Remove task from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText.innerText.split(' - ')[0]);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks() {
    const filterStatus = document.getElementById('filterStatus').value;
    const taskList = document.getElementById('taskList');
    const tasks = taskList.getElementsByTagName('li');

    for (let task of tasks) {
        const taskStatus = task.querySelector('span').classList.contains('completed') ? 'completed' : 'uncompleted';

        if (filterStatus === 'all' || filterStatus === taskStatus) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    }
}

function sortTasks() {
    const sortDueDate = document.getElementById('sortDueDate').checked;
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.getElementsByTagName('li'));

    tasks.sort(function(a, b) {
        const aDueDate = new Date(a.querySelector('span').innerText.split(' - ')[1]);
        const bDueDate = new Date(b.querySelector('span').innerText.split(' - ')[1]);

        if (sortDueDate) {
            return aDueDate - bDueDate;
        } else {
            return bDueDate - aDueDate;
        }
    });

    tasks.forEach(task => taskList.appendChild(task));
}
