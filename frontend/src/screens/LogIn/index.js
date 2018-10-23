import React from 'react';
import logoImg from '../../assets/media/logo.png';

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
						<div className="row no-gutters bg-primary-op">
							<div className="hero-static col-md-6 d-flex align-items-center bg-white">
								<div className="p-3 w-100">
									<div className="mb-3 text-center">
										<a
											className="link-fx font-w700 font-size-h1"
											href="/dashboard"
										>
											<img src={logoImg} style={{ width: 200 }} alt="logo" />
										</a>
										<p className="text-uppercase font-w700 font-size-sm text-muted">
											Sign In
										</p>
									</div>

									<div className="row no-gutters justify-content-center">
										<div className="col-sm-8 col-xl-6">
											<form
												className="js-validation-signin"
												action="#"
												method="post"
											>
												<div className="py-3">
													<div className="form-group">
														<input
															type="text"
															className="form-control form-control-lg form-control-alt"
															id="login-username"
															name="login-username"
															placeholder="Username"
														/>
													</div>
													<div className="form-group">
														<input
															type="password"
															className="form-control form-control-lg form-control-alt"
															id="login-password"
															name="login-password"
															placeholder="Password"
														/>
													</div>
												</div>
												<div className="form-group">
													<button
														type="submit"
														className="btn btn-block btn-hero-lg btn-hero-primary"
													>
														<i className="fa fa-fw fa-sign-in-alt mr-1" />{' '}
														Sign In
													</button>
													<p className="mt-3 mb-0 d-lg-flex justify-content-lg-between">
														<a
															className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
															href="op_auth_reminder.html"
														>
															<i className="fa fa-exclamation-triangle text-muted mr-1" />{' '}
															Forgot password
														</a>
														<a
															className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
															href="op_auth_signup.html"
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
									<p className="display-4 font-w700 text-white mb-3">
										Welcome to the future
									</p>
									<p className="font-size-lg font-w600 text-white-75 mb-0">
										Copyright &copy; <span className="js-year-copy">2018</span>
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
