import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TabNav from './TopNav';
import Problem1 from './question/Problem1';
import Problem2 from './question/Problem2';
import Problem3 from './question/Problem3';


export default function App() {
	return (
			<BrowserRouter>
				<div style={{ maxWidth: 800, margin: "40px auto" }}>
					<TabNav />

					<Routes>
						<Route path="/"        element={<Navigate to="/problem1" replace />} />
						<Route path="/problem1" element={<Problem1 />} />
						<Route path="/problem2" element={<Problem2 />} />
						<Route path="/problem3" element={<Problem3 />} />
					</Routes>
				</div>
			</BrowserRouter>
	);
}
