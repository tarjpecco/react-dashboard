import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
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
import { API_URL } from '../../../api';
import Table from '../../../components/Table';
import './index.scss';

const customStyles = {
	content: {
		top: '60%',
		left: '60%',
		transform: 'translate(-60%, -60%)',
		height: 450,
	},
};

class MyInsurance extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			showInvitationForm: false,
			invitation: {
				email: '',
				project: [],
				job: [],
			},
			newPolicy: {
				type: 'GL',
				number: 12345678,
				company: `${API_URL}/companies/1/`,
				renewal_date: moment(new Date()).format('YYYY-MM-DD'),
			},
			inValid: {
				email: false,
				file: false,
			}
		};
		const { listPolicies } = props;
		listPolicies();
	}

	componentDidMount() {
		Modal.setAppElement('body');
	}

	openModal = () => {
		this.setState({ modalIsOpen: true });
	}

	closeModal = () => {
		this.setState({ modalIsOpen: false, inValid: {}, invitation: {}, showInvitationForm: false });
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
		const { createInvite, user } = this.props;
		const {
			invitation,
			inValid,
		} = this.state;

		let isInvalid = false;
		if (!this.validateEmail(invitation.email)) {
			inValid.email = true;
			inValid.errorMessage = 'Invalid Email';
			isInvalid = true;
		}
		if (isInvalid) {
			this.setState({ inValid });
		} else {
			this.closeModal();
			const formData = new FormData();
			mapValues(invitation, (value, key) => {
				formData.append(key, value);
			});
			formData.append('type', user.role);
			createInvite(formData);
		}
	}

	addNewPolicy = () => {
		const { createPolicy, user } = this.props;
		const {
			newPolicy,
		} = this.state;
		this.closeModal();
		const formData = new FormData();
		mapValues(newPolicy, (value, key) => {
			formData.append(key, value);
		});
		const sub = [];
		sub.push(user.url);
		formData.append('sub', sub);
		createPolicy(formData);
	}

	changePolicyType = (e) => {
		const { newPolicy } = this.state;
		const policy = cloneDeep(newPolicy);
		policy.type = e.target.value;
		this.setState({ newPolicy: policy });
	}

	render() {
		const { modalIsOpen, showInvitationForm, inValid, invitation } = this.state;
		const { policies } = this.props;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Sub My Insurance
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.openModal}
							>
								+ Add New Policy
							</button>
							<button type="button" className="btn btn-dark">
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
										<p className="text-info">{policy.agent_name || ''}</p>
									</td>
									<td>{policy.type}</td>
									<td>{policy.number}</td>
									<td>{moment(policy.renewal_date).format('MM/DD/YYYY')}</td>
									<td>
										<span className="badge badge-success">Active</span>
									</td>
									<td>
										<button type="button" className="btn btn-primary">
											View or Edit{' '}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
				<Modal
					isOpen={modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<center>
						<h2>Select Policy type(s) you would like to add:</h2>
					</center>

					<form method="post" encType="multipart/form-data" id="create_policy_form" >
						<div className="form-group wrap">
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									id="example-radios-inline1"
									name="example-radios-inline"
									value="GL"
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
					<br />
					<center>
						<h2>Who will upload the document(s)?</h2>
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
