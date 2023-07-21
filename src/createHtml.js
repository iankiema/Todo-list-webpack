import {
  updateTaskDescription, toggleTaskEditing, toggleTaskCompletion, deleteTask,
} from './todoFunctions.js';

// Helper function to create task HTML
export default function createTaskHTML(task) {
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
  return li;
}

export { createTaskHTML };
