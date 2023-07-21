import './style.css';
import {
  addTask, todoForm, taskInput, clearCompletedBtn,
  clearCompletedTasks, loadTasksFromLocalStorage, renderTasks,
} from './todoFunctions.js';

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

renderTasks();
// renderTasks(addTask());
// renderTasks(deleteTask());
// renderTasks(loadTasksFromLocalStorage());
// renderTasks(updateTaskDescription());
// renderTasks(clearCompletedTasks());
// renderTasks(toggleTaskEditing());
// renderTasks(toggleTaskCompletion());

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
