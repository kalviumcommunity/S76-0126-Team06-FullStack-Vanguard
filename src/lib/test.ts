import { fetchTasks, createTask } from './api';

async function testAPI() {
  try {
    // Test fetching tasks
    const tasks = await fetchTasks('test-project-id');
    console.log('Tasks:', tasks);
    
    // Test creating a task
    const newTask = await createTask({
      title: 'Test Task',
      projectId: 'test-project-id',
    });
    console.log('Created task:', newTask);
  } catch (error) {
    console.error('API test failed:', error);
  }
}