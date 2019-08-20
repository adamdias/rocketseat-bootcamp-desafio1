const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  {
    id: '1',
    title: 'Novo Projeto',
    tasks: []
  }
];

let count = 0;

server.use((req, res, next) => {
  count++;

  console.log(count);

  return next();
});

function projectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex !== -1) {
    req.projectIndex = projectIndex;

    return next();
  }

  return res.status(404).json({ error: "Project not found!" });
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects[projects.length - 1]);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', projectExists, (req, res) => {
  const { projectIndex } = req;
  const { title } = req.body;

  if (title) {
    projects[projectIndex].title = title;

    return res.json(projects[projectIndex]);
  }

  return res.status(400).json({ error: 'Title is required' });
});

server.delete('/projects/:id', projectExists, (req, res) => {
  const { projectIndex } = req;

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', projectExists, (req, res) => {
  const { projectIndex } = req;
  const { title } = req.body;

  if (title) {
    projects[projectIndex].tasks.push(title);

    return res.json(projects[projectIndex]);
  }

  return res.status(400).json({ error: 'Title is required' });
});

server.listen(3333);