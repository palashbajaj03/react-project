import React from 'react';
import videojs from 'video.js'
import './video.css'

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 10,
      toggleButton: false,
      playerCurrentTime: 0
    }
  }
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      // window.jQuery('.video-wrapper').css('transform', 'translate(0,-390px)')
      this.bigPlayButton.on('click', function () {
        document.getElementsByClassName('upDown1')[0].style.display = "flex"
        window.jQuery('.vjs-play-progress.vjs-slider-bar').append('<span class="runningBar"></span>')
        let timelineLength = window.jQuery('.conversationTimelineWrapBody .timelineList li').length
        window.jQuery('.video-js .vjs-progress-holder .vjs-play-progress span.runningBar').css('height', timelineLength * 5.2 + 'rem')
        window.jQuery('.video-js .vjs-progress-control .vjs-mouse-display').css('height', timelineLength * 5.2 + 'rem')
      });
    });

    this.setState(() => ({
      playerObject: this.player
    }))

    window.jQuery('.vjs-fullscreen-control.vjs-control.vjs-button').click(function () {
      if (window.jQuery(this).attr('title') == 'Fullscreen') {
        window.jQuery(this).addClass('no-fullscreen')
      } else {
        window.jQuery(this).removeClass('no-fullscreen')
      }
    })

    this.player.on('timeupdate', () => {
      let playerCurrentTime = this.player.currentTime()
      this.setState(({ playerCurrentTime }))
    });
  }

  handle = (e) => {
    e.preventDefault()
    switch (e.target.id) {
      case 'plus':

        this.setState((prevState) => ({
          count: prevState.count + 10
        }), () => {
          let playerCurrentTime = this.state.playerObject.currentTime(this.state.count)
          playerCurrentTime.play()
        })
        break;
      case 'minus':
        this.setState((prevState) => ({
          count: prevState.count - 10
        }), () => {
          let playerCurrentTime = this.state.playerObject.currentTime(this.state.count)
          playerCurrentTime.play()
        })
        break;

    }
  }
  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  skipTime() {
    let playerCurrentTime = this.state.playerObject.currentTime(this.props.time && this.props.time)
    playerCurrentTime.play()
  }
  render() {

    return (
      <div className="video-wrapper">
        <div data-vjs-player className="video-box">
          <video ref={node => this.videoNode = node} data-setup='{"controlBar": { "volumeMenuButton": {"inline": false,"vertical": true} }, "controls": true, "playbackRates": [2, 1, 0.5]}' src={this.props.video} className="video-js">
          </video>
          <div className="upDown1" style={{ display: 'none' }}>
            <button id="minus" onClick={this.handle}>10s</button>
            <button id="plus" onClick={this.handle}>10s</button>
          </div>

        </div>
      </div>
    )
  }
}


