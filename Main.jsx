import React, { useContext } from 'react';
import './Main.css';
import { assets } from '../../assets/assets'; 
import { Context } from '../../context/Context';

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    startVoiceRecognition,
    videos
  } = useContext(Context);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setInput(reader.result); 
        };
        reader.readAsDataURL(file);
    }
  };

  const handleEnterPress = (e) => {
    if(e.key == 'Enter'){
      onSent();
    }
  }


  const triggerImageUpload = () => {
    document.getElementById('imageInput').click();
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Intelli Search Machine</p>
        <img src={assets.user_icon} alt='User' />
      </div>
      <div className="main_container">
        {!showResult ? 
          <>
            <div className="greet">
              <p><span>Hello, Amar</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places for an upcoming road trip</p>
                <img src={assets.compass_icon} alt='Compass' />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt='Bulb' />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt='Message' />
              </div>
              <div className="card">
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt='Code' />
              </div>
            </div>
          </>
         : 
          <div className='result'>
            <div className="result-title">
              <img src={assets.user_icon} alt='User' />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt='Gemini' />
              {loading
              ?<div className='loader'>
                <hr />
                <hr />
                <hr />
                </div>
                :<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              }
            </div>
            <div className="video-results">
            {videos.map((video) => (
              <div key={video.id.videoId} className="video-item">
                <h4>{video.snippet.title}</h4>
                <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                <p>{video.snippet.description}</p>
                <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                  Watch Video
                </a>
                <br></br>
                <br></br>
              </div>
            ))}
            </div>

          </div>
        }
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={handleEnterPress}
              type="text"
              placeholder='Enter a prompt here'
            />
            <div className="search-actions">
              <button onClick={startVoiceRecognition}><img src={assets.mic_icon} alt="Mic" /></button>
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="Send" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Intelli Search Machine may display inaccurate info, including about people, so double-check its response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
