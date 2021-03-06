import React, { Component, PropTypes } from 'react';

import Progress from './Progress';
import DanmukuInput from './DanmukuInput';
import Volume from './Volume';
import Config from './Config';

export default class Controller extends Component {
  static displayName = 'IcePlayerController';

  static propTypes = {
    controls: PropTypes.bool.isRequired,
    playerAction: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    video: PropTypes.shape({
      playTimes: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      currentTime: PropTypes.number.isRequired,
      bufferedTime: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
      muted: PropTypes.bool.isRequired,
      loop: PropTypes.bool.isRequired,
    }),
    fullScreen: PropTypes.bool,
    danmukuConfig: PropTypes.shape({
      fontColor: PropTypes.string,
      fontSize: PropTypes.oneOf(['small', 'middle', 'large']),
      model: PropTypes.oneOf(['roll', 'top', 'bottom']),
    }),
    playerConfig: PropTypes.shape({
      opacity: PropTypes.number,
      scale: PropTypes.string,
      onOff: PropTypes.bool,
    }),

    handleOnPause: PropTypes.func.isRequired,
    handleOnPlay: PropTypes.func.isRequired,
    startControlsTimer: PropTypes.func.isRequired,
    setCurrentTime: PropTypes.func.isRequired,
    showControls: PropTypes.func.isRequired,
    hideControls: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
    setMuted: PropTypes.func.isRequired,
    setLoop: PropTypes.func.isRequired,
    setDanmukuConfig: PropTypes.func.isRequired,
    setPlayerConfig: PropTypes.func.isRequired,
    sendDanmu: PropTypes.func.isRequired,
    handleOnFullScreen: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showConfig: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  handleOnPlayIcon = () => {
    const { playerAction, startControlsTimer } = this.props;
    startControlsTimer();
    if (playerAction === 1) {            // 点击暂停
      this.props.handleOnPause();
    } else {                             // 点击播放
      this.props.handleOnPlay(false);
    }
  }

  handleOnRepeatClick = (e) => {
    e.preventDefault();
    let flag;
    if (this.props.video.loop) {
      flag = false;
    } else {
      flag = true;
    }
    this.props.setLoop(flag);
  }

  handleOnSetting = () => {
    const showConfig = this.state.showConfig;
    let status = false;
    if (!showConfig) {
      status = true;
    }
    this.setState({
      showConfig: status,
    });
  }

  handleOnFullScreenClick = () => {
    this.props.handleOnFullScreen();
  }

  computeLeftX = (X, left, width) => {
    let leftX;
    if (X < left) {
      leftX = 0;
    } else if (X > left + width) {
      leftX = width;
    } else {
      leftX = X - left;
    }
    return leftX;
  }

  render() {
    const { controls, playerAction, show, video } = this.props;
    if (!controls) {
      return null;
    }
    const playHtml = '<use class="video-svg-play video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_play" /><use class="video-svg-pause video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_pause" />';
    const fullScreenHtml = '<use class="video-svg-fullscreen video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen" /><use class="video-svg-fullscreen-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_fullscreen_true" />';
    const settingHtml = '<use class="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_setting" />';
    const repeatHtml = '<use class="video-svg-repeat-true video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_repeat_true" /><use class="video-svg-repeat-false video-svg-symbol-hidden" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#video_repeat_false" />';
    let playStatus = '';
    if (playerAction === 1 || playerAction === 3) {
      playStatus = 'pause';
    } else if (playerAction === 2) {
      playStatus = 'play';
    }
    const dataConfig = this.state.showConfig ? 'show' : 'hide';
    const fullScreen = this.props.fullScreen;
    return (
      <div className={`video-control-main ${show ? '' : 'video-control-main-hidden'}`}>
        <Progress
          currentTime={this.props.video.currentTime}
          bufferedTime={this.props.video.bufferedTime}
          duration={this.props.video.duration}
          setCurrentTime={this.props.setCurrentTime}
        />
        <div className="video-control-bar">
          <button
            className="video-control-item video-btn-play"
            data-status={playStatus}
            aria-label="播放/暂停"
            onClick={this.handleOnPlayIcon}
          >
            <svg className="video-svg" version="1.1" dangerouslySetInnerHTML={{ __html: playHtml }} />
          </button>
          <DanmukuInput
            showControls={this.props.showControls}
            hideControls={this.props.hideControls}
            sendDanmu={this.props.sendDanmu}
          />
          <div className="video-control-bar-right" data-config={dataConfig} >
            <Volume
              video={this.props.video}
              volume={this.props.video.volume}
              muted={this.props.video.muted}
              setVolume={this.props.setVolume}
              setMuted={this.props.setMuted}
            />
            <button
              className="video-control-item video-btn-setting"
              aria-label="设置"
              data-config={dataConfig}
              onClick={this.handleOnSetting}
            >
              <svg className="video-svg" version="1.1" dangerouslySetInnerHTML={{ __html: settingHtml }} />
            </button>
            <button
              className="video-control-item video-btn-repeat"
              aria-label="循环"
              data-status={video.loop}
              data-msg={`${video.loop ? '关闭循环' : '洗脑循环'}`}
              onClick={this.handleOnRepeatClick}
            >
              <svg className="video-svg" version="1.1" dangerouslySetInnerHTML={{ __html: repeatHtml }} />
            </button>
            <button
              className="video-control-item video-btn-fullscreen"
              aria-label="全屏"
              data-status={fullScreen}
              onClick={this.handleOnFullScreenClick}
            >
              <svg className="video-svg" version="1.1" dangerouslySetInnerHTML={{ __html: fullScreenHtml }} />
            </button>
            <Config
              danmukuConfig={this.props.danmukuConfig}
              playerConfig={this.props.playerConfig}
              setDanmukuConfig={this.props.setDanmukuConfig}
              setPlayerConfig={this.props.setPlayerConfig}
            />
          </div>
        </div>
      </div>
    );
  }
}
