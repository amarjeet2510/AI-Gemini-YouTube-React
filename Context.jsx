import { createContext, useState } from "react";
import runChat from "../config/gemini"; 

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(""); 
  const [videos, setVideos] = useState([]);


  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setVideos([]);
    setInput("");
  };

  const onSent = async (prompt) => {
    setResultData("");  
    setLoading(true);    
    setShowResult(true);
    setRecentPrompt("");
    setVideos([]);
    let response;
    
    try {
      if (prompt !== undefined) {
        response = await runChat(prompt);
        setRecentPrompt(prompt);
        searchVideos(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        response = await runChat(input);
        setRecentPrompt(input);
        searchVideos(input);
      }

      console.log("Processed Response:", response);

      
      let responseArray = response.split("**");
      let newResponse = responseArray.map((item, i) => {
        return (i % 2 === 1 ? "<br>" : "") + item;
      }).join("");

      
      let newResponseArray = newResponse.split("*").join("<br>").split(" ");

      
      newResponseArray.forEach((word, i) => {
        delayPara(i, word + " ");
      });
      setResultData(response);
      console.log("Videos---------------------", videos)

    } catch (error) {
      console.error("Error processing the response:", error);
      setResultData("Sorry, something went wrong."); 
    } finally {
      setLoading(false); 
      setInput("");      
      setVideos([]);
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + transcript); 
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
        };

        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser.');
      }
    };

    const searchVideos = async (input) => {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(input)}&type=video&key=AIzaSyAaj6_5HyyD3WVA24Bqxq9RS2UCGEXZtio&maxResults=5`;
  

      
      try {
        const response = await fetch(url);
        const data = await response.json();
  
        if (data.items) {
          setVideos(data.items);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setVideos([]);
      }
    };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    loading,
    showResult,
    input,
    setInput,
    newChat,
    resultData,
    setResultData,
    startVoiceRecognition,
    videos,
    setVideos
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
