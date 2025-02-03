"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const PodcastPlayer = ({ src }: { src: string }) => {
  return (
    <>
      <AudioPlayer src={src} onPlay={() => console.log("onPlay")} />
    </>
  );
};
