import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signInAction } from '../../redux/ducks/auth';

import logoImg from '../../assets/media/logo-frontpage.png';
import { getAddress } from '../../api';

class LogIn extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};
		this.onChangeHandler.bind(this);
		getAddress();
	}

	onChangeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const { username, password } = this.state;
		const { signIn, history } = this.props;
		return (
			<div id="page-container">
				<main id="main-container">
					<div className="bg-image">
						<div className="row no-gutters bg-primary-op">
							<div className="hero-static col-md-6 d-flex align-items-center bg-white">
								<div className="p-3 w-100">
									<div className="mb-3 text-center">
										<a className="link-fx font-w700 font-size-h1" href="/">
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
												action="/dashboard"
												method="post"
											>
												<div className="py-3">
													<div className="form-group">
														<input
															type="text"
															className="form-control form-control-lg form-control-alt"
															id="login-username"
															name="username"
															placeholder="Username"
															onChange={this.onChangeHandler}
															value={username}
														/>
													</div>
													<div className="form-group">
														<input
															type="password"
															className="form-control form-control-lg form-control-alt"
															id="login-password"
															name="password"
															placeholder="Password"
															onChange={this.onChangeHandler}
															value={password}
														/>
													</div>
												</div>
												<div className="form-group">
													<button
														type="button"
														className="btn btn-block btn-hero-lg btn-hero-primary"
														onClick={() => {
															signIn({
																username,
																password,
															});
															history.push('/dashboard');
														}}
													>
														<i className="fa fa-fw fa-sign-in-alt mr-1" />{' '}
														Sign In
													</button>

													<p className="mt-3 mb-0 d-lg-flex justify-content-lg-between">
														<a
															className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
															href="/authreminder"
														>
															<i className="fa fa-exclamation-triangle text-muted mr-1" />{' '}
															Forgot password
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
const mapStateToProps = () => ({});
const mapActionToProps = dispatch => ({
	signIn: params => {
		dispatch(signInAction(params));
	},
});

const { func, object } = PropTypes;
LogIn.propTypes = {
	signIn: func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	history: object.isRequired,
};

export default connect(
	mapStateToProps,
	mapActionToProps
)(LogIn);
