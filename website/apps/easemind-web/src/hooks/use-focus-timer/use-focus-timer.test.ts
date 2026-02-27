import { act, renderHook } from "@testing-library/react";
import { useFocusTimer } from "./use-focus-timer";

describe("useFocusTimer", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test("deve iniciar no estado idle com tempo padrão de 25 min", () => {
		const { result } = renderHook(() => useFocusTimer());
		expect(result.current.state).toBe("idle");
		expect(result.current.display).toBe("25:00");
		expect(result.current.remaining).toBe(1500);
		expect(result.current.progress).toBe(0);
	});

	test("deve aceitar minutos iniciais customizados", () => {
		const { result } = renderHook(() => useFocusTimer(15));
		expect(result.current.display).toBe("15:00");
		expect(result.current.remaining).toBe(900);
	});

	test("deve alternar para running ao iniciar", () => {
		const { result } = renderHook(() => useFocusTimer(1));

		act(() => {
			result.current.start();
		});

		expect(result.current.state).toBe("running");
	});

	test("deve decrementar o tempo ao rodar", () => {
		const { result } = renderHook(() => useFocusTimer(1));

		act(() => {
			result.current.start();
		});

		act(() => {
			jest.advanceTimersByTime(3000);
		});

		expect(result.current.remaining).toBe(57);
		expect(result.current.display).toBe("00:57");
	});

	test("deve calcular progresso corretamente", () => {
		const { result } = renderHook(() => useFocusTimer(1));

		act(() => {
			result.current.start();
		});

		act(() => {
			jest.advanceTimersByTime(30000);
		});

		expect(result.current.progress).toBe(50);
	});

	test("deve pausar o timer", () => {
		const { result } = renderHook(() => useFocusTimer(1));

		act(() => {
			result.current.start();
		});

		act(() => {
			jest.advanceTimersByTime(5000);
		});

		act(() => {
			result.current.pause();
		});

		expect(result.current.state).toBe("paused");
		const remainingAfterPause = result.current.remaining;

		act(() => {
			jest.advanceTimersByTime(5000);
		});

		expect(result.current.remaining).toBe(remainingAfterPause);
	});

	test("deve retomar o timer após pausa", () => {
		const { result } = renderHook(() => useFocusTimer(1));

		act(() => {
			result.current.start();
		});

		act(() => {
			jest.advanceTimersByTime(5000);
		});

		act(() => {
			result.current.pause();
		});

		act(() => {
			result.current.resume();
		});

		expect(result.current.state).toBe("running");

		act(() => {
			jest.advanceTimersByTime(2000);
		});

		expect(result.current.remaining).toBe(53);
	});

	test("deve resetar para o tempo total", () => {
		const { result } = renderHook(() => useFocusTimer(15));

		act(() => {
			result.current.start();
		});

		act(() => {
			jest.advanceTimersByTime(10000);
		});

		act(() => {
			result.current.reset();
		});

		expect(result.current.state).toBe("idle");
		expect(result.current.remaining).toBe(900);
		expect(result.current.display).toBe("15:00");
	});

	test("deve atualizar minutos com setMinutes", () => {
		const { result } = renderHook(() => useFocusTimer(15));

		act(() => {
			result.current.setMinutes(45);
		});

		expect(result.current.state).toBe("idle");
		expect(result.current.remaining).toBe(2700);
		expect(result.current.display).toBe("45:00");
	});

	test("deve voltar para idle quando o timer chegar a zero", () => {
		const { result } = renderHook(() => useFocusTimer(1));

		act(() => {
			result.current.start();
		});

		act(() => {
			jest.advanceTimersByTime(60000);
		});

		expect(result.current.state).toBe("idle");
		expect(result.current.remaining).toBe(0);
	});
});
