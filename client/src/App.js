import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
function App() {
	return (
		<div className="container">
			<Routes>
      <Route
					exact
					path="/"
					element={<Login />}
				/>
				<Route
					exact
					path="/home"
					element={<Home />}
				/>
				<Route
					exact
					path="/login"
					element={<Login />}
				/>
				<Route
					exact
					path="/todo"
					element={<Todo />}
				/>
				<Route
					path="/signup"
					element={<Signup />}
				/>
			</Routes>
		</div>
	);
}

export default App;

