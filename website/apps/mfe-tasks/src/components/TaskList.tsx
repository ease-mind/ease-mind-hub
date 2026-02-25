import React, { useState } from 'react';
import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { EaseMindCard, EaseMindButton } from '@repo/ui';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Completar projeto React', completed: false },
    { id: 2, title: 'Revisar código', completed: true },
    { id: 3, title: 'Fazer deploy', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: `Nova tarefa ${tasks.length + 1}`,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Box maxWidth="600px" margin="0 auto" p={3}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={3}>
        Minhas Tarefas
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {tasks.map(task => (
          <EaseMindCard key={task.id}>
            <Box 
              display="flex" 
              alignItems="center" 
              p={2}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              <Checkbox 
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                color="primary"
              />
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {task.title}
              </Typography>
              <IconButton 
                onClick={() => deleteTask(task.id)}
                color="error"
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
          </EaseMindCard>
        ))}
      </Box>

      <Box mt={3} textAlign="center">
        <EaseMindButton
          onClick={addTask}
          label="Adicionar Tarefa"
          variant="contained"
          color="primary"
          startIcon={<Add />}
        />
      </Box>
    </Box>
  );
};
