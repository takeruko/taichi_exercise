import React, { useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
import Contents from "./contents.json";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPosture = () => {
  var idx = getRandomInt(0, Contents.postures.length - 1);
  return Contents.postures[idx];
};

const TaichiApp = () => {
  const [posture, setPosture] = useState(getPosture());
  const [show_name, setShowName] = useState(false);
  const videoElement = useRef(null);
  const videoCurtain = useRef(null);

  const setNextPosture = () => {
    videoCurtain.current.style.display = 'inline';
    videoElement.current.style.display = 'none';
    setPosture(getPosture());
    videoElement.current.load();
  };

  const playVideo = () => {
    videoCurtain.current.style.display = 'none';
    videoElement.current.style.display = 'block';
    videoElement.current.play();
  };

  let posture_number = posture.id;
  let posture_title = show_name ? ': ' + posture.title + ' (' + posture.pinyin + ')' : '';
  let video_url = posture.movie;
  let video_curtain = Contents.video_curtain;
  return (
        <div class='container-xl'>
            <h4 class='p-3'>第{posture_number}式 {posture_title}</h4>
            <div>
              <img ref={videoCurtain} width="100%" src={video_curtain} onClick={playVideo} />
              <video ref={videoElement} controls playsInline preload="auto">
                <source src={video_url} type="video/mp4" />
              </video>
            </div>
            
            <button type="button" class="btn btn-success m-2" onClick={setNextPosture}>次の技へ</button>
            <div class="form-check form-switch m-2">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={show_name} onChange={(e) => setShowName(e.target.checked)} />
                <label class="form-check-label" htmlFor="flexSwitchCheckChecked">技名を表示</label>
            </div>            
        </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<TaichiApp/>);
