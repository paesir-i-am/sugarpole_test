import { NavLink } from "react-router-dom";

const linkStyle = {
	padding: "8px 16px",
	textDecoration: "none",
	borderBottom: "2px solid transparent",
};

const activeStyle = { borderBottomColor: "#228B22", fontWeight: "bold" };

export default function TopNav() {
	// isActive 플래그 활용
	const styleFn = ({ isActive }) =>
			isActive ? { ...linkStyle, ...activeStyle } : linkStyle;

	return (
			<nav style={{ display: "flex", gap: 12, marginBottom: 24 }}>
				<NavLink to="/problem1" style={styleFn}>
					문제 1.자연수 변환
				</NavLink>
				<NavLink to="/problem2" style={styleFn}>
					문제 2.택배 보관함 설치하기
				</NavLink>
				<NavLink to="/problem3" style={styleFn}>
					문제 3.울타리 설치하기
				</NavLink>
			</nav>
	);
}
