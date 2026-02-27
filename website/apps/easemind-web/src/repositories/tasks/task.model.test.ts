import { generateId, priorityColor, priorityLabel, statusLabel } from "./task.model";

describe("task.model helpers", () => {
	describe("generateId", () => {
		test("deve retornar uma string não vazia", () => {
			const id = generateId();
			expect(typeof id).toBe("string");
			expect(id.length).toBeGreaterThan(0);
		});

		test("deve gerar IDs únicos", () => {
			const ids = new Set(Array.from({ length: 50 }, () => generateId()));
			expect(ids.size).toBe(50);
		});
	});

	describe("priorityLabel", () => {
		test("deve retornar 'Baixa' para low", () => {
			expect(priorityLabel("low")).toBe("Baixa");
		});

		test("deve retornar 'Média' para medium", () => {
			expect(priorityLabel("medium")).toBe("Média");
		});

		test("deve retornar 'Alta' para high", () => {
			expect(priorityLabel("high")).toBe("Alta");
		});
	});

	describe("statusLabel", () => {
		test("deve retornar 'A Fazer' para todo", () => {
			expect(statusLabel("todo")).toBe("A Fazer");
		});

		test("deve retornar 'Em Progresso' para in-progress", () => {
			expect(statusLabel("in-progress")).toBe("Em Progresso");
		});

		test("deve retornar 'Concluído' para done", () => {
			expect(statusLabel("done")).toBe("Concluído");
		});
	});

	describe("priorityColor", () => {
		test("deve retornar cor verde para low", () => {
			expect(priorityColor("low")).toBe("#4caf50");
		});

		test("deve retornar cor laranja para medium", () => {
			expect(priorityColor("medium")).toBe("#ff9800");
		});

		test("deve retornar cor vermelha para high", () => {
			expect(priorityColor("high")).toBe("#f44336");
		});
	});
});
