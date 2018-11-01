import React from 'react';
import Table from '../../../components/Table';
import './index.scss';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: {
				agency: ['Agency', 'disabled'],
				address: ['One Apple Park Way Cupertino,CA 95014', 'disabled'],
				phone: ['+1( 800 )2344565, +1( 800 )2344565', 'disabled'],
				name: ['Name Surname', 'disabled'],
				email: ['email@gmail.com', 'disabled'],
				license: ['123 456 789', 'disabled'],
			},
		};
		this.Save.bind(this);
		this.handleChange.bind(this);
		this.onEnableEditMember.bind(this);
	}

	handleChange = e => {
		const { values } = this.state;
		const temp = values;
		const { name, value } = e.target;
		temp[name][0] = value;
		this.setState({ values: temp });
	};

	onEnableEditMember = id => {
		const { values } = this.state;
		const value = values[id];
		value[1] = '';
		this.setState({
			values: {
				...values,
				[id]: value,
			},
		});
	};

	uploadLicense = () => {};

	Save = () => {
		const { values } = this.state;
		const temp = values;

		temp.agency[1] = 'disable';
		temp.address[1] = 'disable';
		temp.phone[1] = 'disable';
		temp.name[1] = 'disable';
		temp.email[1] = 'disable';
		temp.license[1] = 'disable';
		this.setState({ values: temp });
	};

	render() {
		const { values } = this.state;
		const { agency, address, phone, name, email, license } = values;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Agent settings
							</h1>
						</div>
					</div>
				</div>
				<div className="content settings">
					<Table tableName="" tableStyle="table-striped table-bordered">
						<tbody>
							<tr>
								<td className="font-w600 text-info">Agency name</td>
								<td className="table-width-100 wrap">
									<input
										type="text"
										name="agency"
										value={agency[0]}
										disabled={agency[1]}
										onChange={this.handleChange}
										ref={this.textInput}
									/>

									<div className="btn-group">
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											data-original-title="Edit"
											onClick={() => {
												this.onEnableEditMember('agency');
											}}
										>
											<i className="fa fa-pencil-alt" />
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="font-w600 text-info">Address</td>
								<td className="table-width-100 wrap">
									<input
										type="text"
										name="address"
										value={address[0]}
										disabled={address[1]}
										onChange={this.handleChange}
									/>

									<div className="btn-group">
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											data-original-title="Edit"
											onClick={() => this.onEnableEditMember('address')}
										>
											<i className="fa fa-pencil-alt" />
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="font-w600 text-info">Phone number</td>
								<td className="table-width-100 wrap">
									<input
										type="text"
										name="phone"
										value={phone[0]}
										disabled={phone[1]}
										onChange={this.handleChange}
									/>

									<div className="btn-group">
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											data-original-title="Edit"
											onClick={() => this.onEnableEditMember('phone')}
										>
											<i className="fa fa-pencil-alt" />
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="font-w600 text-info">Agent name</td>
								<td className="table-width-100 wrap">
									<input
										type="text"
										name="name"
										value={name[0]}
										disabled={name[1]}
										onChange={this.handleChange}
									/>

									<div className="btn-group">
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											data-original-title="Edit"
											onClick={() => this.onEnableEditMember('name')}
										>
											<i className="fa fa-pencil-alt" />
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="font-w600 text-info">Agent email</td>
								<td className="table-width-100 wrap">
									<input
										type="text"
										name="email"
										value={email[0]}
										disabled={email[1]}
										onChange={this.handleChange}
									/>

									<div className="btn-group">
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											data-original-title="Edit"
											onClick={() => this.onEnableEditMember('email')}
										>
											<i className="fa fa-pencil-alt" />
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="font-w600 text-info">License number</td>
								<td className="table-width-100 wrap">
									<input
										type="text"
										name="license"
										value={license[0]}
										disabled={license[1]}
										onChange={this.handleChange}
									/>

									<div className="btn-group">
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											onClick={this.uploadLicense}
										>
											<i className="si si-cloud-upload" />
											Upload license document
										</button>
										<button
											type="button"
											className="btn btn-sm btn-primary js-tooltip-enabled"
											data-toggle="tooltip"
											data-original-title="Edit"
											onClick={() => this.onEnableEditMember('license')}
										>
											<i className="fa fa-pencil-alt" />
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</Table>
					<div className="column">
						<button
							type="button"
							className="btn btn-sm btn-hero-dark mr-1 mb-3"
							onClick={this.Save}
						>
							<i className="far fa-save" />
							Save
						</button>
					</div>
				</div>
			</div>
		);
	}
}
export default Settings;
