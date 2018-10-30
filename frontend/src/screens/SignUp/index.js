import React from 'react';
import logoImg from '../../assets/media/logo-frontpage.png';

class SignUp extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<div id="page-container">
					<main id="main-container">
						<div className="bg-image">
							<div className="row no-gutters justify-content-center bg-black-75">
								<div className="hero-static col-md-6 d-flex align-items-center bg-white">
									<div className="p-3 w-100">
										<div className="mb-3 text-center">
											<a className="link-fx font-w700 font-size-h1" href="/">
												<img
													src={logoImg}
													style={{ width: 200 }}
													alt="logo"
												/>
											</a>
											<p className="text-uppercase font-w700 font-size-sm text-muted">
												Create New Account
											</p>
										</div>

										<div className="row no-gutters justify-content-center">
											<div className="col-sm-8 col-xl-6">
												<form
													className="js-validation-signup"
													action="be_pages_auth_all.html"
													method="post"
												>
													<div className="py-3">
														<div className="form-group">
															<input
																type="text"
																className="form-control form-control-lg form-control-alt"
																id="signup-username"
																name="signup-username"
																placeholder="Username"
															/>
														</div>
														<div className="form-group">
															<input
																type="email"
																className="form-control form-control-lg form-control-alt"
																id="signup-email"
																name="signup-email"
																placeholder="Email"
															/>
														</div>
														<div className="form-group">
															<input
																type="password"
																className="form-control form-control-lg form-control-alt"
																id="signup-password"
																name="signup-password"
																placeholder="Password"
															/>
														</div>
														<div className="form-group">
															<input
																type="password"
																className="form-control form-control-lg form-control-alt"
																id="signup-password-confirm"
																name="signup-password-confirm"
																placeholder="Password Confirm"
															/>
														</div>
														<div className="form-group">
															<div className="custom-control custom-checkbox custom-control-primary">
																<label
																	className="custom-control-label"
																	htmlFor="signup-terms"
																>
																	<input
																		type="checkbox"
																		className="custom-control-input"
																		id="signup-terms"
																		name="signup-terms"
																	/>
																	I agree to Terms &amp;
																	Conditions
																</label>
															</div>
														</div>
													</div>
													<div className="form-group">
														<a href="/dashboard">
															<button
																type="button"
																className="btn btn-block btn-hero-lg btn-hero-success"
															>
																<i className="fa fa-fw fa-plus mr-1" />{' '}
																Sign Up
															</button>
														</a>
														<p className="mt-3 mb-0 d-lg-flex justify-content-lg-between">
															<a
																className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
																href="/"
															>
																<i className="fa fa-sign-in-alt text-muted mr-1" />{' '}
																Sign In
															</a>
															{/* eslint-disable-next-line */}
															<a
																className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
																href="#"
																data-toggle="modal"
																data-target="#modal-terms"
															>
																<i className="fa fa-book text-muted mr-1" />{' '}
																Read Terms
															</a>
														</p>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
				<div
					className="modal fade"
					id="modal-terms"
					tabIndex="-1"
					role="dialog"
					aria-labelledby="modal-terms"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="block block-themed block-transparent mb-0">
								<div className="block-header bg-primary-dark">
									<h3 className="block-title">Terms &amp; Conditions</h3>
									<div className="block-options">
										<button
											type="button"
											className="btn-block-option"
											data-dismiss="modal"
											aria-label="Close"
										>
											<i className="fa fa-fw fa-times" />
										</button>
									</div>
								</div>
								<div className="block-content">
									<p>
										Dolor posuere proin blandit accumsan senectus netus nullam
										curae, ornare laoreet adipiscing luctus mauris adipiscing
										pretium eget fermentum, tristique lobortis est ut metus
										lobortis tortor tincidunt himenaeos habitant quis dictumst
										proin odio sagittis purus mi, nec taciti vestibulum quis in
										sit varius lorem sit metus mi.
									</p>
									<p>
										Dolor posuere proin blandit accumsan senectus netus nullam
										curae, ornare laoreet adipiscing luctus mauris adipiscing
										pretium eget fermentum, tristique lobortis est ut metus
										lobortis tortor tincidunt himenaeos habitant quis dictumst
										proin odio sagittis purus mi, nec taciti vestibulum quis in
										sit varius lorem sit metus mi.
									</p>
									<p>
										Dolor posuere proin blandit accumsan senectus netus nullam
										curae, ornare laoreet adipiscing luctus mauris adipiscing
										pretium eget fermentum, tristique lobortis est ut metus
										lobortis tortor tincidunt himenaeos habitant quis dictumst
										proin odio sagittis purus mi, nec taciti vestibulum quis in
										sit varius lorem sit metus mi.
									</p>
									<p>
										Dolor posuere proin blandit accumsan senectus netus nullam
										curae, ornare laoreet adipiscing luctus mauris adipiscing
										pretium eget fermentum, tristique lobortis est ut metus
										lobortis tortor tincidunt himenaeos habitant quis dictumst
										proin odio sagittis purus mi, nec taciti vestibulum quis in
										sit varius lorem sit metus mi.
									</p>
									<p>
										Dolor posuere proin blandit accumsan senectus netus nullam
										curae, ornare laoreet adipiscing luctus mauris adipiscing
										pretium eget fermentum, tristique lobortis est ut metus
										lobortis tortor tincidunt himenaeos habitant quis dictumst
										proin odio sagittis purus mi, nec taciti vestibulum quis in
										sit varius lorem sit metus mi.
									</p>
								</div>
								<div className="block-content block-content-full text-right bg-light">
									<button
										type="button"
										className="btn btn-sm btn-primary"
										data-dismiss="modal"
									>
										Done
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SignUp;
