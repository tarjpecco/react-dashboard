import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { actions as authActions, getAuthError, getAuthLoading } from '../../redux/ducks/auth';

import logoImg from '../../assets/media/logo-frontpage.png';

class SignUp extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			invite_id: null,
			input_invite_id: '',
			username: '',
			first_name: '',
			last_name: '',
			password: '',
			confirm_password: '',
			email: '',
			phone: '',
			role: 'sub',
			agreed: false,
			agreeError: false,
		};
	}

	componentWillMount() {
		const { invite_id } = queryString.parse(this.props.location.search);
		if (invite_id) {
			this.setState({ invite_id });
		}
	}

	componentDidUpdate(prevProps) {
		const { authLoading, error, history } = this.props;
		if (!error && !authLoading && prevProps.authLoading) history.push('/dashboard')
	}

	wrapper = (element) => {
		return (
			<div>
				<div id="page-container">
					<main id="main-container">
						<div className="bg-image">
							<div className="row no-gutters justify-content-center bg-black-75">
								<div className="hero-static col-md-6 d-flex align-items-center bg-white">
									<div className="p-3 w-100">
										<div className="mb-3 text-center">
											<Link className="link-fx font-w700 font-size-h1" to="/">
												<img
													src={logoImg}
													style={{ width: 200 }}
													alt="logo"
												/>
											</Link>
											<p className="text-uppercase font-w700 font-size-sm text-muted">
												Create New Account
											</p>
										</div>

										<div className="row no-gutters justify-content-center">
											<div className="col-sm-8 col-xl-6">
												{element}
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
											<i className="fa fa-fw fa-times"/>
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
	};

	handleInviteInputChange = (input_invite_id) => this.setState({ input_invite_id });
	onInviteIdButtonClick = () => {
		this.props.history.replace(`/signup/?invite_id=${ this.state.input_invite_id }`);
		this.setState({ invite_id: this.state.input_invite_id });
	};

	renderNoInvite = () => {
		const error = (
			<div>
				<div className="alert alert-danger">
					<h3 className="alert-heading font-size-h4 my-2">Error</h3>
					<p className="mb-0">couldn't get invite id</p>
				</div>
				<div className="form-group">
					<div className="input-group">
						<div className="input-group-prepend">
							<span className="input-group-text">invite ID</span>
						</div>
						<input
							type="text"
							className="form-control"
							value={this.state.input_invite_id}
							onChange={(e) => this.handleInviteInputChange(e.target.value)}
						/>
						<div className="input-group-append">
							<button className="btn btn-primary ml-0 mr-0" onClick={() => this.onInviteIdButtonClick()}>
								Go
							</button>
						</div>
					</div>
				</div>
			</div>
		);
		return this.wrapper(error);
	};

	get signUpData() {
		const { error } = this.props;
		return [
			{
				property: 'username',
				type: 'text',
				value: this.state.username,
				placeholder: 'Username',
				error: error && error['username'] ? error['username'] : null
			},
			{
				property: 'first_name',
				type: 'text',
				value: this.state.first_name,
				placeholder: 'First name',
				error: error && error['first_name'] ? error['first_name'] : null
			},
			{
				property: 'last_name',
				type: 'text',
				value: this.state.last_name,
				placeholder: 'Last name',
				error: error && error['last_name'] ? error['last_name'] : null
			},
			{
				property: 'password',
				type: 'password',
				value: this.state.password,
				placeholder: 'Password',
				error: error && error['password'] ? error['password'] : null
			},
			{
				property: 'confirm_password',
				type: 'password',
				value: this.state.confirm_password,
				placeholder: 'Confirm password',
				error: error && error['confirm_password'] ? error['confirm_password'] : null
			},
			{
				property: 'email',
				type: 'text',
				value: this.state.email,
				placeholder: 'Email',
				error: error && error['email'] ? error['email'] : null
			},
			{
				property: 'phone',
				type: 'text',
				value: this.state.phone,
				placeholder: 'Phone',
				error: error && error['phone'] ? error['phone'] : null
			},
		]
	}

	get properties() {
		const data = this.signUpData;
		return data.map((item) => item.property);
	}

	onAgreeClick = () => this.setState({
		agreed: !this.state.agreed,
		agreeError: (!this.state.agreed && this.state.agreeError) ? false : this.state.agreeError,
	});

	onFormSubmit = (e) => {
		e.preventDefault();
		const {
			invite_id,
			username,
			first_name,
			last_name,
			password,
			confirm_password,
			email,
			phone,
			role,
		} = this.state;

		const newUserData = {
			invite_id,
			username,
			first_name,
			last_name,
			password,
			confirm_password,
			email,
			phone,
			role,
		};

		if (this.state.agreed) {
			this.props.signUp(newUserData);
		}
		else {
			this.setState({ agreeError: true });
		}
	};

	handleInputChange = (property, value) => this.setState({ [property]: value });

	renderInput = (item, index) => (
		<div className="form-group" key={index}>
			{
				item.error &&
				<span className="text-danger float-right">{item.error[0]}</span>
			}
			<input
				type={item.type}
				className={`form-control form-control-lg form-control-alt ${ item.error && 'is-invalid' }`}
				placeholder={item.placeholder}
				value={item.value}
				onChange={(e) => this.handleInputChange(item.property, e.target.value)}
			/>
		</div>
	);

	renderSignUp = () => {
		const properties = this.properties;
		const { error } = this.props;
		const showError = error && Object.keys(error).some((key) => !properties.includes(key));
		const table = (
			<form
				className="js-validation-signup"
				onSubmit={(e) => this.onFormSubmit(e)}
			>
				<div className="py-3">
					{
						this.signUpData.map((item, index) => this.renderInput(item, index))
					}
					<div className="form-group">
						<div className="custom-control custom-checkbox custom-control-primary">
							<input
								type="checkbox"
								className={`custom-control-input ${ this.state.agreeError && 'is-invalid' }`}
								checked={this.state.agreed}
								onChange={() => null}
							/>
							<label
								className="custom-control-label"
								htmlFor="signup-terms"
								onClick={() => this.onAgreeClick()}
							>
								I agree to Terms &amp; Conditions
							</label>
						</div>
						{
							showError &&
							<div className="alert alert-danger mt-2">
								{
									Object.keys(error).map((err, index) => {
										if (properties.includes(err)) return null;
										return (
											<span key={index}>{error[err][0]}<br/></span>
										);
									})
								}
							</div>
						}
					</div>
				</div>
				<div className="form-group">
					<button
						type="submit"
						className="btn btn-block btn-hero-lg btn-hero-success ml-0"
					>
						<i className="fa fa-fw fa-plus mr-1"/>{' '}
						Sign Up
					</button>
					<p className="mt-3 mb-0 d-lg-flex justify-content-lg-between">
						<Link
							className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
							to="/"
						>
							<i className="fa fa-sign-in-alt text-muted mr-1"/>{' '}
							Sign In
						</Link>
						{/* eslint-disable-next-line */}
						<Link
							className="btn btn-sm btn-light d-block d-lg-inline-block mb-1"
							to="#"
							data-toggle="modal"
							data-target="#modal-terms"
						>
							<i className="fa fa-book text-muted mr-1"/>{' '}
							Read Terms
						</Link>
					</p>
				</div>
			</form>
		);
		return this.wrapper(table);
	};

	render() {
		if (!this.state.invite_id) return this.renderNoInvite();

		return this.renderSignUp();
	}
}

const mapStateToProps = (state) => ({
	error: getAuthError(state),
	authLoading: getAuthLoading(state),
});
const mapActionToProps = (dispatch) => ({
	signUp: (payload) => {
		dispatch(authActions.signup_request(payload));
	},
});

export default connect(mapStateToProps, mapActionToProps)(SignUp);
