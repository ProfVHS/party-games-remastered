import { useEffect, useState, useRef } from 'react';
import { RandomScoreBoxType } from '@frontend-types/RandomScoreBoxType';

type ScoreData = {
  id: number;
  top: number;
  left: number;
  angle: number;
  visible: boolean;
  score: number;
  isPositive: boolean;
};

export const RandomScoreBox = ({ id, score, isPositive }: RandomScoreBoxType) => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!id || !score || !isPositive || !containerRef.current) return;

    const container = containerRef.current;
    const { clientWidth, clientHeight } = container;

    const left = Math.random() * (clientWidth - 30);
    const top = Math.random() * (clientHeight - 30);
    const angle = Math.random() * 30 - 15;

    const newScore: ScoreData = {
      id: idRef.current++,
      top,
      left,
      angle,
      visible: true,
      score,
      isPositive,
    };

    setScores((prev) => [...prev, newScore]);

    // Fade out
    setTimeout(() => {
      setScores((prev) => prev.map((score) => (score.id === newScore.id ? { ...score, visible: false } : score)));
    }, 700);

    // Delete element
    setTimeout(() => {
      setScores((prev) => prev.filter((score) => score.id !== newScore.id));
    }, 1000);
  }, [id]);

  return (
    <div ref={containerRef} className="random__score__box">
      {scores.map((score) => (
        <span
          key={score.id}
          className={`score ${score.isPositive ? 'positive' : 'negative'}`}
          style={{
            top: score.top,
            left: score.left,
            opacity: score.visible ? 1 : 0,
            transform: `rotate(${score.angle}deg) scale(${score.visible ? 1 : 0.8})`,
          }}
        >
          {score.isPositive ? '+' + score.score : score.score}
        </span>
      ))}
    </div>
  );
};
