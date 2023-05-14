import React, { Component } from 'react';

import CollectionService from 'services/Collection';
import CommonService from 'services/Common';

import { getDatas } from 'utils/tools';

import { COLLECTION_TH } from 'config/table_config';

import ListTitle from 'components/common/ListTitle';
import TableHead from 'components/common/TableHead';
import TableBody from './TableBody';

import './index.scss';

const collectionService = new CollectionService(),
      commonSerivce = new CommonService();

export default class Collection extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	title: '课程集合管理',
	  	collectionData: []
	  };
	}

	onStatusClick (id, index) {
    const { collectionData } = this.state,
          status = collectionData[index].status;

    const cfm = window.confirm(`确认要${status ? '下架' : '上架'}该集合吗？`);

    if (cfm) {
      switch (status) {
        case 1:
          collectionData[index].status = 0;
          break;
        case 0:
          collectionData[index].status = 1;
          break;
        default:
          break;
      }

      this.setState({
        collectionData: this.state.collectionData
      }, async () => {
        const result = await commonSerivce.changeStatus({
          id,
          status: this.state.collectionData[index].status,
          field: 'COLLECTION'
        });

        const errorCode = result.error_code;

        if (errorCode !== 0) {
          const status = this.state.collectionData[index].status;
          alert(
            status ? '该集合上架失败' : '该集合下架失败'
          );
          return;
        }
      });
    }  
	}
  
  async getCollectionData () {
    const result = await collectionService.getCollectionData(),
		      errorCode = result.error_code,
		      data = result.data,
		      { history } = this.props;

		getDatas(errorCode, data, history, () => {
      this.setState({
      	collectionData: data
      });
		});
  }

  componentDidMount () {
  	this.getCollectionData();
  }

	render () {
    
    const { title, collectionData } = this.state;

		return (
      <div className="list-container">
        <ListTitle 
          title={ title }
          onRefreshData={ this.getCollectionData.bind(this) } />

        <table className="list-table">
        	<TableHead
            thData={ COLLECTION_TH }
        	/>
        	<TableBody
            collectionData={ collectionData }
        	  onStatusClick={ this.onStatusClick.bind(this) }
        	/>
        </table>
      </div>
		);
	}
}