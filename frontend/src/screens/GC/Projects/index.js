import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { cloneDeep, isEmpty } from 'lodash';

import Table from '../../../components/Table';
import LocationSearchInput from '../../../components/LocationSearchInput';
import {
	actions as projectActions,
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
	state = {
		newproject: {
			budget: 0,
			name: '',
			startDate: '',
			endDate: '',
			address: {},
			status: 'act',
			company: 1,
		},
		isInValid: {
			name: false,
			address: false,
		},
		modalIsOpen: false,
	}

	componentDidMount() {
		Modal.setAppElement('body');
		const { listProjects } = this.props;
		listProjects();
	}

	openModal = () => {
		this.setState({ modalIsOpen: true });
	}

	closeModal = () => {
		this.setState({ modalIsOpen: false });
	}

	getProjectIdFromUrl = (url) => url.slice(0, -1).split('/').pop();

	addNewProject = () => {
		const {
			newproject,
			isInValid
		} = this.state;
		const newIsInValid = cloneDeep(isInValid);
		let invalid = false;

		if (newproject.name === '') {
			newIsInValid.name = true;
			invalid = true;
		}
		if (isEmpty(newproject.address)) {
			newIsInValid.address = true;
			invalid = true;
		}

		if (!invalid) {
			this.closeModal();
			const { createProject } = this.props;
			createProject(newproject);
		} else {
			this.setState({ isInValid: newIsInValid });
		}
	}

	onNewProjectChange = (prop, value) => {
		const { newproject, isInValid } = this.state;
		const newIsInValid = cloneDeep(isInValid);
		newproject[prop] = value;
		if (prop === 'name' && value !== '') {
			newIsInValid.name = false;
		}
		this.setState({
			newproject,
			isInValid: newIsInValid,
		});
	}

	onAddressChanged = (address) => {
		const { newproject, isInValid } = this.state;
		const project = cloneDeep(newproject);
		project.address = address;
		const newIsInValid = cloneDeep(isInValid);
		if (!isEmpty(address)) {
			newIsInValid.address = false;
		}
		this.setState({
			newproject: project,
			isInValid: newIsInValid 
		});
	}

	datepickerChanged = (dateType) => {
		const { newproject } = this.state;
		setTimeout(() => {
			const project = cloneDeep(newproject);
			if (dateType === 'startdate') {
				project.startDate = this.refs.startDateEleRef.value;
			} else {
				project.endDate = this.refs.endDateEleRef.value;
			}
			this.setState({ newproject: project });
		}, 300);
	}

	render() {
		const { modalIsOpen, newproject, isInValid } = this.state;
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
									<td>{item.address && (`${item.address.line_1} ${item.address.line_2} ${item.address.town} ${item.address.state} ${item.address.zip_code}`)}</td>
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
												pathname: `/projects/${this.getProjectIdFromUrl(item.url)}`,
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
								value={newproject.name}
								placeholder="Project Name"
								className={`form-control ${isInValid.name ? 'is-invalid' : ''}`}
								required
								id="project"
								onChange={e => this.onNewProjectChange('name', e.target.value)}
							/>
							{isInValid.name && <div className="invalid-feedback animated fadeIn">Name is Required</div>}
						</div>
						<div className="form-group">
							Address
							<LocationSearchInput onAddressChanged={this.onAddressChanged} isInValid={isInValid.address}/>
						</div>
						<div className="form-group">
							Expected Start Date
							<input
								type="text"
								ref="startDateEleRef"
								className="js-datepicker form-control"
								name="datepicker1"
								data-week-start="1"
								data-autoclose="true"
								data-today-highlight="true"
								data-date-format="mm/dd/yy"
								onBlur={() => this.datepickerChanged('startdate')}
								placeholder="mm/dd/yy"
							/>
						</div>
						<div className="form-group">
							Expected Completion
							<input
								type="text"
								ref="endDateEleRef"
								className="js-datepicker form-control"
								name="datepicker2"
								data-week-start="1"
								data-autoclose="true"
								data-today-highlight="true"
								data-date-format="mm/dd/yy"
								onBlur={() => this.datepickerChanged('enddate')}
								placeholder="mm/dd/yy"
							/>
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
									value={newproject.budget}
									onChange={e => this.onNewProjectChange('budget', e.target.value)}
								/>
								<div className="input-group-append">
									<span className="input-group-text">,00</span>
								</div>
							</div>
						</div>
					</form>
					<button type="button" className="btn btn-success" onClick={this.addNewProject}>
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
	listProjects: () => dispatch(projectActions.get_projects()),
	createProject: params => dispatch(projectActions.create_project(params)),
})

Projects.propTypes = {
	projectList: PropTypes.array,
	listProjects: PropTypes.func.isRequired,
	createProject: PropTypes.func.isRequired,
};

Projects.defaultProps = {
	projectList: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
