"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./components/loader";
import Image from "next/image";

export default function Home() {
  const [word, setWord] = useState(null);

  async function fetchWord() {
    try {
      const res = await axios.get("/api/lastword");
      console.log(res.data);
      const data = res.data;
      setWord(data);
    } catch (error) {
      console.error("Error fetching word:", error);
    }
  }

  async function getNewWord() {
    try {
      const res = await axios.post("/api/newword");
      const data = res.data;
      setWord(data);
    } catch (error) {
      console.error("Error fetching new word:", error);
    }
  }

  useEffect(() => {
    fetchWord(); // Load the last used word
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-screen min-w-full bg-[#161718] text-white" >
      {word ? (
        <div className="h-screen w-full rounded-lg text-center">
          <div style={{ WebkitAppRegion: "drag" }} className="flex flex-col top-0 items-center border-b border-b-[#02357d] justify-center h-9 w-full   bg-[#1b1a1a]">
            <h2 className="capitalize text-base font-semibold  text-[#c6c6c6]">
              {word.word}
            </h2>
          </div>
          <p className="text-sm m-3 text-white">{word.meaning}</p>
          <div className="flex absolute top-2 right-2">
            <Image
              src="/refresh.png"
              alt="Refresh"
              width={20}
              height={20}
              onClick={getNewWord}
              style={{ WebkitAppRegion: "drag" }}
            />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
