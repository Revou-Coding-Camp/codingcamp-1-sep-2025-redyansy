const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task");
const dateInput = document.getElementById("date");
const list = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");

const filterToggle = document.getElementById("filter-toggle");
const filterPanel = document.getElementById("filter-panel");
const filterText = document.getElementById("filter-text");
const filterDate = document.getElementById("filter-date");
const applyFilterBtn = document.getElementById("apply-filter");
const resetFilterBtn = document.getElementById("reset-filter");

let todos = JSON.parse(
  localStorage.getItem("todos_with_button_filter") || "[]"
);

function save() {
  localStorage.setItem("todos_with_button_filter", JSON.stringify(todos));
}

function render(data = todos) {
  list.innerHTML = "";
  if (!data.length) {
    list.innerHTML = '<li class="empty">No tasks found 🚀</li>';
    return;
  }

  data.forEach((t) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const left = document.createElement("div");
    left.className = "todo-left";

    const task = document.createElement("span");
    task.className = "todo-task";
    task.textContent = t.task;

    const date = document.createElement("span");
    date.className = "todo-date";
    date.textContent = new Date(t.date).toLocaleDateString();

    left.appendChild(task);
    left.appendChild(date);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => remove(t.id);

    li.appendChild(left);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

function add(task, date) {
  todos.unshift({ id: Date.now().toString(), task, date });
  save();
  render();
}

function remove(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

function clearAll() {
  if (confirm("Delete all tasks?")) {
    todos = [];
    save();
    render();
  }
}

function applyFilters() {
  const q = filterText.value.trim().toLowerCase();
  const d = filterDate.value;
  let filtered = todos.filter((t) => {
    let ok = true;
    if (q) ok = ok && t.task.toLowerCase().includes(q);
    if (d) ok = ok && t.date === d;
    return ok;
  });
  render(filtered);
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!taskInput.value.trim() || !dateInput.value) return;
  add(taskInput.value.trim(), dateInput.value);
  form.reset();
});

clearBtn.addEventListener("click", clearAll);
filterToggle.addEventListener("click", () => {
  filterPanel.classList.toggle("hidden");
});
applyFilterBtn.addEventListener("click", applyFilters);
resetFilterBtn.addEventListener("click", () => {
  filterText.value = "";
  filterDate.value = "";
  render();
});

render();
