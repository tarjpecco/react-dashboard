import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Table from '../../../components/Table';
import {
	actions as companiesActions,
	getCompanySelector
} from '../../../redux/ducks/companies';
import './index.scss';

class Details extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			// name: 'Name Surname',
			// address: '123 Main Street NY, NY 10001',
			// phone: '555-555-5555',
			// ein: '61-512584',
			// license: '123 456 789',
			btnname: 'Modify',
			btnicon: 'si si-pencil',
		};
		const { getCompanyInfo, match } = props;
		const agentId = match.params.id;
		getCompanyInfo({ id: agentId });
	}

	handleClickEdit = () => {
		const { editable } = this.state;
		if (editable === 'disable') {
			this.setState({ editable: '' });
			this.setState({ btnname: 'Save' });
			this.setState({ btnicon: 'far fa-save' });
		} else {
			this.setState({ editable: 'disable' });
			this.setState({ btnname: 'Modify' });
			this.setState({ btnicon: 'si si-pencil' });
		}
	};

	handleClickArchive = () => {};

	onChangeHandler = e => {
		const property = e.target.name;
		const value = e.target.value;
		this.setState({ [property]: value });
	};

	render() {
		const { editable, btnname, btnicon } = this.state;
		const { match, companyInfo } = this.props;
		const agentId = match.params.id;
		const { name, phone, address, ein, license } = companyInfo;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Agent clients - {agentId}
							</h1>
							<button
								type="button"
								className="btn btn-primary"
								onClick={this.handleClickEdit}
							>
								<i className={btnicon} /> {btnname}
							</button>
							<button
								type="button"
								className="btn btn-dark"
								onClick={this.handleClickArchive}
							>
								<i className="si si-envelope-letter" /> Archive
							</button>
						</div>
					</div>
				</div>

				<div className="content settings">
					<Table tableName="" tableStyle="table-striped table-bordered">
						<tbody>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Contact name</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="name"
										value={name}
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Address</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="address"
										value={address}
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">Phone</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="phone"
										value={phone}
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td className="table-width-20">
									<p className="text-info">EIN #</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="ein"
										value={ein}
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
							<tr className="text-left">
								<td>
									<p className="text-info">License number</p>
								</td>
								<td className="table-width-80" colSpan="4">
									<input
										type="text"
										name="license"
										value={license || '123 456 789'}
										onChange={this.onChangeHandler}
										disabled={editable}
									/>
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
				<div className="content">
					<Table tableName="Policies" tableStyle="table-striped" editable="disable">
						<thead className="thead-light">
							<tr className="text-left">
								<th className="table-width-25">Policy type</th>
								<th className="table-width-25">Policy number</th>
								<th className="table-width-25">Status</th>
								<th />
							</tr>
						</thead>
						<tbody>
							<tr className="text-left">
								<td>Workers comp</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-primary">New</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
							<tr className="text-left">
								<td>Disability</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-success">Complete</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
							<tr className="text-left">
								<td>General liability</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-warning">Submitted</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
							<tr className="text-left">
								<td>Disability</td>
								<td>XXX</td>
								<td>
									<span className="badge badge-primary">New</span>
								</td>
								<td className="text-right">
									<button type="button" className="btn btn-primary">
										Go
									</button>
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	companyInfo: getCompanySelector(state)
});

const mapDispatchToProps = dispatch => ({
	getCompanyInfo: params => dispatch(companiesActions.get_company(params)),
})

Details.propTypes = {
	companyInfo: PropTypes.object.isRequired,
	getCompanyInfo: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
