import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSideBar } from '../../redux/actions/global';

const Header = ({ toggleAction }) => {
	return (
		<header id="page-header">
			<div className="content-header">
				<div>
					<button
						onClick={toggleAction}
						type="button"
						className="btn btn-dual mr-1"
						data-toggle="layout"
						data-action="sidebar_toggle"
					>
						<i className="fa fa-fw fa-bars" />
					</button>
				</div>
				<div>
					<button type="button" className="btn btn-dual" data-toggle="layout">
						<i className="si si-call-out" />
						<span className="badge badge-pill">1( 855 )Flexcomply</span>
					</button>
					<div className="dropdown d-inline-block">
						<button
							type="button"
							className="btn btn-dual"
							id="page-header-notifications-dropdown"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<i className="fa fa-fw fa-bell" />
							<span className="badge badge-secondary badge-pill">5</span>
						</button>
						<div
							className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"
							aria-labelledby="page-header-notifications-dropdown"
						>
							<div className="bg-primary-darker rounded-top font-w600 text-white text-center p-3">
								Notifications
							</div>
							<ul className="nav-items my-2">
								<li>
									{/* eslint-disable-next-line */}
									<a className="text-dark media py-2">
										<div className="mx-3">
											<i className="fa fa-fw fa-check-circle text-success" />
										</div>
										<div className="media-body font-size-sm pr-2">
											<div className="font-w600">
												App was updated to v5.6!
											</div>
											<div className="text-muted font-italic">3 min ago</div>
										</div>
									</a>
								</li>
								<li>
									{/* eslint-disable-next-line */}
									<a className="text-dark media py-2">
										<div className="mx-3">
											<i className="fa fa-fw fa-user-plus text-info" />
										</div>
										<div className="media-body font-size-sm pr-2">
											<div className="font-w600">
												New Subscriber was added! You now have 2580!
											</div>
											<div className="text-muted font-italic">10 min ago</div>
										</div>
									</a>
								</li>
								<li>
									{/* eslint-disable-next-line */}
									<a className="text-dark media py-2">
										<div className="mx-3">
											<i className="fa fa-fw fa-times-circle text-danger" />
										</div>
										<div className="media-body font-size-sm pr-2">
											<div className="font-w600">
												Server backup failed to complete!
											</div>
											<div className="text-muted font-italic">30 min ago</div>
										</div>
									</a>
								</li>
								<li>
									{/* eslint-disable-next-line */}
									<a className="text-dark media py-2">
										<div className="mx-3">
											<i className="fa fa-fw fa-exclamation-circle text-warning" />
										</div>
										<div className="media-body font-size-sm pr-2">
											<div className="font-w600">
												You are running out of space. Please consider
												upgrading your plan.
											</div>
											<div className="text-muted font-italic">1 hour ago</div>
										</div>
									</a>
								</li>
								<li>
									{/* eslint-disable-next-line */}
									<a className="text-dark media py-2">
										<div className="mx-3">
											<i className="fa fa-fw fa-plus-circle text-primary" />
										</div>
										<div className="media-body font-size-sm pr-2">
											<div className="font-w600">New Sale! + $30</div>
											<div className="text-muted font-italic">
												2 hours ago
											</div>
										</div>
									</a>
								</li>
							</ul>
							<div className="p-2 border-top">
								{/* eslint-disable-next-line */}
								<a className="btn btn-light btn-block text-center">
									<i className="fa fa-fw fa-eye mr-1" /> View All
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const mapStateToProps = () => ({});
const mapActionToProps = dispatch => ({
	toggleAction: () => {
		dispatch(toggleSideBar());
	},
});

const { func } = PropTypes;
Header.propTypes = {
	toggleAction: func.isRequired,
};

export default connect(
	mapStateToProps,
	mapActionToProps
)(Header);
