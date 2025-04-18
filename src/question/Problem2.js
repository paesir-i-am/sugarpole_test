import React, { useState } from "react";

export default function Problem2() {

	// 함수
	const solveLockers = (rawHouses, k) => {
		const houses = [...rawHouses].sort((a, b) => a - b);
		if (k >= houses.length) {
			// 집마다 하나씩 두면 거리 0
			return { distance: 0, lockers: houses, distArr: Array(houses.length).fill(0) };
		}

		// 가능한 거리 탐색
		let left = 0;
		let right = houses[houses.length - 1] - houses[0];

		const canCover = (D, collectPositions = false) => {
			let used = 0;
			let idx = 0;
			const placed = [];

			while (idx < houses.length && used < k) {
				const start = houses[idx];
				// 보관함은 start + D 이하 중 가장 먼 집에 설치
				let posIdx = idx;
				while (
						posIdx + 1 < houses.length &&
						houses[posIdx + 1] <= start + D
						) {
					posIdx++;
				}
				const lockerPos = houses[posIdx];
				if (collectPositions) placed.push(lockerPos);

				// 이 보관함이 커버하는 끝 지점
				const limit = lockerPos + D;
				while (idx < houses.length && houses[idx] <= limit) idx++;
				used++;
			}
			const success = idx === houses.length;
			return collectPositions ? { success, placed } : success;
		};

		// 1) 최소 거리 탐색
		while (left < right) {
			const mid = Math.floor((left + right) / 2);
			if (canCover(mid)) right = mid;
			else left = mid + 1;
		}
		const minDist = left;

		// 2) 실제 보관함 위치 수집
		const { placed: lockers } = canCover(minDist, true);

		// 3) 각 집까지의 거리 계산
		const distArr = houses.map((h) =>
				Math.min(...lockers.map((l) => Math.abs(h - l)))
		);

		return { distance: minDist, lockers, distArr };
	}; // 함수 끝

	// state 값
	const [housesInput, setHousesInput] = useState("1, 2, 3, 10");
	const [kInput, setKInput] = useState("2");
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");

	const handleSolve = () => {
		try {
			const houses = housesInput
					.split(",")
					.map((s) => Number(s.trim()))
					.filter((n) => !Number.isNaN(n));
			const k = Number(kInput);
			if (houses.length === 0 || k < 1) throw new Error("입력이 올바르지 않습니다.");

			const res = solveLockers(houses, k);
			setResult(res);
			setError("");
		} catch (e) {
			setError(e.message);
			setResult(null);
		}
	};

	return (
			<div>
				<h2>문제 2.택배 보관함 설치하기</h2>
				<h3>목표</h3>
				<div>한 도시에는 여러 개의 집이 일직선 상에 있습니다.<br/>
					각 집에는 사람들이 거주하고 있으며, 이들을 위해 택배 보관함을 설치하려 합니다.<br/>
					하지만 설치 가능한 개수가 한정 되어 있어, 모든 집에 설치할 수는 없습니다.<br/>
					가장 멀리 떨어진 집의 거리가 최소가 되도록 k개의 보관함을 설치하고, 이때 거리의 최댓값을 구해야 합니다.</div>
				<br/>

				<label>
					<span>houses (쉼표로 구분) : </span>
					<input
							type="text"
							value={housesInput}
							onChange={(e) => setHousesInput(e.target.value)}
					/>
				</label>
				<br />
				<label>
					<span>k: </span>
					<input
							type="number"
							value={kInput}
							onChange={(e) => setKInput(e.target.value)}
							min="1"
					/>
				</label>
				<br />

				<button onClick={handleSolve} style={{ marginTop: 12 }}>
					계산하기
				</button>

				{error && <p style={{ color: "crimson" }}>{error}</p>}

				{result && (
						<div style={{ marginTop: 24 }}>
							<p>
								최소 거리: <strong>{result.distance}</strong>
							</p>
							<p>
								보관함 위치: {result.lockers.join(", ")}
							</p>
							<h4>각 집‑보관함 거리</h4>
							<ul>
								{result.distArr.map((d, i) => (
										<li key={i}>
											집 {i + 1} ({result.lockers.length > 0 ? "좌표 " : ""}
											{result.distArr.length && ""}) → 거리 {d}
										</li>
								))}
							</ul>
						</div>
				)}
			</div>
	);
}
