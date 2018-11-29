import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	actions as companiesActions,
	getCompaniesSelector
} from '../../../redux/ducks/companies';

import Table from '../../../components/Table';

import './index.scss';

class Clients extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
		};
	}

	componentDidMount() {
		const { listCompanies } = this.props;
		listCompanies({ search: '' });
	}

	onChangeHandler = e => {
		const { target } = e;
		const search = target.value;
		this.setState({ search });
		const { listCompanies } = this.props;
		listCompanies({ name: search.toLowerCase() });
	};

	getIdFromUrl = (url) => url.slice(0, -1).split('/').pop();

	render() {
		const { companyList } = this.props;
		const { search } = this.state;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Agent clients
							</h1>
						</div>
					</div>
				</div>
				<div className="content clients">
					<input
						type="type"
						name="search"
						placeholder="Search Client.."
						value={search}
						onChange={this.onChangeHandler}
					/>
				</div>
				<div className="content clients">
					<Table editable="disable" tableStyle="" tableName="">
						<thead className="thead-light">
							<tr>
								<th className="text-left table-width-50">Company</th>
								<th className="text-center table-width-45">Compliance</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{companyList.map((item, id) => (
								// eslint-disable-next-line
								<tr key={id}>
									<td className="text-left">
										<p className="text-info">{item.name}</p>
									</td>

									<td className="text-center wrap">
										<span className="badge badge-success">GL</span>
										<span className="badge badge-danger">WC</span>
										<span className="badge badge-warning">DB</span>
									</td>
									<td className="text-right">
										<Link
											to={`/clients/${this.getIdFromUrl(item.url)}`}
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
			</div>
		);
	}
}

const mapStateToProps = state => ({
	companyList: getCompaniesSelector(state)
});

const mapDispatchToProps = dispatch => ({
	listCompanies: params => dispatch(companiesActions.get_companies(params)),
})

Clients.propTypes = {
	companyList: PropTypes.array,
	listCompanies: PropTypes.func.isRequired,
};

Clients.defaultProps = {
	companyList: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
