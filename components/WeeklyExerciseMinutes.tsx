"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyWeightChartProps {
  weight: number[];
  labelDate: string[];
}

const replaceZeroWithNull = (arr: number[]): (number | null)[] => {
  return arr.map((value) => (value === 0 ? null : value));
};

const WeeklyExerciseMinutes: React.FC<WeeklyWeightChartProps> = ({
  weight,
  labelDate,
}) => {
  const processedWeight = weight;

  const [data, setData] = useState<any>({
    labels: labelDate,
    datasets: [
      {
        label: "분",
        data: processedWeight,
        borderColor: "#ff6b81",
        backgroundColor: "rgba(255, 107, 129, 0.2)",
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const updatedWeight = weight;
    setData({
      labels: labelDate,
      datasets: [
        {
          label: "분",
          data: updatedWeight,
          borderColor: "#ff6b81",
          backgroundColor: "rgba(255, 107, 129, 0.2)",
          fill: true,
        },
      ],
    });
  }, [weight, labelDate]);

  const maxWeight =
    Math.max(...processedWeight.filter((val) => val !== null)) + 5;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "주간 운동 시간 변화",
        font: {
          size: 20,
          weight: "bold",
        } as const,
        color: "#333",
      },
    },
    scales: {
      y: {
        max: maxWeight,
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 15,
        left: 0,
      },
    },
  };

  return (
    <div style={{ height: "400px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeeklyExerciseMinutes;
