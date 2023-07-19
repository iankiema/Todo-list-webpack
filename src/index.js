
const tasks = [
  {
    description: 'Clean the house',
    completed: false,
    index: 1,
  },
  {
    description: 'Wash the dishes',
    completed: true,
    index: 2,
  },
  {
    description: 'Wash the car',
    completed: false,
    index: 3,
  },
];

function renderTasks() {
  const taskList = document.getElementById('task-list');

  tasks.sort((a, b) => a.index - b.index); // Sort tasks by index

  for (let i = 0; i < tasks.length; i += 1) {
    let task = tasks[i];
    const listItem = document.createElement('li');
    listItem.textContent = task.description;

    listItem.innerHTML = `
    <div class='list-container'>
        <input type='checkbox'>
        <label>${task.description}</label>
        <div class="task-actions">
          <i class="fas fa-ellipsis-v"></i>
        </div>
      </div>

    `

    if (task.completed) {
      listItem.classList.add('completed');
    }

    taskList.appendChild(listItem);
  }
}

document.addEventListener('DOMContentLoaded', renderTasks);
