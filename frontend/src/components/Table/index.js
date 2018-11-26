import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class Table extends React.PureComponent {
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
		const { children, tableStyle, editable } = this.props;
		const { tableName } = this.state;
		const classname = `table table-vcenter ${tableStyle}`;
		return (
			<div className="block block-rounded block-bordered">
				{tableName && (
					<div className="block-header block-header-default">
						<h3 className="block-title">
							{editable === '' && (
								<input
									className="tableTitle"
									type="text"
									value={tableName}
									onChange={this.onChangeHandler}
								/>
							)}
							{editable === 'disable' && tableName}
						</h3>
					</div>
				)}
				<div className="block-content">
					<table className={classname}>{children}</table>
				</div>
			</div>
		);
	}
}

const { string, node } = PropTypes;
Table.propTypes = {
	tableName: string.isRequired,
	tableStyle: string.isRequired,
	editable: string,
	children: node.isRequired,
};

Table.defaultProps = {
	editable: 'disable',
}

export default Table;
