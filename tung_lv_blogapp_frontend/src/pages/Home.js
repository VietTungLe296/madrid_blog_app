import React, { useEffect, useState } from 'react'
import Posts from '../components/home/Posts'
import Header from '../components/home/HomeHeader'
import CreatePostButton from '../components/home/CreatePostButton'
import SearchBar from '../components/home/SearchBar'
import EmptyPage from '../components/common/EmptyPage'
import styles from '../css/home/Home.module.css'
import GoToTopButton from '../components/common/GoToTopButton'
import Navbar from '../components/common/Navbar'
import { Pagination } from 'antd'
import { Footer } from 'antd/es/layout/layout'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Home({ authenticated }) {
	const [posts, setPosts] = useState([])
	const [scroll, setScroll] = useState()
	const [totalPosts, setTotalPosts] = useState(0)
	const navigate = useNavigate()
	const location = useLocation()

	const [page, setPage] = useState(Number(new URLSearchParams(location.search).get('page')) || 1)
	const [keyword, setKeyword] = useState(new URLSearchParams(location.search).get('keyword') || '')

	const handlePageChange = (pageNumber) => {
		setPage(pageNumber)
		if (keyword !== '') {
			navigate(`/posts?page=${pageNumber}&keyword=${keyword.toLowerCase().trim()}`)
		} else {
			navigate(`/posts?page=${pageNumber}`)
		}
	}

	useEffect(() => {
		document.title = 'Homepage'

		const handleScroll = () => setScroll(window.scrollY > 200)
		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		axios
			.get(`http://localhost:9000/v1/posts?page=${page}&keyword=${keyword.toLowerCase().trim()}`)
			.then((response) => {
				setPosts(response.data.posts)
				setTotalPosts(response.data.totalPosts)
			})
	}, [page])

	const handleSearchSubmit = (event) => {
		event.preventDefault()

		axios
			.get(`http://localhost:9000/v1/posts?page=1&keyword=${keyword.toLowerCase().trim()}`)
			.then((response) => {
				setPosts(response.data.posts)
				setTotalPosts(response.data.totalPosts)
				setPage(1)
				navigate(`/posts?page=1&keyword=${keyword.toLowerCase().trim()}`)
			})
	}

	const handleClearSearch = () => {
		axios.get(`http://localhost:9000/v1/posts?page=${page}`).then((response) => {
			setPosts(response.data.posts)
			setTotalPosts(response.data.totalPosts)
			setPage(1)
			navigate(`/posts?page=1`)
		})

		setKeyword('')
	}

	return (
		<div>
			<Navbar />
			<div className={styles['home-container']}>
				<Header />

				<SearchBar
					value={keyword}
					clearSearch={handleClearSearch}
					formSubmit={handleSearchSubmit}
					handleSearchKey={(e) => setKeyword(e.target.value)}
				/>

				{authenticated ? (
					<div className={styles['create-post-btn']}>
						<CreatePostButton />
					</div>
				) : (
					''
				)}

				{totalPosts === 0 || posts.length === 0 ? <EmptyPage /> : <Posts posts={posts} />}

				{scroll && <GoToTopButton />}

				<Pagination
					className={styles['pagination']}
					pageSize={10}
					current={page}
					onChange={handlePageChange}
					total={totalPosts}
					showTotal={(total) => `Total ${total} items`}
					showQuickJumper
				/>
			</div>
			<Footer style={{ textAlign: 'center' }}>©2023 Created by Viet Tung Le</Footer>
		</div>
	)
}

export default Home
