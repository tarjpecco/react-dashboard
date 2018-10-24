import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

class Table extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { tableName, children, tableStyle } = this.props;
		const classname = `table table-vcenter ${tableStyle}`;
		return (
			<div className="block block-rounded block-bordered">
				<div className="block-header block-header-default">
					<h3 className="block-title">{tableName}</h3>
				</div>
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
	children: node.isRequired,
};
export default Table;
