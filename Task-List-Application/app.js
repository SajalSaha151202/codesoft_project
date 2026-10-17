// Global State
let tasks = JSON.parse(localStorage.getItem('my_tasks')) || [];
let currentFilter = 'all';
let currentSearch = '';
let editingTaskId = null; // Track if we are editing an existing task

// Save to Local Storage
function saveTasks() {
  localStorage.setItem('my_tasks', JSON.stringify(tasks));
}
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');
const errorMessage = document.getElementById('errorMessage');
const submitTaskBtn = document.getElementById('submitTaskBtn');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();

  // Validation
  if (!text) {
    errorMessage.textContent = "Please enter a valid task description!";
    return;
  }
  errorMessage.textContent = "";

  if (editingTaskId !== null) {
    // Update existing task
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.text = text;
      task.priority = prioritySelect.value;
      task.dueDate = dueDateInput.value;
    }
    editingTaskId = null;
    submitTaskBtn.textContent = "Add Task";
  } else {
    // Add new task
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      priority: prioritySelect.value,
      dueDate: dueDateInput.value
    };
    tasks.push(newTask);
  }

  taskForm.reset();
  saveTasks();
  render();
});
function toggleTaskComplete(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

function startEditTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  taskInput.value = task.text;
  prioritySelect.value = task.priority;
  dueDateInput.value = task.dueDate || '';
  
  editingTaskId = id;
  submitTaskBtn.textContent = "Update Task";
  taskInput.focus();
}
document.getElementById('searchInput').addEventListener('input', (e) => {
  currentSearch = e.target.value.toLowerCase();
  render();
});

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    render();
  });
});
const taskList = document.getElementById('taskList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

function render() {
  // Update Counters
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  
  completedCount.textContent = completed;
  pendingCount.textContent = pending;

  // Filter Tasks
  let filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(currentSearch);
    if (!matchesSearch) return false;

    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Render HTML
  taskList.innerHTML = '';
  
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; opacity:0.6; padding: 10px;">No tasks found</li>`;
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div style="display:flex; align-items:center; gap: 8px;">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${task.id})">
        <span class="task-text">${task.text}</span>
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
        ${task.dueDate ? `<small style="opacity:0.7">📅 \${task.dueDate}</small>` : ''}
      </div>
      <div class="task-actions">
        <button onclick="startEditTask(${task.id})">Edit</button>
        <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}const themeToggleBtn = document.getElementById('themeToggleBtn');

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
});

// Load saved theme on startup
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = '☀️';
}

// Initial render when the page loads
render();