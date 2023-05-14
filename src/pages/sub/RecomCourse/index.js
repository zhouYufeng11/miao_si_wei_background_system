import React, { Component } from 'react';

import RecomCourseService from 'services/RecomCourse';
import CommonService from 'services/Common';

import { getDatas } from 'utils/tools';

import { RECOM_COURSE_TH } from 'config/table_config';

import ListTitle from 'components/common/ListTitle';
import TableHead from 'components/common/TableHead';
import TableBody from './TableBody';

import './index.scss';

const recomCourseService = new RecomCourseService(),
      commonSerivce = new CommonService();

export default class RecomCourse extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	title: '推荐课程管理',
	  	recomCourseData: []
	  };
	}

	onStatusClick (cid, index) {
    const { recomCourseData } = this.state,
          status = recomCourseData[index].status;

    const cfm = window.confirm(`确认要${status ? '下架' : '上架'}该课程吗？`);

    if (cfm) {
      switch (status) {
        case 1:
          recomCourseData[index].status = 0;
          break;
        case 0:
          recomCourseData[index].status = 1;
          break;
        default:
          break;
      }

      this.setState({
        recomCourseData: this.state.recomCourseData
      }, async () => {
        const result = await commonSerivce.changeStatus({
          id: cid,
          status: this.state.recomCourseData[index].status,
          field: 'RECOM_COURSE'
        });

        const errorCode = result.error_code;

        if (errorCode !== 0) {
          const status = this.state.recomCourseData[index].status;
          alert(
            status ? '该课程上架失败' : '该课程下架失败'
          );
          return;
        }
      });
    }  
	}
  
  async getRecomCourseData () {
    const result = await recomCourseService.getRecomCourseData(),
		      errorCode = result.error_code,
		      data = result.data,
		      { history } = this.props;

		getDatas(errorCode, data, history, () => {
      this.setState({
      	recomCourseData: data
      });
		});
  }

  componentDidMount () {
  	this.getRecomCourseData();
  }

	render () {
    
    const { title, recomCourseData } = this.state;

		return (
      <div className="list-container">
        <ListTitle 
          title={ title }
          onRefreshData={ this.getRecomCourseData.bind(this) } />

        <table className="list-table">
        	<TableHead
            thData={ RECOM_COURSE_TH }
        	/>
        	<TableBody
            recomCourseData={ recomCourseData }
        	  onStatusClick={ this.onStatusClick.bind(this) }
        	/>
        </table>
      </div>
		);
	}
}