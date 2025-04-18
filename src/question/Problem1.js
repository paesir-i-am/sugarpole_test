import React, { useState } from "react";

export default function Problem1() {
	// 알고리즘 함수
	const solveWithPath = (a, b, n) => {
		if (a === b) return { count: 0, ops: [], vals: [a] };

		const OPS = [
			{ fn: (x) => x + 3, label: "+3" },
			{ fn: (x) => x * 2, label: "×2" },
			{ fn: (x) => x * 4, label: "×4" },
		];

		const upper = Math.max(b * 4, 100000);
		const queue = [
			{ val: a, last: -1, streak: 0, steps: 0, pathOps: [], pathVals: [a] },
		];
		const visited = new Set([`${a},-1,0`]);

		while (queue.length) {
			const { val, last, streak, steps, pathOps, pathVals } = queue.shift();

			for (let i = 0; i < OPS.length; i++) {
				if (i === last && streak >= n) continue;          // 연속 제한

				const nextVal = OPS[i].fn(val);
				if (nextVal < 1 || nextVal > upper) continue;

				const nextStreak = i === last ? streak + 1 : 1;
				const key = `${nextVal},${i},${nextStreak}`;
				if (visited.has(key)) continue;

				const nextOps  = [...pathOps, OPS[i].label];
				const nextVals = [...pathVals, nextVal];

				if (nextVal === b) {
					return { count: steps + 1, ops: nextOps, vals: nextVals };
				}

				visited.add(key);
				queue.push({
					val: nextVal,
					last: i,
					streak: nextStreak,
					steps: steps + 1,
					pathOps: nextOps,
					pathVals: nextVals,
				});
			}
		}
		return { count: -1 };
	}; // 함수 끝

	// state값 지정
	const [a, setA] = useState("2");
	const [b, setB] = useState("32");
	const [n, setN] = useState("2");
	const [result, setResult] = useState(null);

	const handleSolve = () => {
		if (!a || !b || !n) return;
		setResult(solveWithPath(+a, +b, +n));
	};

	return (
			<div>
				<h2>문제 1. 자연수 변환</h2>
				<h3>목표</h3>
				<div>시작 자연수 a를 정해진 세 가지 연산만 이용해 목표 자연수 b로 바꾸세요.<br/>
					단, 같은 연산은 연속으로 최대 n번까지만 사용할 수 있습니다.</div>
				<br/>

				<label>
					시작값 a:
					<input type="number" value={a} onChange={(e) => setA(e.target.value)} />
				</label>
				<br />
				<label>
					목표값 b:
					<input type="number" value={b} onChange={(e) => setB(e.target.value)} />
				</label>
				<br />
				<label>
					동일 연산 연속 제한 n:
					<input type="number" value={n} onChange={(e) => setN(e.target.value)} />
				</label>
				<br />

				<button onClick={handleSolve} style={{ marginTop: 12 }}>
					계산하기
				</button>

				{result && (
						<div style={{ marginTop: 24 }}>
							{result.count === -1 ? (
									<p style={{ color: "crimson" }}>변환이 불가능합니다.</p>
							) : (
									<>
										<p>
											최소 연산 횟수: <strong>{result.count}</strong>
										</p>
										<h4>설명 (경로)</h4>
										<ul>
											{result.vals.map((v, idx) => (
													<li key={idx}>
														{idx === 0
																? `시작 → ${v}`
																: `${result.ops[idx - 1]} → ${v}`}
													</li>
											))}
										</ul>
									</>
							)}
						</div>
				)}
			</div>
	);
}
