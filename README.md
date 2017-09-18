# cking-react-page-scroll

## 安装

```bash
npm install cking-react-page-scroll --save
```

## 简介
用来对移动端页面的上拉，下拉，滚动等事件进行处理
支持的事件有：onScroll(滚动),onReachTop(滚动到顶部),onReachBottom(滚动到底部),onPullDownRefresh(下拉刷新)

## 使用

```javascript
import React, {Component} from 'react';
import PageScroll from 'cking-react-page-scroll';

export default class Page extends Component {
    
    //监听实时滚动
    scroll(event) {
        console.log(event);
    },
    
    //滚动到顶部
    reachTop(complete) {
        setTimeout(function(){
            complete();
        },1000);
    },
    
    //滚动到底部
    reachBottom(complete) {
        setTimeout(function(){
            complete();
        },1000);
    },
    
    //下拉刷新
    pullDownRefresh(complete) {
        setTimeout(function(){
            complete();
        },1000);
    },
    
    render() {
        return (
            <PageScroll
                onScroll={this.scroll}
                onPullDownRefresh={this.pullDownRefresh}
                onReachTop={this.reachTop}
                onReachBottom={this.reachBottom}>
                    我是内容
                </PageScroll>
        )
    }
}

```
