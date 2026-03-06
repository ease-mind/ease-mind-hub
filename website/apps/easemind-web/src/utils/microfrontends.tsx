import { FC, lazy } from "react";

const TaskList: FC = lazy(() =>
	// @ts-ignore
	import("tasks/components")
		.then(module => {
			console.log("TaskList module loaded:", module);
			if (!module.TaskList) {
				console.error("TaskList not found in module");
				return { default: () => <div>Erro: TaskList não encontrado</div> };
			}
			return { default: module.TaskList };
		})
		.catch(error => {
			console.error("Erro ao carregar TaskList:", error);
			return { default: () => <div>Erro ao carregar o componente de Tasks</div> };
		})
);

const TaskOrganizerPage: FC = lazy(() =>
	// @ts-ignore
	import("tasks/components")
		.then(module => {
			console.log("TaskOrganizerPage module loaded:", module);
			if (!module.TaskOrganizerPage) {
				console.error("TaskOrganizerPage not found in module. Available exports:", Object.keys(module));
				return { default: () => <div>Erro: TaskOrganizerPage não encontrado no módulo remoto</div> };
			}
			return { default: module.TaskOrganizerPage };
		})
		.catch(error => {
			console.error("Erro ao carregar TaskOrganizerPage:", error);
			return { default: () => <div>Erro ao carregar o organizador de tarefas: {error.message}</div> };
		})
);

export { TaskList, TaskOrganizerPage };
