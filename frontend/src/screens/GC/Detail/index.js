import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { orderBy, cloneDeep, mapValues, isEmpty } from 'lodash';

import Modal from 'react-modal';
import Table from '../../../components/Table';
import Proposal from '../../../components/Proposal';
import {
	actions as jobActions,
	getJobsSelector
} from '../../../redux/ducks/jobs';
import {
	getUserSelector,
	actions as userActions,
} from '../../../redux/ducks/user';
import { API_URL } from '../../../api';
import { getIdFromUrl } from '../../../utils';

import './index.scss';

const customStyles = {
	content: {
		top: '40%',
		left: '50%',
		transform: 'translate(-50%, -40%)',
	},
};

class Detail extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		listJobs: PropTypes.func.isRequired,
		createJob: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired,
		getUserInfo: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
		this.projectId = props.match.params.id;

		this.state = {
			clicked: 'rfq',
			modalIsOpen: false,
			bids: [],
			isInValid: {
				trade_type: false,
				expected_start_date: false,
				expected_end_date: false,
			},
			newJob: {
				trade_type: '',
				expected_start_date: '',
				expected_end_date: '',
				estimated_end_date: moment(new Date()).format('YYYY-MM-DD'),
			}
		};

		const { user, getUserInfo } = props;
		if (isEmpty(user)) {
			getUserInfo();
		}
	}

	componentDidMount() {
		Modal.setAppElement('body');
		const { listJobs } = this.props;
		const { clicked } = this.state;
		listJobs({ id: this.projectId, status: clicked });
	}

	componentWillReceiveProps(newProps) {
		const { jobList } = newProps;
		jobList.forEach(job => {
			job.id = getIdFromUrl(job.url);
			job.expected_end_date = moment(job.expected_end_date).format('MM/DD/YYYY');
			job.expected_start_date = moment(job.expected_start_date).format('MM/DD/YYYY');
			job.showdetail = false;
		})
		const bids = orderBy(jobList, ['id'],['asc']);
		this.setState({ bids });
	}

	onClickTabHandler = tabname => {
		this.setState({ [tabname]: 'nav-link active' });
	};

	onClickDetail = id => {
		const { bids } = this.state;
		const temp = bids;
		temp[id].showdetail = !temp[id].showdetail;
		this.setState({ bids: temp });
	};

	openModal = () => {
		this.setState({ modalIsOpen: true });
	}

	closeModal = () => {
		const	newJob = {
			trade_type: '',
			expected_start_date: '',
			expected_end_date: '',
		}
		this.setState({ modalIsOpen: false, isInValid: {}, newJob });
	}

	tabChanged = (status) => {
		const { listJobs } = this.props;
		listJobs({ id: this.projectId, status });
		this.setState({ clicked: status });
	}

	datepickerChanged = (dateType) => {
		const { newJob, isInValid } = this.state;
		setTimeout(() => {
			const job = cloneDeep(newJob);
			const inValid = cloneDeep(isInValid);
			if (dateType === 'expected_start_date') {
				job.expected_start_date = this.expectedStartDateEle &&
					moment(this.expectedStartDateEle.value).format('YYYY-MM-DD');
				inValid.expected_start_date = false;
			}
			if (dateType === 'expected_end_date') {
				job.expected_end_date = this.expectedEndDateEle &&
					moment(this.expectedEndDateEle.value).format('YYYY-MM-DD');
				inValid.expected_end_date = false;
			}
			this.setState({ newJob: job, isInValid: inValid });
		}, 300);
	}

	onNewJobPropChange = (prop, value) => {
		const { newJob, isInValid } = this.state;
		const newIsInValid = cloneDeep(isInValid);
		newJob[prop] = value;
		if (value !== '') {
			newIsInValid[prop] = false;
		}
		this.setState({
			newJob,
			isInValid: newIsInValid,
		});
	}

	addNewJob = () => {
		const {
			newJob,
			isInValid,
			clicked
		} = this.state;
		const newIsInValid = cloneDeep(isInValid);
		let invalid = false;
		mapValues(newJob, (value, key) => {
			if (value === '') {
				newIsInValid[key] = true;
				invalid = true;
			}
		});
		if (this.file.files[0] === undefined) {
			invalid = true;
			/* eslint-disable-next-line */
			window.alert('Please upload PFQ/P!');
		}
		if (!invalid) {
			this.closeModal();
			const { createJob, user } = this.props;
			const formData = new FormData();
			mapValues(newJob, (value, key) => {
				formData.append(key, value);
			});
			formData.append('file', this.file.files[0]);
			formData.append('status', clicked);
			formData.append('user', user.url);
			formData.append('project', `${API_URL}/projects/${this.projectId}/`);
			createJob(formData);
		} else {
			this.setState({ isInValid: newIsInValid });
		}
	}

	render() {
		const { bids, clicked, modalIsOpen, isInValid, newJob } = this.state;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Projects
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.openModal}
							>
								+ Add RFQ
							</button>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="block block-rounded block-bordered">
						<ul
							className="nav nav-tabs nav-tabs-block"
							data-toggle="tabs"
							role="tablist"
						>
							<li className="nav-item">
								<Link
									to="#"
									className={classnames('nav-link', {
										active: clicked === 'rfq',
									})}
									onClick={() => this.tabChanged('rfq')}
								>
									RFQ in progress
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="#"
									className={classnames('nav-link', {
										active: clicked === 'in_progress',
									})}
									onClick={() => this.tabChanged('in_progress')}
								>
									Job in progress
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="#"
									className={classnames('nav-link', {
										active: clicked === 'archived',
									})}
									onClick={() => this.tabChanged('archived')}
								>
									Archived jobs
								</Link>
							</li>
						</ul>
						<div className="block-content tab-content">
							<div
								className={classnames('tab-pane', {
									active: clicked === 'rfq',
								})}
								role="tabpanel"
							>
								<Table tableStyle="" tableName="">
									<thead className="thead-light">
										<tr>
											<th className="text-left table-width-20">RFQ#</th>
											<th className="text-left table-width-20">Trade type</th>
											<th className="text-left table-width-20">RFQ Doc</th>
											<th className="text-left table-width-20">Due date</th>

											<th className="text-left table-width-10">status</th>
											<th />
										</tr>
									</thead>
									<tbody>
										{bids.map((item, id) =>
											[
											// eslint-disable-next-line
												<React.Fragment key={id}>
													<tr className="text-left">
														<td>
															<p>{item.id}</p>
														</td>
														<td>
															<p className="text-info">
																{item.trade_type}
															</p>
														</td>
														<td>
															<Link to="/projectdetail">
																<button
																	type="button"
																	className="btn btn-primary"
																>
																	Download
																</button>
															</Link>
														</td>
														<td>
															<p>{item.expected_end_date}</p>
														</td>
														<td>
															<span className="badge badge-warning">
																{'Bid in progress'}
															</span>
														</td>
														<td className="text-right">
															<button
																type="button"
																onClick={() => this.onClickDetail(id)}
															>
																{!bids[id].showdetail && (
																	<i className="far fa-arrow-alt-circle-down" />
																)}
																{bids[id].showdetail && (
																	<i className="far fa-arrow-alt-circle-up" />
																)}
															</button>
														</td>
													</tr>
													<tr
														className={classnames({
															hidden: !bids[id].showdetail,
														})}
													>
														<td colSpan="6">
															<Proposal tableName="ABC Construction Company, Inc.">
																<tbody>
																	<tr className="text-left">
																		<td className="table-width-20">
																			<p className="text-info">
																				Contact name
																			</p>
																		</td>
																		<td
																			className="table-width-80"
																			colSpan="3"
																		>
																			<p>Name Surname</p>
																		</td>
																	</tr>
																	<tr className="text-left">
																		<td className="table-width-20">
																			<p className="text-info">
																				Address
																			</p>
																		</td>
																		<td
																			className="table-width-80"
																			colSpan="3"
																		>
																			<p>
																				123 Main street NY,NY
																				1001
																			</p>
																		</td>
																	</tr>
																	<tr className="text-left">
																		<td className="table-width-20">
																			<p className="text-info">
																				Phone
																			</p>
																		</td>
																		<td>
																			<p>555-444-555</p>
																		</td>
																	</tr>
																	<tr className="text-left">
																		<td className="table-width-20">
																			<p className="text-info">
																				EIN #
																			</p>
																		</td>
																		<td>
																			<p>61-512584</p>
																		</td>
																	</tr>
																	<tr className="text-left">
																		<td>
																			<p className="text-info">
																				License number
																			</p>
																		</td>
																		<td className="table-width-30">
																			Type
																		</td>
																		<td className="table-width-30">
																			Number
																		</td>
																		<td
																			className="table-width-40"
																			colSpan="2"
																		>
																			Expiredate
																		</td>
																	</tr>
																</tbody>
															</Proposal>
														</td>
													</tr>
												</React.Fragment>
											]
										)}
									</tbody>
								</Table>
							</div>
							<div
								className={classnames('tab-pane', {
									active: clicked === 'in_progress',
								})}
								role="tabpanel"
							>
								<Table tableStyle="" tableName="">
									<thead className="thead-light">
										<tr>
											<th className="text-left table-width-5">RFQ#</th>
											<th className="text-left table-width-20">Sub name</th>
											<th className="text-left table-width-20">Trade type</th>
											<th className="text-left table-width-25">
												Estimated date
											</th>

											<th className="text-center table-width-30">
												Current compliance
											</th>
											<th />
										</tr>
									</thead>
									<tbody>
										{bids.map((item, id) => (
											// eslint-disable-next-line
											<tr key={id} className="text-left">
												<td>
													<p>{item.id}</p>
												</td>
												<td>
													<p className="text-info">{item.sub_name || ''}</p>
												</td>
												<td>
													<p>{item.trade_type}</p>
												</td>

												<td>
													<p>{item.expected_end_date}</p>
												</td>
												<td className="text-center wrap">
													<span className="badge badge-success">GL</span>
													<span className="badge badge-danger">WC</span>
													<span className="badge badge-warning">DB</span>
												</td>
												<td className="text-right">
													<button type="button">
														<i className="far fa-arrow-alt-circle-down" />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
							<div
								className={classnames('tab-pane', {
									active: clicked === 'archived',
								})}
								id="btabs-archived"
								role="tabpanel"
							>
								<Table tableStyle="" tableName="">
									<thead className="thead-light">
										<tr>
											<th className="text-left table-width-5">RFQ#</th>
											<th className="text-left table-width-20">Sub name</th>
											<th className="text-left table-width-20">Trade type</th>
											<th className="text-left table-width-25">
												Completion date
											</th>
											<th />
										</tr>
									</thead>
									<tbody>
										{bids.map((item, id) => (
											// eslint-disable-next-line
											<tr key={id} className="text-left">
												<td>
													<p>{item.id}</p>
												</td>
												<td>
													<p className="text-info">{item.sub_name || ''}</p>
												</td>
												<td>
													<p>{item.trade_type}</p>
												</td>

												<td>
													<p>{item.expected_end_date}</p>
												</td>
												<td className="text-right">
													<button type="button">
														<i className="far fa-arrow-alt-circle-down" />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</div>
					</div>
				</div>
				<Modal
					isOpen={modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<h2>Add An RFQ/P</h2>

					<form className="mb-5" method="post" encType="multipart/form-data" id="create_job_form" >
						<div className="form-group">
							Trade Type
							<input
								type="text"
								value={newJob.trade_type}
								placeholder="Trade Type"
								className={`form-control ${isInValid.trade_type ? 'is-invalid' : ''}`}
								name="trade_type"
								id="project"
								onChange={e => this.onNewJobPropChange('trade_type', e.target.value)}
							/>
							{isInValid.trade_type && <div className="invalid-feedback">Required</div>}
						</div>
						<div className="form-group">
							Expected Start Date
							<input
								type="text"
								ref={(ref) => { this.expectedStartDateEle = ref; }}
								className={`js-datepicker form-control ${isInValid.expected_start_date ? 'is-invalid' : ''}`}
								name="expected_start_date"
								data-week-start="1"
								data-autoclose="true"
								data-today-highlight="true"
								data-date-format="mm/dd/yyyy"
								onBlur={() => this.datepickerChanged('expected_start_date')}
								placeholder="mm/dd/yyyy"
							/>
							{isInValid.expected_start_date && <div className="invalid-feedback">Required</div>}
						</div>
						<div className="form-group">
							Expected Completion
							<input
								type="text"
								ref={(ref) => { this.expectedEndDateEle = ref; }}
								className={`js-datepicker form-control ${isInValid.expected_end_date ? 'is-invalid' : ''}`}
								name="expected_end_date"
								data-week-start="1"
								data-autoclose="true"
								data-today-highlight="true"
								data-date-format="mm/dd/yyyy"
								onBlur={() => this.datepickerChanged('expected_end_date')}
								placeholder="mm/dd/yyyy"
							/>
							{isInValid.expected_end_date && <div className="invalid-feedback">Required</div>}
						</div>
						<div className="form-group">
							Expected Budget
							<div className="input-group">
								<div className="input-group-prepend">
									<span className="input-group-text">$</span>
								</div>
								<input
									type="text"
									className="form-control text-center"
									id="example-group1-input3"
									name="budget"
									placeholder="00"
								/>
								<div className="input-group-append">
									<span className="input-group-text">,00</span>
								</div>
							</div>
						</div>
						<input
							type="hidden"
							name="status"
							value={clicked}
						/>
						<input
							type="file"
							ref={(ref) => { this.file = ref; }}
							style={{ visibility: 'hidden' }}
						/>
					</form>
					<button type="button" className="btn btn-success" onClick={() => this.file && this.file.click()}>
						Upload RFQ/P
					</button>
					<button type="button" className="btn btn-success" onClick={this.addNewJob}>
						Submit
					</button>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	jobList: getJobsSelector(state),
	user: getUserSelector(state),
});

const mapDispatchToProps = dispatch => ({
	listJobs: params => dispatch(jobActions.get_jobs(params)),
	createJob: params => dispatch(jobActions.create_job(params)),
	getUserInfo: () => dispatch(userActions.get_user()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
