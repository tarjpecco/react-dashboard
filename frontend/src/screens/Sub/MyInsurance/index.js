import React from 'react';
import Modal from 'react-modal';
import Table from '../../../components/Table';

import './index.scss';

const customStyles = {
	content: {
		top: '60%',
		left: '60%',
		transform: 'translate(-60%, -60%)',
	},
};

class MyInsurance extends React.Component {
	constructor(props) {
		super(props);
		this.state = { modalIsOpen: false };

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
		return (
			<div id="main">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill font-size-h2 font-w400 mt-2 mb-0 mb-sm-2">
								Sub My Insurance
							</h1>
							<button
								type="button"
								className="btn btn-success"
								onClick={this.openModal}
							>
								+ Add New Policy
							</button>
							<button type="button" className="btn btn-dark">
								Send My COI
							</button>
						</div>
					</div>
				</div>
				<div className="content">
					<Table>
						<thead className="thead-light">
							<tr>
								<th className="text-center table-width-20">Agent/Broker name</th>
								<th className="text-center table-width-15">Policy type</th>
								<th className="text-center table-width-15">Policy number</th>
								<th className="text-center table-width-20">Renewal Date</th>
								<th className="text-center table-width-15">Status</th>
								<th className="text-center table-width-25" />
							</tr>
						</thead>
						<tbody>
							<tr className="text-center">
								<td>
									<p className="text-info">Agent 123</p>
								</td>
								<td>GL</td>
								<td>12345678</td>
								<td>12/12/2019</td>
								<td>
									<span className="badge badge-success">Active</span>
								</td>
								<td>
									<button type="button" className="btn btn-primary">
										View or Edit{' '}
									</button>
								</td>
							</tr>
							<tr className="text-center">
								<td>
									<p className="text-info">Broker 234</p>
								</td>
								<td>WC</td>
								<td>134567824</td>
								<td>1/1/2018</td>
								<td>
									<span className="badge badge-danger">Expired</span>
								</td>
								<td>
									<button type="button" className="btn btn-primary">
										View or Edit{' '}
									</button>
								</td>
							</tr>
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
					<center>
						<h2>Select Policy type(s) you would like to add:</h2>
					</center>

					<form>
						<div className="form-group wrap">
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									id="example-radios-inline1"
									name="example-radios-inline"
									value="option1"
								/>
								GL
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									id="example-radios-inline2"
									name="example-radios-inline"
									value="option2"
								/>
								WC
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									id="example-radios-inline3"
									name="example-radios-inline"
									value="option2"
								/>
								DBL
							</div>
						</div>
					</form>
					<br />
					<br />
					<center>
						<h2>Who will upload the document(s)?</h2>
					</center>
					<div className="wrap">
						<button type="button" className="btn btn-success" onClick={this.closeModal}>
							Upload Myself
						</button>
						<button type="button" className="btn btn-success" onClick={this.closeModal}>
							Link My agent
						</button>
					</div>
				</Modal>
			</div>
		);
	}
}
export default MyInsurance;
