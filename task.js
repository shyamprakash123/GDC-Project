
const fs = require('fs');
const path = require('path');

const taskFilePath = path.resolve(process.cwd(), 'task.txt');
const completedFilePath = path.resolve(process.cwd(), 'completed.txt');

const tasks = readTasks(taskFilePath);
const completedTasks = readTasks(completedFilePath);

function readTasks(filePath) {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(Boolean);
    return lines.map((line) => {
      const [priority, ...description] = line.split(' ');
      return {
        priority: Number(priority),
        description: description.join(' '),
      };
    });
  } else {
    return [];
  }
}

function writeTasks(tasks, filePath) {
  const fileContent = tasks
    .map(({ priority, description }) => `${priority} ${description}`)
    .join('\n');
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function showHelp() {
  console.log(`Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`);
}

function addTask(priority, description) {
  if(description){
  const newTask = { priority: Number(priority), description };
  tasks.push(newTask);
  writeTasks(tasks, taskFilePath);
  console.log(`Added task: "${description}" with priority ${priority}`);
  }else{
    console.log("Error: Missing tasks string. Nothing added!");
  }
}

function listTasks() {
  if(tasks.length > 0){
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  sortedTasks.forEach(({ priority, description }, index) => {
    console.log(`${index + 1}. ${description} [${priority}]`);
  });
  }else{
    console.log(`There are no pending tasks!`);
  }
}

function deleteTask(index) {
    if (index < 1 || index > tasks.length) {
    console.log(`Error: task with index #${index} does not exist. Nothing deleted.`);
    return;
  }
  tasks.splice(index - 1, 1);
  writeTasks(tasks, taskFilePath);
  console.log(`Deleted task #${index}`);
}

function markTaskAsDone(index) {
  if (index < 1 || index > tasks.length) {
    console.log(`Error: no incomplete item with index #${index} exists.`);
    return;
  }
  const completedTask = tasks.splice(index - 1, 1)[0];
  completedTasks.push(completedTask);
  writeTasks(tasks, taskFilePath);
  writeTasks(completedTasks, completedFilePath);
  console.log('Marked item as done.');
}

function generateReport() {
  console.log(`Pending : ${tasks.length}`);
  tasks.forEach(({ priority, description }, index) => {
    console.log(`${index + 1}. ${description} [${priority}]`);
  });
  console.log("\n"+`Completed : ${completedTasks.length}`);
  completedTasks.forEach(({ description }, index) => {
    console.log(`${index + 1}. ${description}`);
  });
}

function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'add') {
    const [priority, ...description] = args;
    addTask(priority, description.join(' '));
  } else if (command === 'ls') {
    listTasks();
  } else if (command === 'del') {
    if(args.length == 0){
      console.log("Error: Missing NUMBER for deleting tasks.");
    }else{
      const index = Number(args[0]);
      deleteTask(index);
    }
  } else if (command === 'done') {
    if(args.length == 0){
      console.log("Error: Missing NUMBER for marking tasks as done.");
    }else{
      const index = Number(args[0]);
      markTaskAsDone(index);
    }
  } else if (command === 'help') {
    showHelp();
  } else if (command === 'report') {
    generateReport();
  } else {
    showHelp();
  }
}

main();
