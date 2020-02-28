import React from 'react';
import { uid } from "react-uid";
import './MyPosts.css';

class MyPosts extends React.Component {
	state = {}

	render() {
		return (
		<div className={ 'MyPosts dark-grey light-grey-text ' + (this.props.wide ? 'thin' : '') }>
			My Posts
		</div>
	)}
};

export default MyPosts;