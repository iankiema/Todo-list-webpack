import { createTaskHTML } from './createHtml.js';

export const todoForm = document.getElementById('todo-form');
export const taskInput = document.getElementById('task-input');
export const taskList = document.getElementById('task-list');
export const clearCompletedBtn = document.getElementById('btn-clear');

let tasks = [];

// Function to render the tasks
export function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const taskHTML = createTaskHTML(task);
    taskList.appendChild(taskHTML);
  });
}

// Load tasks from local storage
export function loadTasksFromLocalStorage() {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
  if (tasksFromLocalStorage) {
    tasks = tasksFromLocalStorage;
    renderTasks();
  }
}

// Save tasks to local storage
export function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task
export function addTask(description) {
  const newTask = {
    description,
    completed: false,
    editing: false,
    index: tasks.length + 1,
  };

  tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to update remaining task indexes after deletion
export function updateTaskIndexes() {
  tasks.forEach((task, index) => {
    task.index = index + 1;
  });
}

// Function to delete a task
export function deleteTask(index) {
  tasks = tasks.filter((task) => task.index !== index);
  updateTaskIndexes();
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to mark a task as completed
export function toggleTaskCompletion(index) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.completed = !task.completed;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Function to toggle editing mode for a task
export function toggleTaskEditing(index) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.editing = !task.editing;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Function to update the description of a task in the tasks array
export function updateTaskDescription(index, description) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.description = description;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Function to clear all completed tasks
export function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasksToLocalStorage();
  renderTasks();
}

// Function to get the element after which to insert the dragged task
export function getDragAfterElement(index) {
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
