const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// تحميل المهام من الذاكرة المحلية عند فتح الصفحة
document.addEventListener('DOMContentLoaded', getTasks);

addBtn.addEventListener('click', addTask);

function addTask() {
    if (taskInput.value === '') return;

    const taskObj = {
        id: Date.now(),
        text: taskInput.value,
        completed: false
    };

    createTaskElement(taskObj);
    saveLocalTask(taskObj);
    taskInput.value = '';
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');
    
    li.innerHTML = `
        <span onclick="toggleTask(${task.id})">${task.text}</span>
        <button class="delete-btn" onclick="removeTask(${task.id}, this)">حذف</button>
    `;
    taskList.appendChild(li);
}

// وظيفة حفظ البيانات في المتصفح
function saveLocalTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => createTaskElement(task));
}

function removeTask(id, element) {
    element.parentElement.remove();
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// عند التحميل، تأكد من الثيم المحفوظ
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerText = '☀️';
}

// 1. تحديد العناصر
const filterBtns = document.querySelectorAll('.filter-btn');

// 2. إضافة حدث الضغط لكل زر فلترة
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // تغيير الزر النشط (Active Class)
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        filterTasks(filterValue);
    });
});

// 3. وظيفة الفلترة الفعلية
function filterTasks(status) {
    const items = taskList.querySelectorAll('.task-item');
    
    items.forEach(item => {
        switch (status) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'completed':
                if (item.classList.contains('completed')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
                break;
            case 'pending':
                if (!item.classList.contains('completed')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
                break;
        }
    });
}