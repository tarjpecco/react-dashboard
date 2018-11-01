import React from 'react';
import Table from '../../../components/Table';
import './index.scss';

class Team extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			members: [],
		};
		this.onAddMember.bind(this);
		this.onDeleteMember.bind(this);
		this.handleChange.bind(this);
		this.onEnableEditMember.bind(this);
	}

	onAddMember = () => {
		const newelement = {
			name: 'John Smith',
			email: 'jsmith@construction.com',
			classnames: 'disabled',
		};
		this.setState(prevState => ({
			members: [...prevState.members, newelement],
		}));
	};

	onDeleteMember = id => {
		const { members } = this.state;
		const array = [...members];
		array.splice(id, 1);
		this.setState({ members: array });
	};

	handleChange = id => e => {
		const { value } = e.target;
		const { members } = this.state;
		const array = [...members];
		if (e.target.name === 'name') array[id].name = value;
		if (e.target.name === 'email') array[id].email = value;
		this.setState({ members: array });
	};

	onEnableEditMember = id => {
		const { members } = this.state;
		const array = [...members];
		array[id].classnames = '';
		this.setState({ members: array });
	};

	render() {
		const { members } = this.state;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								GC My Team
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.onAddMember}
							>
								+ Add a Member
							</button>
						</div>
					</div>
				</div>
				<div className="content team">
					<Table tableName="">
						<thead className="thead-light">
							<tr>
								<th className="width-40">Name</th>
								<th className="width-30">Email</th>

								<th className="text-center width-30" />
							</tr>
						</thead>
						<tbody>
							{members.map((item, id) => (
								// eslint-disable-next-line
								<tr className="text-center" key={id}>
									<td className="font-w600">
										<input
											type="text"
											name="name"
											className="text-info"
											value={item.name}
											disabled={item.classnames}
											onChange={this.handleChange(id)}
										/>
									</td>
									<td className="d-none d-sm-table-cell">
										<input
											type="text"
											name="email"
											value={item.email}
											disabled={item.classnames}
											onChange={this.handleChange(id)}
										/>
									</td>
									<td className="text-center">
										<div className="btn-group">
											<button
												type="button"
												className="btn btn-sm btn-primary js-tooltip-enabled"
												data-toggle="tooltip"
												data-original-title="Edit"
												onClick={() => this.onEnableEditMember(id)}
											>
												<i className="fa fa-pencil-alt" />
											</button>
											<button
												type="button"
												className="btn btn-sm btn-primary js-tooltip-enabled"
												data-toggle="tooltip"
												data-original-title="Delete"
												onClick={() => this.onDeleteMember(id)}
											>
												<i className="far fa-trash-alt" />
											</button>
										</div>
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
export default Team;
