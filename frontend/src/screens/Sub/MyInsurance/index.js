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
import Table from '../../../components/Table';
import './index.scss';

const customStyles = {
	content: {
		top: '60%',
		left: '60%',
		transform: 'translate(-60%, -60%)',
	},
};

class MyInsurance extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			isInValid: {
				type: false,
			},
			newPolicy: {
				name: '',
				type: 'GL',
				number: 12345678,
				renewal_date: new Date(),
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
		this.setState({ modalIsOpen: false });
	}

	addNewPolicy = () => {
		const { createPolicy } = this.props;
		const {
			newPolicy,
			isInValid,
			clicked
		} = this.state;
		const newIsInValid = cloneDeep(isInValid);
		let invalid = false;
		mapValues(newPolicy, (value, key) => {
			if (value === '') {
				newIsInValid[key] = true;
				invalid = true;
			}
		});
		if (this.file.files[0] === undefined) {
			invalid = true;
			window.alert('Please upload Resume!');
		}
		if (!invalid) {
			this.closeModal();
			const formData = new FormData();
			mapValues(newPolicy, (value, key) => {
				formData.append(key, value);
			});
			formData.append('file', this.file.files[0]);
			formData.append('status', clicked);
			createPolicy(formData);
		} else {
			this.setState({ isInValid: newIsInValid });
		}
	}

	changePolicyType = (e) => {
		const { newPolicy } = this.state;
		const policy = cloneDeep(newPolicy);
		policy.type = e.target.value;
		this.setState({ newPolicy: policy });
	}

	render() {
		const { modalIsOpen } = this.state;
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
					<Table tableName="policies_list" tableStyle="">
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
							<tr className="text-center">
								<td>
									<p className="text-info">Agent 123</p>
								</td>
								<td>GL</td>
								<td>12345678</td>
								<td>12/12/2019</td>
								<td>
									<span className="badge badge-success">Active</span>
								</td>
								<td>
									<button type="button" className="btn btn-primary">
										View or Edit{' '}
									</button>
								</td>
							</tr>
							<tr className="text-center">
								<td>
									<p className="text-info">Broker 234</p>
								</td>
								<td>WC</td>
								<td>134567824</td>
								<td>1/1/2018</td>
								<td>
									<span className="badge badge-danger">Expired</span>
								</td>
								<td>
									<button type="button" className="btn btn-primary">
										View or Edit{' '}
									</button>
								</td>
							</tr>
							{policies.map((policy, index) => (
								<tr className="text-center" key={index}>
									<td>
										<p className="text-info">{policy.name}</p>
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
							style={{ visibility: 'hidden' }}
						/>
					</form>
					<br />
					<br />
					<center>
						<h2>Who will upload the document(s)?</h2>
					</center>
					<div className="wrap">
						<button type="button" className="btn btn-success" onClick={() => this.file && this.file.click()}>
							Upload Myself
						</button>
						<button type="button" className="btn btn-success" onClick={this.addNewPolicy}>
							Link My agent
						</button>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	policies: getPoliciesSelector(state)
});

const mapDispatchToProps = dispatch => ({
	createPolicy: params => dispatch(policiesAction.create_policy(params)),
	listPolicies: () => dispatch(policiesAction.get_policies()),
})

MyInsurance.propTypes = {
	policies: PropTypes.array,
	createPolicy: PropTypes.func.isRequired,
	listPolicies: PropTypes.func.isRequired,
};

MyInsurance.defaultProps = {
	policies: [],
}
export default connect(mapStateToProps, mapDispatchToProps)(MyInsurance);
