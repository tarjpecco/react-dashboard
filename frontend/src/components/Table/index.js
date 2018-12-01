import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class Table extends React.PureComponent {

	onChangeHandler = e => {
		const { onComapnyNameChanged } = this.props;
		const value = e.target.value;
		onComapnyNameChanged(value);
	};

	render() {
		const { children, tableStyle, editable, tableName } = this.props;
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

const { string, node, func } = PropTypes;
Table.propTypes = {
	tableName: string.isRequired,
	tableStyle: string,
	editable: string,
	children: node.isRequired,
	onComapnyNameChanged: func,
};

Table.defaultProps = {
	editable: 'disable',
	tableStyle: '',
	onComapnyNameChanged: () => {},
}

export default Table;
