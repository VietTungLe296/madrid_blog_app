import React from 'react'
import { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import './css/App.css'
import SinglePost from './pages/SinglePost'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import Login from './pages/Login'
import Logout from './components/user/Logout'
import Register from './pages/Register'
import UserPosts from './pages/UserPosts'
import EditPost from './pages/EditPost'
function App() {
	const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('user') !== null)
	return (
		<div>
			<Routes>
				<Route
					path="/login"
					element={
						authenticated ? (
							<Navigate to="/posts" replace />
						) : (
							<Login setAuthenticated={setAuthenticated} />
						)
					}
				/>

				<Route
					path="/register"
					element={
						authenticated ? (
							<Navigate to="/posts" replace />
						) : (
							<Register setAuthenticated={setAuthenticated} />
						)
					}
				/>

				<Route
					path="/logout"
					element={
						authenticated ? (
							<Logout setAuthenticated={setAuthenticated} />
						) : (
							<Navigate to="/posts" replace />
						)
					}
				/>

				<Route
					path="/posts/create"
					element={
						authenticated ? (
							<CreatePost setAuthenticated={setAuthenticated} />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>

				<Route path="/posts" element={<Home authenticated={authenticated} />} />
				<Route path="/posts/:id" element={<SinglePost authenticated={authenticated} />} />

				<Route
					path="/user/posts"
					element={authenticated ? <UserPosts /> : <Navigate to="/login" replace />}
				/>

				<Route
					path="/posts/:id/edit"
					element={authenticated ? <EditPost /> : <Navigate to="/login" replace />}
				/>

				<Route path="/" element={<Navigate to="/posts" replace />} />
				<Route path="*" element={<Navigate to="/posts" replace />} />
			</Routes>
		</div>
	)
}

export default App
