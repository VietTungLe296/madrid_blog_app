import React from 'react'
import styles from '../../css/home/SearchBar.module.css'

function SearchBar({ value, handleSearchKey, clearSearch, formSubmit }) {
	return (
		<div className={styles["searchbar-wrapper"]}>
			<form onSubmit={formSubmit}>
				<input type="text" placeholder="Search by Topic" value={value} onChange={handleSearchKey} />
				{value && <span onClick={clearSearch}>X</span>}
				<button>Search</button>
			</form>
		</div>
	)
}

export default SearchBar
