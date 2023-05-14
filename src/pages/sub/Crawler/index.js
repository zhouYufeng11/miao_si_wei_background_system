import React, { Component } from 'react';

import CrawlerService from 'services/Crawler';

import ListTitle from 'components/common/ListTitle';
import TableHead from 'components/common/TableHead';
import TableBody from './TableBody';

import { CRAWLER_TH } from 'config/table_config';
import crawlerData from 'config/crawler_config';

import './index.scss';

const crawlerService = new CrawlerService();

export default class Crawler extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	title: '数据爬虫管理',
	  	crawlerData
	  };
	}

	onCrawlClick (apiName, index) {
		const { crawlerData } = this.state,
		      loading = crawlerData[index].loading;

		crawlerData[index].loading = !loading;

		this.setState({
			crawlerData: this.state.crawlerData
		}, async () => {
      const result = await crawlerService.crawlAction(apiName),
            errorCode = result.error_code,
            loading = crawlerData[index].loading;

      crawlerData[index].loading = !loading;

      this.setState({
				crawlerData: this.state.crawlerData
			});

      if (errorCode === 0) {
      	alert('数据爬取成功');
      	return;
      }

      alert(`数据爬取失败(error_code: ${ errorCode })`);
		});
	}

	render () {
    
    const { title, crawlerData } = this.state;

		return (
      <div className="list-container">
        <ListTitle 
          title={ title }
          refreshHide={ true } />

        <table className="list-table">
        	<TableHead
            thData={ CRAWLER_TH }
        	/>
        	<TableBody
            crawlerData={ crawlerData }
            onCrawlClick={ this.onCrawlClick.bind(this) }
        	/>
        </table>
      </div>
		);
	}
}