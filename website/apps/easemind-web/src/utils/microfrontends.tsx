import React, { FC, lazy } from "react";

const TaskList: FC = lazy(() =>
	import("mfe-tasks/components").then(module => ({
		default: module.TaskList ?? (() => <div>TaskList não encontrado</div>),
	}))
);

const TaskOrganizerPage: FC = lazy(() =>
	import("mfe-tasks/components").then(module => ({
		default: module.TaskOrganizerPage ?? (() => <div>TaskOrganizerPage não encontrado</div>),
	}))
);

export { TaskList, TaskOrganizerPage };
