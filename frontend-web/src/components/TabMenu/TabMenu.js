import React from 'react';
import { uid } from "react-uid";
import './TabMenu.css';
import { withRouter } from "react-router-dom";

class TabMenu extends React.Component {
	state = {
		selected: 'Home',
		tabs: [
			'Home',
			'Favourites',
			// 'Settings',
			'My Posts',
			'Explore',
			'Sign Out'
		]
	}

	changeToHome = () => {
		this.setState({ selected: 'Home' });

		this.props.store.setCurrentView('Home')
	}

	tabClicked = (tab) => {
		tab = tab.target.innerText

		if (tab === 'Sign Out') {
			sessionStorage.removeItem('kcs_session')
			this.props.store.session = null
			this.props.history.push('/')
			return
		}

		this.setState({ selected: tab });

		this.props.store.setCurrentView(tab)
		this.props.store.updateFeeds();
	}

	componentDidMount() {
		this.props.store.changeTab = this.changeToHome;
	}

	render() {
		return (
		<div className="TabMenu dark-grey light-grey-text">
			<h1>
				KCShare
			</h1>
			
			{
				this.state.tabs.map((tab) => (
					<div key={ uid(tab) } onClick={ this.tabClicked } className={'Tab rounded ' + (this.state.selected === tab ? 'mid-grey selected' : 'dark-grey')}>
						{ tab }
					</div>
				))
			}
		</div>
	)}
};

export default withRouter(TabMenu);
