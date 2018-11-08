import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class Proposal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { tableName: props.tableName };
		this.onChangeHandler.bind(this);
	}

	onChangeHandler = e => {
		const value = e.target.value;
		this.setState({ tableName: value });
	};

	render() {
		const { children } = this.props;
		const { tableName } = this.state;
		const classname = `table table-vcenter table-bordered`;
		return (
			<div className="block block-rounded block-bordered">
				{tableName && (
					<div className="block-header block-header-default">
						<h3 className="block-title">{tableName}</h3>
					</div>
				)}
				<div className="block-content" style={{ display: 'flex' }}>
					<table className={classname}>{children}</table>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'space-evenly',
						}}
					>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<p className="text-info">Bid price </p>
							<p> $1500 </p>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<button type="button" className="btn btn-primary">
								Download COI
							</button>
							<button type="button" className="btn btn-primary">
								Download Proposal
							</button>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<span className="badge badge-success">GL</span>
							<span className="badge badge-danger">WC</span>
							<span className="badge badge-warning">DB</span>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<button type="button" className="btn btn-primary">
								Accept
							</button>
							<button type="button" className="btn btn-primary">
								Decline
							</button>
							<button type="button" className="btn btn-primary">
								Contigent accept
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const { string, node } = PropTypes;
Proposal.propTypes = {
	tableName: string.isRequired,
	children: node.isRequired,
};
export default Proposal;
