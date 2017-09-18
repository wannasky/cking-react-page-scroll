import React, {Component} from 'react';
import touch from 'cking-touch/touch';
import 'components/pageScroll/index.scss';

export default class PageScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minTranslate: 100,
            maxTranslate: 400
        }
    }

    componentDidMount(){
        let pageScroll = this.refs.wsPageScroll;
        let pageScrollMark = this.refs.wsPageMark;
        let self = this,dragMove,dragEnd,translate,speed=0.8,duration,psContentOffsetHeight,isFinish = true;
        let psContent = pageScroll.querySelector('.ws-page-scroll-content');
        let psOffsetHeight = pageScroll.offsetHeight;

        let complete = function () {
            isFinish = true;
        }

        pageScroll.onscroll = function (event) {
            self.props && self.props.onScroll && self.props.onScroll(event);
            psContentOffsetHeight = psContent.offsetHeight;
            if((event.target.scrollTop + psOffsetHeight) >= psContentOffsetHeight && isFinish){
                isFinish = false;
                self.props && self.props.onReachBottom && self.props.onReachBottom(complete);
            }
            if(event.target.scrollTop === 0 && isFinish){
                isFinish = false;
                self.props && self.props.onReachTop && self.props.onReachTop(complete);
            }
        }
        this.dragStart = touch.on(pageScroll,'dragStart',function (event) {
            if(pageScroll.scrollTop === 0 && event.detail.direction === 'down'){
                clearTimeout(self.psTimer);
                pageScroll.style.overflow = 'hidden';
                pageScroll.style.transitionDuration = '0ms';
                pageScrollMark.style.transitionDuration = '0ms';
                pageScrollMark.classList.remove('ws-direction-rotate');
                dragMove = touch.on(pageScroll,'dragMove',function (event) {
                    translate = event.detail.y;
                    pageScroll.style.scrollTop = 0;
                    if(translate >= self.state.minTranslate){
                        pageScrollMark.classList.add('ws-direction-rotate');
                    }else{
                        pageScrollMark.classList.remove('ws-direction-rotate');
                    }
                    if(translate < self.state.maxTranslate){
                        pageScroll.style.transform = 'translate3d(0,'+translate+'px,0)';
                        pageScrollMark.style.transform = 'translate3d(0,'+translate+'px,0)';
                    }
                });

                dragEnd = touch.on(pageScroll,'dragEnd',function (event) {
                    translate = event.detail.y;
                    pageScroll.style.overflow = 'auto';
                    translate = translate > self.state.maxTranslate ? self.state.maxTranslate : translate;
                    if(translate < self.state.minTranslate){
                        pageScroll.style.transitionDuration = '100ms';
                        pageScroll.style.transform = 'translate3d(0,0,0)';
                        pageScrollMark.style.transform = 'translate3d(0,0,0)';
                    }else{
                        duration = (translate - 50)/speed;
                        pageScroll.style.transitionDuration = duration + 'ms';
                        pageScrollMark.style.transitionDuration = duration + 'ms';
                        pageScroll.style.transform = 'translate3d(0,50px,0)';
                        pageScrollMark.style.transform = 'translate3d(0,50px,0)';

                        var complete = function () {
                            duration = 100;
                            pageScroll.style.transitionDuration = duration + 'ms';
                            pageScroll.style.transform = 'translate3d(0,0,0)';
                            self.psTimer = setTimeout(function () {
                                pageScroll.style.transitionDuration = '0ms';
                                pageScrollMark.style.transitionDuration = '0ms';
                                pageScrollMark.classList.remove('ws-direction-rotate');
                                pageScrollMark.classList.remove('ws-show-loading');
                            },110);
                        }

                        self.psTimer = setTimeout(function () {
                            pageScrollMark.classList.add('ws-show-loading');
                            self.props && self.props.onPullDownRefresh && self.props.onPullDownRefresh(complete);
                        },duration + 10);
                    }

                    dragMove.off();
                    dragEnd.off();
                });
            }
        });
    }

    componentWillUnmount (){
        clearTimeout(this.psTimer);
        this.dragStart.off();
        this.dragMove.off();
        this.dragEnd.off();
    }

    render(){
        return (
            <div className="ws-page-bg">
                <div ref="wsPageMark" className="ws-page-mark">
                    <span className="ws-page-mark-direction"></span>
                    <div className="ws-page-loading">
                        <span className="wpl1"></span>
                        <span className="wpl2"></span>
                        <span className="wpl3"></span>
                    </div>
                </div>
                <div ref="wsPageScroll" className="ws-page-scroll">
                    <div className="ws-page-scroll-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}