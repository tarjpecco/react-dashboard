import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../components/Table';

import './index.scss';

class Clients extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clientList: ['Roofing', 'Electric', 'Plumbing', 'Exterior'],
			filteredList: ['Roofing', 'Electric', 'Plumbing', 'Exterior'],
			filter: '',
		};
	}

	onChangeHandler = e => {
		const { target } = e;
		const name = target.name;
		const value = target.value;
		this.setState({ [name]: value });

		const { clientList } = this.state;
		const array = [];
		clientList.forEach(item => {
			if (item.includes(value)) array.push(item);
		});
		this.setState({ filteredList: array });
	};

	render() {
		const { filteredList } = this.state;
		const { filter } = this.state;
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
						name="filter"
						placeholder="Search Client.."
						value={filter}
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
							{filteredList.map((item, id) => (
								// eslint-disable-next-line
								<tr key={id}>
									<td className="text-left">
										<p className="text-info">{item}</p>
									</td>

									<td className="text-center wrap">
										<span className="badge badge-success">GL</span>
										<span className="badge badge-danger">WC</span>
										<span className="badge badge-warning">DB</span>
									</td>
									<td className="text-right">
										<Link
											to={{
												pathname: '/agentdetail',
												state: { agentId: item },
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
			</div>
		);
	}
}
export default Clients;
