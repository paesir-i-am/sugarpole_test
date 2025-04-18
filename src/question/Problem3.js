import React, { useState } from "react";

export default function Problem3() {
	/*
	 * 최소 울타리 내부 면적 계산
	 * 동물 좌표 → Manhattan MST (Prim)
	 * 각 간선을 L‑자 경로(세로→가로 / 가로→세로) 중
	 * ‘새 셀 수’가 적은 방향으로 연결
	 * 동물 + 경로 셀 = 울타리 내부 셀
	 */
	const solveFence = (rows) => {
		const points = [];
		rows.forEach((row, r) =>
				[...row].forEach((ch, c) => ch === "a" && points.push([r, c]))
		);
		if (!points.length) throw new Error("'a'가 최소 1개 필요합니다.");

		/* -- Prim 으로 Manhattan MST -- */
		const n = points.length;
		const used = Array(n).fill(false);
		const dist = Array(n).fill(Infinity);
		const parent = Array(n).fill(-1);
		dist[0] = 0;

		for (let step = 0; step < n; step++) {
			let u = -1;
			for (let i = 0; i < n; i++)
				if (!used[i] && (u === -1 || dist[i] < dist[u])) u = i;
			used[u] = true;

			for (let v = 0; v < n; v++) {
				if (used[v]) continue;
				const w =
						Math.abs(points[u][0] - points[v][0]) +
						Math.abs(points[u][1] - points[v][1]);
				if (w < dist[v]) {
					dist[v] = w;
					parent[v] = u;
				}
			}
		}

		/* -- MST 간선을 ‘L’ 경로로 깔아가며 셀 집합 구축 -- */
		const cells = new Set(points.map(([r, c]) => `${r},${c}`));

		const addPath = (r1, c1, r2, c2) => {
			const variants = [];

			// (A) 세로 → 가로
			let path = [];
			for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) path.push([r, c1]);
			for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) path.push([r2, c]);
			variants.push(path);

			// (B) 가로 → 세로
			path = [];
			for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) path.push([r1, c]);
			for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) path.push([r, c2]);
			variants.push(path);

			// 새로 추가되는 셀이 더 적은 경로 채택
			variants
					.sort(
							(A, B) =>
									A.filter(([r, c]) => !cells.has(`${r},${c}`)).length -
									B.filter(([r, c]) => !cells.has(`${r},${c}`)).length
					)[0]
					.forEach(([r, c]) => cells.add(`${r},${c}`));
		};

		for (let v = 1; v < n; v++) {
			const u = parent[v];
			addPath(points[u][0], points[u][1], points[v][0], points[v][1]);
		}

		return { area: cells.size, cells, animalPts: points };
	};

	 // FenceGrid : 격자 전체(입력 크기) 시각화
	const FenceGrid = ({ rows, cells, animalPts }) => {
		const R = rows.length;
		const C = rows[0].length;
		const cellSet = new Set(cells);
		const animalSet = new Set(animalPts.map(([r, c]) => `${r},${c}`));

		// 각 칸에 대해, 이웃 중 울타리 내부가 없는 방향에만 굵은 선
		const border = {};
		for (let r = 0; r < R; r++)
			for (let c = 0; c < C; c++) {
				const k = `${r},${c}`;
				border[k] = {
					t: cellSet.has(k) && !cellSet.has(`${r - 1},${c}`),
					b: cellSet.has(k) && !cellSet.has(`${r + 1},${c}`),
					l: cellSet.has(k) && !cellSet.has(`${r},${c - 1}`),
					r: cellSet.has(k) && !cellSet.has(`${r},${c + 1}`),
				};
			}

		const SIZE = 34; // 한 칸 크기(px)

		return (
				<div
						style={{
							display: "grid",
							gridTemplateRows: `repeat(${R}, ${SIZE}px)`,
							gridTemplateColumns: `repeat(${C}, ${SIZE}px)`,
							background: "#86b36b",
							width: C * SIZE,
						}}
				>
					{Array.from({ length: R * C }, (_, idx) => {
						const r = Math.floor(idx / C);
						const c = idx % C;
						const k = `${r},${c}`;
						const b = border[k];
						return (
								<div
										key={k}
										style={{
											boxSizing: "border-box",
											borderTop: b.t ? "4px solid #7b491e" : "1px solid #6a9653",
											borderBottom: b.b ? "4px solid #7b491e" : "1px solid #6a9653",
											borderLeft: b.l ? "4px solid #7b491e" : "1px solid #6a9653",
											borderRight: b.r ? "4px solid #7b491e" : "1px solid #6a9653",
											fontSize: 22,
											textAlign: "center",
											lineHeight: `${SIZE - 2}px`,
										}}
								>
									{animalSet.has(k) ? "🐾" : ""}
								</div>
						);
					})}
				</div>
		);
	};

	const [rowsInput, setRowsInput] = useState(
			"......\n...a..\n..a...\n.a...."
	);
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");

	const handleSolve = () => {
		try {
			const rows = rowsInput
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean);
			if (!rows.length) throw new Error("격자를 입력해 주세요.");
			if (!rows.every((r) => r.length === rows[0].length))
				throw new Error("모든 행의 길이가 동일해야 합니다.");
			if (!rows.some((r) => r.includes("a")))
				throw new Error("'a'가 한 개 이상 필요합니다.");

			setResult({ rows, ...solveFence(rows) });
			setError("");
		} catch (e) {
			setError(e.message);
			setResult(null);
		}
	};

	return (
			<div>
				<h2>문제 3.울타리 설치하기</h2>
				<h3>목표</h3>
				<div>농장의 동물을 보호하기 위해 울타리를 설치하려 합니다. 농장은 격자로 표현됩니다.<br/>
					각 동물들은 격자 칸에 위치하며 움직이지 않습니다.<br/>
					모든 동물들을 포함하고 내부가 최소한의 면적이 되도록 울타리를 설치했을 때, 울타리 내부의 면적을 구하세요.<br/>
					울타리는 반드시 하나로 이어져 있어야 합니다.</div>
				<br/>

				<p>동물의 위치 선정 (a는 동물의 위치, .은 빈 공간으로 가정한다. 아래 예시 참조)</p>
				<textarea
						rows={6}
						cols={40}
						style={{ fontFamily: "monospace" }}
						value={rowsInput}
						onChange={(e) => setRowsInput(e.target.value)}
				/>
				<br />
				<button onClick={handleSolve} style={{ marginTop: 8 }}>
					계산하기
				</button>

				{error && <p style={{ color: "crimson" }}>{error}</p>}

				{result && (
						<div style={{ marginTop: 20 }}>
							<p>
								최소 울타리 내부 면적:&nbsp;
								<strong>{result.area}</strong>
							</p>
							<FenceGrid
									rows={result.rows}
									cells={result.cells}
									animalPts={result.animalPts}
							/>
						</div>
				)}
			</div>
	);
}