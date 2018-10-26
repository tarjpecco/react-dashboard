import React from 'react';
import logoImg from '../../assets/media/logo.png';
import './index.scss';

// eslint-disable-next-line react/prefer-stateless-function
class Sidebar extends React.Component {
	render() {
		return (
			<nav id="sidebar">
				<div className="simplebar-scroll-content">
					<div className="simplebar-content">
						<div className="bg-header-dark">
							<div className="content-header bg-white-10">
								<a className="link-fx font-w600 font-size-lg text-white" href="/">
									<span className="smini-hidden">
										<span className="text-white-75">
											<img src={logoImg} style={{ width: 120 }} alt="logo" />
										</span>
									</span>
								</a>
							</div>
						</div>
						<div className="content-side content-side-full">
							<ul className="nav-main">
								<li className="nav-main-item">
									<a className="nav-main-link active" href="/dashboard">
										<i className="nav-main-link-icon si si-cursor" />
										<span className="nav-main-link-name">Dashboard</span>
									</a>
								</li>
								<li className="nav-main-item">
									<a className="nav-main-link" href="/projects">
										<i className="nav-main-link-icon si si-rocket" />
										<span className="nav-main-link-name">Projects</span>
									</a>
								</li>
								<li className="nav-main-item">
									<a className="nav-main-link" href="/team">
										<i className="nav-main-link-icon si si-cup" />
										<span className="nav-main-link-name">Team</span>
									</a>
								</li>
								<li className="nav-main-item">
									<a className="nav-main-link" href="/insurance">
										<i className="nav-main-link-icon si si-shield" />
										<span className="nav-main-link-name">
											My insurance info
										</span>
									</a>
								</li>
								<li className="nav-main-item">
									<a className="nav-main-link" href="/billing">
										<i className="nav-main-link-icon si si-doc" />
										<span className="nav-main-link-name">Billing</span>
									</a>
								</li>
								<li className="nav-main-item">
									<a className="nav-main-link" href="settings">
										<i className="nav-main-link-icon si si-settings" />
										<span className="nav-main-link-name">
											Profile and settings
										</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default Sidebar;
