import React, { Component } from 'react';

import './index.scss';

export default class Board extends Component {
	render () {
          // 路由匹配到那个，children 里携带者哪个组件
    const { children } = this.props;

		return (
      <div className="page-board">
        { children }
      </div>
		);
	}
}