import React from 'react';
import Table from '../../../components/Table';

import './index.scss';

class Settings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			editable: 'disable',
			name: 'Name Surname',
			address: '123 Main Street NY, NY 10001',
			phone: '555-555-5555',
			ein: '61-512584',
			license: [],
			btnname: 'Edit',
			btnicon: 'si si-pencil',
			password: '',
		};
		this.handleClickEdit.bind(this);
		this.onChangeHandler.bind(this);
		this.onAddLicense.bind(this);
		this.onDeleteLicense.bind(this);
		this.onChangeLicenseHandler.bind(this);

		this.textInput = React.createRef();
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	handleClickEdit = () => {
		const { editable } = this.state;
		if (editable === 'disable') {
			this.setState({ editable: '' });
			this.setState({ btnname: 'Save' });
			this.setState({ btnicon: 'far fa-save' });
		} else {
			this.setState({ editable: 'disable' });
			this.setState({ btnname: 'Edit' });
			this.setState({ btnicon: 'si si-pencil' });
		}
	};

	onChangeHandler = e => {
		const property = e.target.name;
		const value = e.target.value;
		this.setState({ [property]: value });
		this.focusTextInput();
	};

	onAddLicense = () => {
		const newelement = {
			type: 'GC',
			number: '12345678',
			expireday: '1/23/19',
		};
		this.setState(prevState => ({
			license: [...prevState.license, newelement],
		}));
	};

	onDeleteLicense = id => {
		const { license } = this.state;
		const array = [...license];
		array.splice(id, 1);
		this.setState({ license: array });
	};

	onChangeLicenseHandler = id => e => {
		const { value } = e.target;
		const { license } = this.state;
		const array = [...license];
		if (e.target.name === 'type') array[id].type = value;
		if (e.target.name === 'number') array[id].number = value;
		if (e.target.name === 'expireday') array[id].expireday = value;
		this.setState({ license: array });
	};

	onResetPassword = () => {};

	focusTextInput() {
		this.textInput.current.focus();
	}

	render() {
		const {
			name,
			phone,
			address,
			ein,
			license,
			editable,
			btnname,
			btnicon,
			password,
		} = this.state;
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								GC Profile and Settings
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.onAddLicense}
							>
								+ Add New License
							</button>
						</div>
					</div>
				</div>

				<div className="content settings">
					<div className="table-tool">
						<button
							type="button"
							className="btn btn-sm btn-hero-dark mr-1 mb-3"
							onClick={this.handleClickEdit}
						>
							<i className={btnicon} /> {btnname}
						</button>
					</div>
					<Table
						tableName="ABC Construction Company, Inc."
						tableStyle="table-striped table-bordered"
						editable={editable}
					>
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
								<td className="table-width-30">Type</td>
								<td className="table-width-30">Number</td>
								<td className="table-width-40" colSpan="2">
									Expiredate
								</td>
							</tr>
							{license.map((item, id) => (
								// eslint-disable-next-line
								<tr className="text-left" key={id}>
									<td />
									<td className="table-width-30">
										<input
											type="text"
											name="type"
											value={item.type}
											disabled={editable}
											onChange={this.onChangeLicenseHandler(id)}
										/>
									</td>
									<td className="table-width-30">
										<input
											type="text"
											name="number"
											value={item.number}
											disabled={editable}
											onChange={this.onChangeLicenseHandler(id)}
										/>
									</td>
									<td className="table-width-40">
										<input
											type="text"
											name="expireday"
											value={item.expireday}
											disabled={editable}
											onChange={this.onChangeLicenseHandler(id)}
										/>
									</td>
									<td className="text-left">
										<div className="btn-group">
											<button
												type="button"
												className="btn btn-sm btn-primary js-tooltip-enabled"
												data-toggle="tooltip"
												data-original-title="Delete"
												onClick={() => this.onDeleteLicense(id)}
											>
												<i className="far fa-trash-alt" />
											</button>
										</div>
									</td>
								</tr>
							))}

							<tr className="text-left">
								<td>
									<p className="text-info">Password</p>
								</td>
								<td colSpan="4" className="password">
									<input
										type="password"
										name="password"
										value={password}
										placeholder="Your Password"
										onChange={this.onChangeHandler}
									/>
									<button
										type="button"
										className="btn btn-primary"
										onClick={() => this.onResetPassword}
									>
										Reset here
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
export default Settings;
