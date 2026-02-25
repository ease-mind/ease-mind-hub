import { FC, lazy } from 'react';

const TaskList: FC = lazy(() =>
    // @ts-ignore
    import('tasks/components').then((module) => ({default: module.TaskList})).catch((error) => {
      console.error('Erro ao carregar TaskList:', error)
      return { default: () => <div>Erro ao carregar o componente de Tasks</div> }
    })
  );

export { TaskList };