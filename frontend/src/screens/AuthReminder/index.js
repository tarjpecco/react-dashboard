import React from 'react';
import logoImg from '../../assets/media/logo-frontpage.png';

class LogIn extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div id="page-container">
				<main id="main-container">
					<div className="bg-image">
						<div className="row no-gutters bg-gd-sun-op">
							<div className="hero-static col-md-6 d-flex align-items-center bg-white">
								<div className="p-3 w-100">
									<div className="text-center">
										<a className="link-fx font-w700 font-size-h1" href="/">
											<img src={logoImg} style={{ width: 200 }} alt="logo" />
										</a>
										<p className="text-uppercase font-w700 font-size-sm text-muted">
											Password Reminder
										</p>
									</div>

									<div className="row no-gutters justify-content-center">
										<div className="col-sm-8 col-xl-6">
											<form
												className="js-validation-reminder"
												action="be_pages_auth_all.html"
												method="post"
											>
												<div className="form-group py-3">
													<input
														type="text"
														className="form-control form-control-lg form-control-alt"
														id="reminder-credential"
														name="reminder-credential"
														placeholder="Username or Email"
													/>
												</div>
												<div className="form-group text-center">
													<button
														type="submit"
														className="btn btn-block btn-hero-lg btn-hero-warning"
													>
														<i className="fa fa-fw fa-reply mr-1" />{' '}
														Password Reminder
													</button>
													<p className="mt-3 mb-0 d-lg-flex justify-content-lg-between">
														<a
															className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
															href="/"
														>
															<i className="fa fa-sign-in-alt text-muted mr-1" />{' '}
															Sign In
														</a>
														<a
															className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
															href="/signup"
														>
															<i className="fa fa-plus text-muted mr-1" />{' '}
															New Account
														</a>
													</p>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
							<div className="hero-static col-md-6 d-none d-md-flex align-items-md-center justify-content-md-center text-md-center">
								<div className="p-3">
									<p className="display-4 font-w700 text-white mb-0">
										Don’t worry of failure..
									</p>
									<p className="font-size-h1 font-w600 text-white-75 mb-0">
										..but learn from it!
									</p>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}
}

export default LogIn;
