import React, { Component } from 'react';

import StudentService from 'services/Student';
import CommonService from 'services/Common';

import { getDatas } from 'utils/tools';

import { STUDENT_TH } from 'config/table_config';

import ListTitle from 'components/common/ListTitle';
import TableHead from 'components/common/TableHead';
import TableBody from './TableBody';

import './index.scss';

const studentService = new StudentService(),
      commonSerivce = new CommonService();

export default class Student extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	title: '学生管理',
	  	studentData: []
	  };
	}

	onStatusClick (id, index) {
    const { studentData } = this.state,
          status = studentData[index].status;

    const cfm = window.confirm(`确认要${status ? '下线' : '上线'}该学生吗？`);

    if (cfm) {
      switch (status) {
        case 1:
          studentData[index].status = 0;
          break;
        case 0:
          studentData[index].status = 1;
          break;
        default:
          break;
      }

      this.setState({
        studentData: this.state.studentData
      }, async () => {
        const result = await commonSerivce.changeStatus({
          id,
          status: this.state.studentData[index].status,
          field: 'STUDENT'
        });

        const errorCode = result.error_code;

        if (errorCode !== 0) {
          const status = this.state.studentData[index].status;
          alert(
            status ? '该学生上线失败' : '该学生下线失败'
          );
          return;
        }
      });
    }  
	}
  
  async getStudentData () {
    const result = await studentService.getStudentData(),
		      errorCode = result.error_code,
		      data = result.data,
		      { history } = this.props;

		getDatas(errorCode, data, history, () => {
      this.setState({
      	studentData: data
      });
		});
  }

  componentDidMount () {
  	this.getStudentData();
  }

	render () {
    
    const { title, studentData } = this.state;

		return (
      <div className="list-container">
        <ListTitle 
          title={ title }
          onRefreshData={ this.getStudentData.bind(this) } />

        <table className="list-table">
        	<TableHead
            thData={ STUDENT_TH }
        	/>
        	<TableBody
            studentData={ studentData }
        	  onStatusClick={ this.onStatusClick.bind(this) }
        	/>
        </table>
      </div>
		);
	}
}