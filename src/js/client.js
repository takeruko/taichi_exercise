import React, { useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
import Contents from "./contents.json";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPosture = () => {
  const idx = getRandomInt(0, Contents.postures.length - 1);
  return Contents.postures[idx];
};

const getNewPosturesList = (order) => {
  // Get [0, 1, 2, 3,..., Contents.postures.length - 1]
  let indexes = Array.from({length: Contents.postures.length}, (value, index) => 0 + index);
  
  if (order === 'shuffle') {
    // Shuffle the indexes.
    indexes = indexes.sort((a, b) => 0.5 - Math.random());
  }

  return indexes.map((i) => Contents.postures[i]);
};

const TaichiApp = () => {
  const [show_name, setShowName] = useState(false);
  const [order, setOrder] = useState('shuffle');
  const [playbackRate, setPlaybackRate] = useState('1.0');
  const [prevOrder, setPrevOrder] = useState(order);
  const [postures, setPostures] = useState([]);
  const [posture, setPosture] = useState(getPosture());
  const videoElement = useRef(null);
  const videoCurtain = useRef(null);

  const getNextPosture = () => {
    let cur_postures;
    if (postures.length === 0 || prevOrder !== order) {
      cur_postures = getNewPosturesList(order);
    }
    else {
      cur_postures = postures;
    }
    const next_posture = cur_postures.shift();
    setPostures(cur_postures);
    return next_posture;
  };

  const setNextPosture = () => {
    videoCurtain.current.style.display = 'inline';
    videoElement.current.style.display = 'none';
    setPosture(getNextPosture());
    setPrevOrder(order);
    videoElement.current.load();
  };

  const playVideo = () => {
    videoCurtain.current.style.display = 'none';
    videoElement.current.style.display = 'block';
    videoElement.current.playbackRate = playbackRate;
    videoElement.current.play();
  };

  const onSelectOrder = (e) => {
    setOrder(e.target.value);
  }

  const onSelectPlaybackRate = (e) => {
    setPlaybackRate(e.target.value);
    videoElement.current.playbackRate = e.target.value;
  }

  let posture_number = posture.id;
  let posture_title = show_name ? ': ' + posture.title + ' (' + posture.pinyin + ')' : '';
  let video_url = posture.movie;
  let video_curtain = Contents.video_curtain;
  return (
        <div className='container-xl'>
            <h4 className='p-3'>第{posture_number}式 {posture_title}</h4>
            <div>
              <img ref={videoCurtain} width="100%" src={video_curtain} onClick={playVideo} />
              <video ref={videoElement} controls playsInline preload="auto">
                <source src={video_url} type="video/mp4" />
              </video>
            </div>
            
            <button type="button" className="btn btn-success m-3" onClick={setNextPosture}>次の技へ</button>
            <div className="form-check form-switch m-3">
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">技名を表示</label>
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={show_name} onChange={(e) => setShowName(e.target.checked)} />
            </div>
            <div className="container m-3">
              <div className="form-check form-check-inline">
                <span>技の順序:</span>
              </div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="postures_order" id="postures_order_shuffle" value="shuffle" onChange={onSelectOrder} checked={order === 'shuffle'} />
                  <label className="form-check-label" htmlFor="postures_order_shuffle">シャッフル</label>
              </div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="postures_order" id="postures_order_asc" value="asc" onChange={onSelectOrder} checked={order === 'asc'} />
                  <label className="form-check-label" htmlFor="postures_order_asc">0から順番に</label>
              </div>
            </div>
            <div className="container m-3">
              <div className="form-check form-check-inline">
                <span>再生速度:</span>
              </div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="playback_rate" id="playback_rate_1" value="1.0" onChange={onSelectPlaybackRate} checked={playbackRate === '1.0'} />
                  <label className="form-check-label" htmlFor="postures_order_shuffle">通常</label>
              </div>
              <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="playback_rate" id="playback_rate_2" value="2.0" onChange={onSelectPlaybackRate} checked={playbackRate === '2.0'} />
                  <label className="form-check-label" htmlFor="postures_order_asc">倍速</label>
              </div>
            </div>
        </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<TaichiApp/>);
