const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const filterBtns = document.querySelectorAll('.filter-btn');

// 1. تشغيل الوظائف عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadTheme();
});

// 2. إدارة الوضع الليلي (Dark Mode)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️';
    }
}

// 3. إضافة مهمة جديدة
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text !== "") {
        const task = { id: Date.now(), text: text, completed: false };
        createTaskElement(task);
        saveTaskToLocal(task);
        taskInput.value = "";
    }
});

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');
    li.dataset.id = task.id;

    li.innerHTML = `
        <span>${task.text}</span>
        <button class="delete-btn">حذف</button>
    `;

    // ضغطة لإتمام المهمة
    li.querySelector('span').addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskInLocal(task.id);
    });

    // ضغطة للحذف
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        deleteTaskFromLocal(task.id);
    });

    taskList.appendChild(li);
}

// 4. الفلترة (الكل - المكتملة - قيد التنفيذ)
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const tasks = document.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            switch(filter) {
                case 'all': task.style.display = 'flex'; break;
                case 'completed': 
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none'; 
                    break;
                case 'pending': 
                    task.style.display = !task.classList.contains('completed') ? 'flex' : 'none'; 
                    break;
            }
        });
    });
});

// 5. التعامل مع التخزين المحلي (Local Storage)
function saveTaskToLocal(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks') || "[]");
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks') || "[]");
    tasks.forEach(task => createTaskElement(task));
}

function updateTaskInLocal(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(t => { if(t.id == id) t.completed = !t.completed; });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromLocal(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(t => t.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}