import { useCallback, useEffect, useRef, useState } from "react";

export type TimerState = "idle" | "running" | "paused";

export function useFocusTimer(initialMinutes: number = 25) {
	const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
	const [remaining, setRemaining] = useState(initialMinutes * 60);
	const [state, setState] = useState<TimerState>("idle");
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clear = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const setMinutes = useCallback((m: number) => {
		clear();
		const s = m * 60;
		setTotalSeconds(s);
		setRemaining(s);
		setState("idle");
	}, []);

	const start = useCallback(() => {
		clear();
		setState("running");
		intervalRef.current = setInterval(() => {
			setRemaining(prev => {
				if (prev <= 1) {
					clear();
					setState("idle");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	const pause = useCallback(() => {
		clear();
		setState("paused");
	}, []);

	const resume = useCallback(() => {
		start();
	}, [start]);

	const reset = useCallback(() => {
		clear();
		setRemaining(totalSeconds);
		setState("idle");
	}, [totalSeconds]);

	useEffect(() => {
		return clear;
	}, []);

	const minutes = Math.floor(remaining / 60);
	const seconds = remaining % 60;
	const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

	return {
		state,
		display,
		remaining,
		totalSeconds,
		progress,
		minutes,
		seconds,
		start,
		pause,
		resume,
		reset,
		setMinutes
	};
}
