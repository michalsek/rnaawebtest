import { StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioContext,
  StretcherNode,
} from "react-native-audio-api/lib/module/web-core";

export default function HomeScreen() {
  const [rate, setRate] = useState(100);
  const stretchNodeRef = useRef<StretcherNode | null>(null);
  const aCtxRef = useRef<AudioContext | null>(null);

  const onStartPress = useCallback(async () => {
    const aCtx = new AudioContext();
    const stretchNode = await aCtx.createStretcher();

    aCtxRef.current = aCtx;
    stretchNodeRef.current = stretchNode;
    stretchNode.connect(aCtx.destination);

    const audioBuffer = await aCtx.decodeAudioDataSource("/exzoltraak.mp3");

    try {
      stretchNode.buffer = audioBuffer;

      stretchNode.start();
      stretchNode.playbackRate = rate / 100.0;
    } catch (e) {
      console.error(e);
    }
  }, [rate]);

  useEffect(() => {
    if (stretchNodeRef.current) {
      stretchNodeRef.current.playbackRate = rate / 100.0;
    }
  }, [rate]);

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        paddingTop: 160,
      }}
    >
      <div>
        <button type="button" onClick={onStartPress}>
          Start
        </button>
      </div>
      <br />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          color: "white",
        }}
      >
        <label htmlFor="rate">Rate: {(rate / 100.0).toFixed(2)}</label>
        <input
          id="rate"
          type="range"
          min="25"
          max="500"
          step="1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
