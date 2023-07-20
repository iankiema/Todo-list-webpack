/* eslint-disable no-use-before-define */
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearCompletedBtn = document.getElementById('btn-clear');

let tasks = [];

// Function to render the tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const taskHTML = createTaskHTML(task);
    taskList.appendChild(taskHTML);
  });
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
  if (tasksFromLocalStorage) {
    tasks = tasksFromLocalStorage;
    renderTasks();
  }
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task
function addTask(description) {
  const newTask = {
    description,
    completed: false,
    index: tasks.length + 1,
  };

  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to delete a task
function deleteTask(index) {
  tasks = tasks.filter((task) => task.index !== index);
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to mark a task as completed
function toggleTaskCompletion(index) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.completed = !task.completed;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Function to toggle editing mode for a task
function toggleTaskEditing(index) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.editing = !task.editing;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Function to update the description of a task in the tasks array
function updateTaskDescription(index, description) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.description = description;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Function to clear all completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasksToLocalStorage();
  renderTasks();
}

// Helper function to create task HTML
function createTaskHTML(task) {
  const li = document.createElement('li');
  li.className = `${task.completed ? 'completed' : ''} ${task.editing ? 'editing' : ''}`;
  li.setAttribute('draggable', 'true');
  li.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''}>
    ${
  task.editing
    ? `<input type="text" value="${task.description}">`
    : `<label>${task.description}</label>`
}
    <div class="task-actions">
      <i class="fas fa-ellipsis-v task-more"></i>
      <i class="fas fa-trash task-delete"></i>
    </div>
    <hr>
  `;

  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => toggleTaskCompletion(task.index));

  const taskMore = li.querySelector('.task-more');
  const taskDelete = li.querySelector('.task-delete');

  taskMore.addEventListener('click', () => toggleTaskEditing(task.index));
  taskDelete.addEventListener('click', () => deleteTask(task.index));

  if (task.editing) {
    const taskInput = li.querySelector('input[type="text"]');
    taskInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const description = taskInput.value.trim();
        if (description !== '') {
          updateTaskDescription(task.index, description);
        }
      }
    });
  }

  // Add drag and drop event listeners
  li.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', task.index);
    li.classList.add('dragging');
  });

  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    const allTasks = document.querySelectorAll('#task-list li');
    allTasks.forEach((t) => t.classList.remove('over'));
  });

  li.addEventListener('dragover', (event) => {
    event.preventDefault();

    // Calculate the mouse position relative to the task
    const mouseY = event.clientY - li.getBoundingClientRect().top;
    const threshold = li.offsetHeight / 2;

    // Update the UI to show the drop position
    const allTasks = document.querySelectorAll('#task-list li');
    allTasks.forEach((t) => t.classList.remove('over'));
    if (!li.classList.contains('dragging')) {
      li.classList.add('over');
      if (mouseY > threshold) {
        const afterElement = getDragAfterElement(task.index);
        taskList.insertBefore(li, afterElement.nextSibling);
      } else {
        taskList.insertBefore(li, getDragAfterElement(task.index));
      }
    }
  });

  li.addEventListener('drop', (event) => {
    event.preventDefault();
    const sourceIndex = event.dataTransfer.getData('text/plain');
    const destinationIndex = task.index;

    // Reorder the tasks array
    const sourceTask = tasks.find((task) => task.index === parseInt(sourceIndex, 10));
    const destinationTask = tasks.find((task) => task.index === destinationIndex);
    const tempIndex = sourceTask.index;
    sourceTask.index = destinationTask.index;
    destinationTask.index = tempIndex;

    saveTasksToLocalStorage();
    renderTasks();
  });

  return li;
}

// Function to get the element after which to insert the dragged task
function getDragAfterElement(index) {
  const allTasks = [...document.querySelectorAll('#task-list li:not(.dragging)')];
  return allTasks.reduce((closest, task) => {
    const taskRect = task.getBoundingClientRect();
    const offset = index < task.index ? -15 : 15;
    const gap = Math.abs(offset) - (index < task.index ? 0 : taskRect.height);
    if (gap < closest.gap) {
      return { task, gap };
    }
    return closest;
  }, { task: null, gap: Number.POSITIVE_INFINITY }).task;
}

// Event listener to add a new task
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskDescription = taskInput.value.trim();
  if (taskDescription === '') return;
  addTask(taskDescription);
  taskInput.value = '';
});

// Event listener to clear completed tasks
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
