"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from "./components/loader";
import Image from "next/image";

export default function Home() {
  const [word, setWord] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      getNewWord();
      const interval = setInterval(getNewWord, 3600000); 

      return () => clearInterval(interval);
    } catch (error) {
      setWord({ word: "Error extracting word", meaning: "", pronounciation: "", audiourl: "" });
    }
  }, []);

  const playAudio = () => {
    if (audioRef.current && word.audiourl) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  };

  async function getNewWord() {
    try {
      const res = await axios.post("/api/newword");
      const data = res.data[0];
      setWord(data);
      localStorage.setItem("lastWord", JSON.stringify(data));
    } catch (error) {
      setWord({ word: "Error extracting word", meaning: "", pronounciation: "", audiourl: "" });
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-full min-w-full bg-[#2c2c2c] text-white">
      {word ? (
        <div
          style={{ WebkitAppRegion: "drag" }}
          className="flex flex-col justify-start items-center gap-2 h-screen w-full text-center"
        >
          <div className="flex items-center mt-2 gap-1">
            <div
              style={{ WebkitAppRegion: "no-drag" }}
              className="flex rounded-md justify-start overflow-x-auto overflow-y-hidden h-11 w-56 border-b border-[#3650c0] shadow-[0px_0px_40px_1px_#000000] bg-[#1d1c1c] items-center whitespace-nowrap px-2"
            >
              {word.audiourl && <audio ref={audioRef} src={word.audiourl} />}
              {word.audiourl && (
                <button
                  style={{ WebkitAppRegion: "no-drag" }}
                  onClick={playAudio}
                  className="cursor-pointer p-2 text-white"
                >
                  🔊
                </button>
              )}
              <h2 className="ml-2 capitalize text-base font-semibold text-[#ffffff]">
                {word.word}
              </h2>
              {word.pronounciation && (
                <span className="italic ml-2 text-base font-semibold text-[#c2bfbf]">
                  {word.pronounciation}
                </span>
              )}
            </div>
            <div className="flex">
              <Image
                className="cursor-pointer"
                src="/refresh.png"
                alt="Refresh"
                width={15}
                height={15}
                onClick={getNewWord}
                style={{ WebkitAppRegion: "no-drag" }}
              />
            </div>
          </div>
          {word.meaning && (
            <div
              className="flex flex-col items-center w-full max-h-32 overflow-y-auto px-3"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              <p className="text-sm text-white">{word.meaning}</p>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}



// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Loader from "./components/loader";
// import Image from "next/image";
// import { useRef } from "react";
// export default function Home() {
//   const [word, setWord] = useState(null);
//   const audioRef = useRef(null);

//   const playAudio = () => {
//     if (audioRef.current) {
//       audioRef.current.load(); // Forces reload
//       audioRef.current
//         .play()
//         .catch((error) => console.error("Playback error:", error));
//     }
//   };

//   async function getNewWord() {
//     try {
//       // console.log("clicked");
//       const res = await axios.post("/api/newword",{word});
//       console.log(res);
//       const data = res.data[0];
//       localStorage.setItem("lastWord", JSON.stringify(data));
//       setWord(data);
//     } catch (error) {
//       console.error("Error fetching new word:", error);
//     }
//   }

//   useEffect(() => {
    
//       getNewWord();
    
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-start min-h-full min-w-full bg-[#2c2c2c] text-white">
//       {word ? (
//         <div
//           style={{ WebkitAppRegion: "drag" }}
//           className="flex flex-col justify-start items-center gap-2 h-screen w-full text-center"
//         >
//           <div className="flex items-center mt-2 gap-1 ">
//             <div
//               style={{ WebkitAppRegion: "no-drag" }}
//               className="flex rounded-md box- justify-start overflow-x-auto overflow-y-hidden h-11 w-56 border-b border-[#3650c0] shadow-[0px_0px_40px_1px_#000000] bg-[#1d1c1c] items-center whitespace-nowrap px-2 scrollbar "
//             >
//               <audio ref={audioRef} src={word.audiourl} />
//               <button
//                 style={{ WebkitAppRegion: "no-drag" }}
//                 onClick={playAudio}
//                 className="cursor-pointer p-2  text-white"
//               >
//                 🔊
//               </button>
//               <h2 className="ml-2 capitalize text-base font-semibold  text-[#ffffff]">
//                 {word.word}
//               </h2>
//               <span className="italic ml-2 text-base font-semibold  text-[#c2bfbf]">
//                 {word.pronounciation}
//               </span>
//             </div>
//             <div className="flex ">
//               <Image
//                 className="cursor-pointer"
//                 src="/refresh.png"
//                 alt="Refresh"
//                 cursor="pointer"
//                 width={15}
//                 height={15}
//                 onClick={getNewWord}
//                 style={{ WebkitAppRegion: "no-drag" }}
//               />
//             </div>
//           </div>
//           <div
//             className="flex flex-col items-center w-full max-h-32 overflow-y-auto px-3"
//             style={{ WebkitAppRegion: "no-drag" }} // Ensures text is selectable
//           >
//             <p className="text-sm text-white">{word.meaning}</p>
//           </div>
//         </div>
//       ) : (
//         <Loader />
//       )}
//     </div>
//   );
// }