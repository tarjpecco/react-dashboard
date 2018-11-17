import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import Table from '../../../components/Table';
import {
	getProjectsAction,
	getProjectsSelector
} from '../../../redux/ducks/projects';

import './index.scss';

const customStyles = {
	content: {
		top: '30%',
		left: '50%',
		transform: 'translate(-50%, -30%)',
	},
};

class Projects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		Modal.setAppElement('body');
	}

	openModal() {
		this.setState({ modalIsOpen: true });
	}

	closeModal() {
		this.setState({ modalIsOpen: false });
	}

	render() {
		const { modalIsOpen } = this.state;
		const { projectList } = this.props;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								GC Projects
							</h1>
							<button
								type="button"
								className="btn btn-primary"
								onClick={this.openModal}
							>
								+ Add a Project
							</button>
						</div>
					</div>
				</div>
				<div className="content">
					<Table tableName="" tableStyle="" editable="disable">
						<thead className="thead-light">
							<tr className="text-left">
								<th className="table-width-25">Project name</th>
								<th className="table-width-25">Project address</th>
								<th className="table-width-15">Active subs</th>
								<th className="table-width-15">Compliance risks</th>
								<th className="table-width-15">Status</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{projectList.map((item, id) => (
								// eslint-disable-next-line
								<tr key={id} className="text-left">
									<td>
										<p className="text-info">{item.name}</p>
									</td>
									<td>{item.address}</td>
									<td>{item.countOfSubs}</td>
									<td>
										<p className="badge badge-pill badge-danger">
											{item.risks}
										</p>
									</td>
									<td>
										<span className="badge badge-warning">{item.status}</span>
									</td>
									<td className="text-right">
										<Link
											to={{
												pathname: '/projectdetail',
												state: { projectId: item.id },
											}}
										>
											<button type="button" className="btn btn-primary">
												Go
											</button>
										</Link>
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
					<h2>Add a New Project</h2>

					<form className="mb-5">
						<div className="form-group">
							Project Name
							<input
								type="text"
								placeholder="Project Name"
								className="form-control"
								id="project"
							/>
						</div>
						<div className="form-group">
							Address
							<input
								type="text"
								placeholder="Address"
								className="form-control"
								id="address"
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
					<button type="button" className="btn btn-success" onClick={this.closeModal}>
						Submit
					</button>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	projectList: getProjectsSelector(state)
});

const mapDispatchToProps = dispatch => ({
	listProjects: () => dispatch(getProjectsAction()),
})

Projects.propTypes = {
	projectList: PropTypes.array,
};

Projects.defaultProps = {
	projectList: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
