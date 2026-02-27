import { FC, lazy } from "react";

const TaskList: FC = lazy(() =>
	// @ts-ignore
	import("tasks/components")
		.then(module => ({ default: module.TaskList }))
		.catch(error => {
			console.error("Erro ao carregar TaskList:", error);
			return { default: () => <div>Erro ao carregar o componente de Tasks</div> };
		})
);

const TaskOrganizerPage: FC = lazy(() =>
	// @ts-ignore
	import("tasks/components")
		.then(module => ({ default: module.TaskOrganizerPage }))
		.catch(error => {
			console.error("Erro ao carregar TaskOrganizerPage:", error);
			return { default: () => <div>Erro ao carregar o organizador de tarefas</div> };
		})
);

export { TaskList, TaskOrganizerPage };
