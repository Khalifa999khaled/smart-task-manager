// 1. تعريف العناصر الأساسية
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');

// 2. تفعيل الميزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    getTasks();
    checkTheme();
});

// --- وظيفة الـ Dark Mode ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function checkTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️';
    }
}

// --- وظيفة إضافة المهام ---
addBtn.addEventListener('click', addTask);

function addTask() {
    if (taskInput.value.trim() === '') return;
    const taskObj = { id: Date.now(), text: taskInput.value, completed: false };
    createTaskElement(taskObj);
    saveLocalTask(taskObj);
    taskInput.value = '';
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.setAttribute('data-id', task.id);
    if (task.completed) li.classList.add('completed');
    
    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="delete-btn">حذف</button>
    `;

    // تغيير حالة المهمة (مكتملة / غير مكتملة)
    li.querySelector('.task-text').addEventListener('click', () => {
        li.classList.toggle('completed');
        updateLocalTask(task.id);
    });

    // حذف المهمة
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        removeTaskFromLocal(task.id);
    });

    taskList.appendChild(li);
}

// --- وظيفة الفلترة ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        
        const allTasks = document.querySelectorAll('.task-item');
        allTasks.forEach(task => {
            switch(filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
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

// --- التعامل مع التخزين (LocalStorage) ---
function saveLocalTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => createTaskElement(task));
}

function updateLocalTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(t => { if(t.id === id) t.completed = !t.completed; });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocal(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}