import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import logoImg from '../../assets/media/logo.png';
import './index.scss';

// eslint-disable-next-line react/prefer-stateless-function
class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { location, username } = this.props;
		const path = location.pathname;
		return (
			<nav id="sidebar">
				<div className="simplebar-scroll-content">
					<div className="simplebar-content">
						<div className="bg-header-dark">
							<div className="content-header bg-white-10">
								<a className="link-fx font-w600 font-size-lg text-white" href="/">
									<span className="smini-hidden">
										<span className="text-white-75">
											<img src={logoImg} style={{ width: 170 }} alt="logo" />
										</span>
									</span>
								</a>
							</div>
						</div>
						<div className="content-side content-side-full">
							<ul className="nav-main">
								<li className="nav-main-item">
									<Link
										to="/dashboard"
										className={classnames('nav-main-link', {
											active: path === '/dashboard',
										})}
									>
										<i className="nav-main-link-icon si si-cursor" />
										<span className="nav-main-link-name">Dashboard</span>
									</Link>
								</li>
								{username === 'gc' && (
									<li className="nav-main-item">
										<Link
											to="/projects"
											className={classnames('nav-main-link', {
												active: path === '/projects',
											})}
										>
											<i className="nav-main-link-icon si si-rocket" />
											<span className="nav-main-link-name">Projects</span>
										</Link>
									</li>
								)}
								{username !== 'agent' && (
									<li className="nav-main-item">
										<Link
											to="/insurance"
											className={classnames('nav-main-link', {
												active: path === '/insurance',
											})}
										>
											<i className="nav-main-link-icon si si-shield" />
											<span className="nav-main-link-name">My insurance</span>
										</Link>
									</li>
								)}
								{username === 'gc' && (
									<li className="nav-main-item">
										<Link
											to="/team"
											className={classnames('nav-main-link', {
												active: path === '/team',
											})}
										>
											<i className="nav-main-link-icon si si-cup" />
											<span className="nav-main-link-name">Team</span>
										</Link>
									</li>
								)}
								{username === 'gc' && (
									<li className="nav-main-item">
										<Link
											to="/billing"
											className={classnames('nav-main-link', {
												active: path === '/billing',
											})}
										>
											<i className="nav-main-link-icon si si-doc" />
											<span className="nav-main-link-name">Billing</span>
										</Link>
									</li>
								)}
								{username === 'agent' && (
									<li className="nav-main-item">
										<Link
											to="/clients"
											className={classnames('nav-main-link', {
												active: path === '/billing',
											})}
										>
											<i className="nav-main-link-icon si si-doc" />
											<span className="nav-main-link-name">Clients</span>
										</Link>
									</li>
								)}
								<li className="nav-main-item">
									<Link
										to="/settings"
										className={classnames('nav-main-link', {
											active: path === '/settings',
										})}
									>
										<i className="nav-main-link-icon si si-settings" />
										<span className="nav-main-link-name">
											Profile and settings
										</span>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
const mapStateToProps = state => ({
	username: state.ducks.username,
	password: state.ducks.password,
});

const { object, string } = PropTypes;
Sidebar.propTypes = {
	location: object.isRequired,
	username: string.isRequired,
};

export default connect(mapStateToProps)(Sidebar);
