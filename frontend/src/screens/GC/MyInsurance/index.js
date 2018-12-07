import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneDeep, mapValues } from 'lodash';
import * as moment from 'moment';

import {
	actions as policiesAction,
	getPoliciesSelector
} from '../../../redux/ducks/policies';
import {
	actions as invitesAction,
} from '../../../redux/ducks/invites';
import {
	getUserSelector
} from '../../../redux/ducks/user';
import Table from '../../../components/Table';
import './index.scss';
import { getIdFromUrl } from '../../../utils';

const customStyles = {
	content: {
		top: '60%',
		left: '60%',
		transform: 'translate(-60%, -60%)',
		height: 450,
	},
};

const customStyles2 = {
	content: {
		top: '60%',
		left: '60%',
		transform: 'translate(-60%, -60%)',
		height: 190,
	},
};

class MyInsurance extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			coiModalIsOpen: false,
			showInvitationForm: false,
			invitation: {
				email: '',
				type: '',
			},
			newPolicy: {
				type: 'GL',
				number: '',
				renewal_date: '',
			},
			inValid: {
				email: false,
				file: false,
				number: false,
				renewal_date: false,
			}
		};
		const { listPolicies } = props;
		listPolicies();
	}

	componentDidMount() {
		Modal.setAppElement('body');
	}

	openModal = () => {
		this.setState({ modalIsOpen: true, });
	}

	closeModal = () => {
		this.setState({ 
			modalIsOpen: false,
			inValid: {},
			newPolicy: {
				type: 'GL',
				number: '',
				renewal_date: '',
			},
			invitation: {},
			showInvitationForm: false });
	}

	openCOIModal = () => {
		this.setState({ coiModalIsOpen: true });
	}

	closeCOIModal = () => {
		this.setState({ coiModalIsOpen: false });
	}

	validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
	}

	changeInviteEmail = (e) => {
		const { invitation } = this.state;
		invitation.email = e.target.value;
		this.setState({ invitation });
	}

	sendInvite = () => {
		const { createInvite } = this.props;
		const {
			invitation,
			inValid,
			newPolicy,
		} = this.state;

		let isInvalid = false;
		const newInvitation = cloneDeep(invitation);
		if (!this.validateEmail(newInvitation.email)) {
			inValid.email = true;
			inValid.errorMessage = 'Invalid Email';
			isInvalid = true;
		}
		newInvitation.type = newPolicy.type;
		if (isInvalid) {
			this.setState({ inValid });
		} else {
			this.closeModal();
			const formData = new FormData();
			mapValues(newInvitation, (value, key) => {
				formData.append(key, value);
			});
			formData.append('user_type', 'agent');
			createInvite(formData);
		}
	}

	addNewPolicy = () => {
		const { createPolicy, user } = this.props;
		const {
			newPolicy,
			inValid,
		} = this.state;
		const formData = new FormData();
		let isInValid = false;
		const newInValid = cloneDeep(inValid);
		formData.append('file', this.file.files[0]);
		mapValues(newPolicy, (value, key) => {
			formData.append(key, value);
			if (value === '' || value === 'Invalid Date') {
				newInValid[key] = true;
				isInValid = true;
			}
		});
		if (isInValid) {
			this.setState({ inValid: newInValid });
		} else {
			this.closeModal();
			const sub = [];
			sub.push(user.url);
			formData.append('sub', sub);
			formData.append('status', 'add_new');
			formData.append('company', user.company.url);
			createPolicy(formData);
		}
	}

	changePolicyType = (e) => {
		const { newPolicy } = this.state;
		const policy = cloneDeep(newPolicy);
		policy.type = e.target.value;
		this.setState({ newPolicy: policy });
	}

	datepickerChanged = () => {
		const { newPolicy } = this.state;
		setTimeout(() => {
			const policy = cloneDeep(newPolicy);
			/* eslint-disable-next-line */
			const value = this.refs.renewalDatePicker && this.refs.renewalDatePicker.value;
			policy.renewal_date = moment(value).format('YYYY-MM-DD');
			this.setState({ newPolicy: policy });
		}, 300);
	}

	onChangeHandler = (prop, value) => {
		const { newPolicy } = this.state;
		const reg = /^\d+$/;
		if (value === '' || reg.test(value)) {
			const policy = cloneDeep(newPolicy);
			policy[prop] = value;
			this.setState({ newPolicy: policy });
		}
	}

	render() {
		const { modalIsOpen, showInvitationForm, inValid, invitation, newPolicy, coiModalIsOpen } = this.state;
		const { policies } = this.props;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								GC My Insurance
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.openModal}
							>
								+ Add New Policy
							</button>
							<button type="button" className="btn btn-dark" onClick={this.openCOIModal}>
								Send My COI
							</button>
						</div>
					</div>
				</div>
				<div className="content">
					<Table tableName="" tableStyle="">
						<thead className="thead-light">
							<tr>
								<th className="text-center table-width-20">Agent/Broker name</th>
								<th className="text-center table-width-15">Policy type</th>
								<th className="text-center table-width-15">Policy number</th>
								<th className="text-center table-width-20">Renewal Date</th>
								<th className="text-center table-width-15">Status</th>
								<th className="text-center table-width-25" />
							</tr>
						</thead>
						<tbody>
							{policies.map((policy, index) => (
								<tr className="text-center" key={index}>
									<td>
										<p className="text-info">{(policy.agent[0] && policy.agent[0].first_name + policy.agent[0].last_name) || 'Self uploaded'}</p>
									</td>
									<td>{policy.type}</td>
									<td>{policy.number}</td>
									<td>{moment(policy.renewal_date).format('MM/DD/YYYY')}</td>
									<td>
										<span className="badge badge-success">{policy.status}</span>
									</td>
									<td>
										<Link to={`/insurance/${getIdFromUrl(policy.url)}`}>
											<button type="button" className="btn btn-primary">
												View or Edit{' '}
											</button>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
				{modalIsOpen ?
					<Modal
						isOpen={modalIsOpen}
						onAfterOpen={this.afterOpenModal}
						onRequestClose={this.closeModal}
						style={customStyles}
						contentLabel="Example Modal"
					>
						<div className="mt-4">
							<center>
								<h3>Select Policy type(s) you would like to add:</h3>
							</center>
						</div>
						<form method="post" encType="multipart/form-data" id="create_policy_form" >
							<div className="form-group wrap">
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										id="example-radios-inline1"
										name="example-radios-inline"
										value="GL"
										defaultChecked
										onClick={this.changePolicyType}
									/>
									GL
								</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										id="example-radios-inline2"
										name="example-radios-inline"
										value="WC"
										onClick={this.changePolicyType}
									/>
									WC
								</div>
								<div className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										id="example-radios-inline3"
										name="example-radios-inline"
										value="DBL"
										onClick={this.changePolicyType}
									/>
									DBL
								</div>
							</div>
							<input
								type="file"
								ref={(ref) => { this.file = ref; }}
								onChange={this.addNewPolicy}
								style={{ display: 'none' }}
							/>
						</form>
						<br />
						<div className="form-group">
							<input
								type="text"
								value={newPolicy.number}
								className={`form-control ${inValid.number ? 'is-invalid' : ''}`}
								onChange={e => this.onChangeHandler('number', e.target.value)}
								placeholder="Number"
							/>
							{inValid.number && <div className="invalid-feedback animated fadeIn">Required</div>}
						</div>
						<div className="form-group">
							<input
								type="text"
								/* eslint-disable-next-line */
								ref="renewalDatePicker"
								className={`js-datepicker form-control ${inValid.renewal_date && 'is-invalid'}`}
								name="datepicker1"
								data-week-start="1"
								data-autoclose="true"
								data-today-highlight="true"
								data-date-format="mm/dd/yyyy"
								onBlur={this.datepickerChanged}
								placeholder="Expiration Date"
							/>
							{inValid.renewal_date && <div className="invalid-feedback animated fadeIn">Required</div>}
						</div>
						<center>
							<h3>Who will upload the document(s)?</h3>
						</center>
						<div className="wrap">
							<button
								type="button"
								className="btn btn-success"
								onClick={() => this.file && this.file.click()}
							>
								Upload Myself
							</button>
							<button
								type="button"
								className="btn btn-success"
								onClick={() => this.setState({ showInvitationForm: !showInvitationForm })}
							>
								Link My agent
							</button>
						</div>
						{showInvitationForm && 
							<div className="text-center mt-3 mb-3 mr-5 ml-5">
								<div className="invite-form">
									<input type="email"
										onChange={this.changeInviteEmail}
										value={invitation.email}
										className={`invite-mail form-control ${inValid.errorMessage && 'is-invalid'}`}
									/>
									<button
										type="button"
										className="btn btn-primary invite-submit"
										onClick={this.sendInvite}
									>
										Send Invitation
									</button>
								</div>
								{inValid.errorMessage &&
									<div id="error" className="invalid-feedback animated fadeIn">
										{inValid.errorMessage}
									</div>
								}
							</div>
						}
					</Modal>
				: null}
				{coiModalIsOpen ?
					<Modal
						isOpen={coiModalIsOpen}
						onAfterOpen={() => {}}
						onRequestClose={this.closeCOIModal}
						style={customStyles2}
						contentLabel="COI Modal"
					>
						<center>
							<h2>Send My COI</h2>
						</center>
						<div className="text-center mt-3 mb-3 mr-5 ml-5">
							<div className="invite-form">
								<input type="email"
									onChange={this.changeInviteEmail}
									value={invitation.email}
									className={`invite-mail form-control ${inValid.errorMessage && 'is-invalid'}`}
								/>
								<button
									type="button"
									className="btn btn-primary invite-submit"
									onClick={this.closeCOIModal}
								>
									Send
								</button>
							</div>
							{inValid.errorMessage &&
								<div id="error" className="invalid-feedback animated fadeIn">
									{inValid.errorMessage}
								</div>
							}
						</div>
					</Modal>
				: null}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	policies: getPoliciesSelector(state),
	user: getUserSelector(state),
});

const mapDispatchToProps = dispatch => ({
	createPolicy: params => dispatch(policiesAction.create_policy(params)),
	listPolicies: () => dispatch(policiesAction.get_policies()),
	createInvite: params => dispatch(invitesAction.create_invite(params)),
})

MyInsurance.propTypes = {
	policies: PropTypes.array,
	user: PropTypes.object.isRequired,
	createPolicy: PropTypes.func.isRequired,
	createInvite: PropTypes.func.isRequired,
	listPolicies: PropTypes.func.isRequired,
};

MyInsurance.defaultProps = {
	policies: [],
}
export default connect(mapStateToProps, mapDispatchToProps)(MyInsurance);
