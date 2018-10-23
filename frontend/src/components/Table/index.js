import React from 'react';
import './index.scss';

class Table extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="block block-rounded block-bordered">
				<div className="block-header block-header-default">
					<h3 className="block-title">Tasks to be completed</h3>
				</div>
				<div className="block-content">
					<table className="table table-vcenter">
						<tbody>
							<tr>
								<th className="text-center" scope="row">
									1
								</th>
								<td className="font-w600">
									<p className="text-info">New Quote Received</p>
								</td>
								<td className="review">
									<button type="button" className="btn btn-primary">
										Review
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Table;
