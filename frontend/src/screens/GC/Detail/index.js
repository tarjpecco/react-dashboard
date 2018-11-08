import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Modal from 'react-modal';
import Table from '../../../components/Table';
import Proposal from '../../../components/Proposal';

import './index.scss';

const customStyles = {
	content: {
		top: '40%',
		left: '50%',
		transform: 'translate(-50%, -40%)',
	},
};

class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clicked: 'rfq',

			bids: [
				{
					id: '1',
					subId: 'ABC Plumbing',
					project_Id: '0',
					tradeType: 'Plumbing',
					due_date: '12/01/2018',
					status: 'bid in progress',
					bid: '',
					COI_file: '',
					proposal_file: '',
					compliance: { '0': 'WC', '1': 'GL', '2': 'Disability' },
					showdetail: false,
				},
				{
					id: '2',
					subId: 'ABC Construction',
					project_Id: '0',
					due_date: '12/01/2018',
					tradeType: 'Electrical',
					status: 'bid in progress',
					bid: '',
					COI_file: '',
					proposal_file: '',
					compliance: { '0': 'WC', '1': 'GL', '2': 'Disability' },
					showdetail: false,
				},
			],
			modalIsOpen: false,
		};

		this.onClickTabHandler.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		Modal.setAppElement('body');
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

	openModal() {
		this.setState({ modalIsOpen: true });
	}

	closeModal() {
		this.setState({ modalIsOpen: false });
	}

	render() {
		const { bids, clicked, modalIsOpen } = this.state;

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
									to="/projectdetail"
									className={classnames('nav-link', {
										active: clicked === 'rfq',
									})}
									onClick={() => this.setState({ clicked: 'rfq' })}
								>
									RFQ in progress
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/projectdetail"
									className={classnames('nav-link', {
										active: clicked === 'job',
									})}
									onClick={() => this.setState({ clicked: 'job' })}
								>
									Job in progress
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/projectdetail"
									className={classnames('nav-link', {
										active: clicked === 'archived',
									})}
									onClick={() => this.setState({ clicked: 'archived' })}
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
											// eslint-disable-next-line
											[
												<tr className="text-left">
													<td>
														<p>{item.id}</p>
													</td>
													<td>
														<p className="text-info">
															{item.tradeType}
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
														<p>{item.due_date}</p>
													</td>
													<td>
														<span className="badge badge-warning">
															{item.status}
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
												</tr>,
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
												</tr>,
											]
										)}
									</tbody>
								</Table>
							</div>
							<div
								className={classnames('tab-pane', {
									active: clicked === 'job',
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
													<p className="text-info">{item.subId}</p>
												</td>
												<td>
													<p>{item.tradeType}</p>
												</td>

												<td>
													<p>{item.due_date}</p>
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
													<p className="text-info">{item.subId}</p>
												</td>
												<td>
													<p>{item.tradeType}</p>
												</td>

												<td>
													<p>{item.due_date}</p>
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

					<form className="mb-5">
						<div className="form-group">
							Trade Type
							<input
								type="text"
								placeholder="Project Name"
								className="form-control"
								id="project"
							/>
						</div>
						<div className="form-group">
							Expected Start Date
							<input type="text" className="form-control" placeholder="dd/mm/yyyy" />
						</div>
						<div className="form-group">
							Expected Completion
							<input type="text" className="form-control" placeholder="dd/mm/yyyy" />
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
									name="example-group1-input3"
									placeholder="00"
								/>
								<div className="input-group-append">
									<span className="input-group-text">,00</span>
								</div>
							</div>
						</div>
					</form>
					<button type="button" className="btn btn-success">
						Upload RFQ/P
					</button>
					<button type="button" className="btn btn-success" onClick={this.closeModal}>
						Submit
					</button>
				</Modal>
			</div>
		);
	}
}

export default Detail;
