import React, { Component } from 'react';

import SliderService from 'services/Slider';
import CommonService from 'services/Common';

import { getDatas } from 'utils/tools';

import { SLIDER_TH } from 'config/table_config';

import ListTitle from 'components/common/ListTitle';
import TableHead from 'components/common/TableHead';
import TableBody from './TableBody';

import './index.scss';

const sliderService = new SliderService(),
      commonSerivce = new CommonService();

export default class Slider extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	title: '轮播图管理',
	  	sliderData: []
	  };
	}

	onStatusClick (id, index) {
    const { sliderData } = this.state,
          status = sliderData[index].status;

    const cfm = window.confirm(`确认要${status ? '下架' : '上架'}该轮播图吗？`);

    if (cfm) {
      switch (status) {
        case 1:
          sliderData[index].status = 0;
          break;
        case 0:
          sliderData[index].status = 1;
          break;
        default:
          break;
      }

      this.setState({
        sliderData: this.state.sliderData
      }, async () => {
        const result = await commonSerivce.changeStatus({
          id,
          status: this.state.sliderData[index].status,
          field: 'SLIDER'
        });

        const errorCode = result.error_code;

        if (errorCode !== 0) {
          const status = this.state.sliderData[index].status;
          alert(
            status ? '该轮播图上架失败' : '该轮播图下架失败'
          );
          return;
        }
      });
    }  
	}
  
  async getSliderData () {
    const result = await sliderService.getSliderData(),
		      errorCode = result.error_code,
		      data = result.data,
		      { history } = this.props;

		getDatas(errorCode, data, history, () => {
      this.setState({
      	sliderData: data
      });
		});
  }

  componentDidMount () {
  	this.getSliderData();
  }

	render () {
    
    const { title, sliderData } = this.state;

		return (
      <div className="list-container">
        <ListTitle 
          title={ title }
          onRefreshData={ this.getSliderData.bind(this) } />

        <table className="list-table">
        	<TableHead
            thData={ SLIDER_TH }
        	/>
        	<TableBody
            sliderData={ sliderData }
        	  onStatusClick={ this.onStatusClick.bind(this) }
        	/>
        </table>
      </div>
		);
	}
}