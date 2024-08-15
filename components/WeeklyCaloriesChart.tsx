"use client";

import React, { useEffect } from "react";
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
import { getWeeklyReport } from "@/lib/utils";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
type PageProps = {
  params: {
    id: string;
  };
};

const WeeklyCaloriesChart: React.FC<PageProps> = ({ params }: PageProps) => {
  console.log("s");
  const data = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "칼로리 섭취량",
        data: [1200, 1500, 1700, 1400, 1600, 1800, 1300], // 예시 데이터
        borderColor: "#ff6b81",
        backgroundColor: "rgba(255, 107, 129, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "주간 칼로리 섭취량",
        font: {
          size: 20,
          weight: "bold",
        } as const,
        color: "#333",
      },
    },
  };

  return <Line data={data} options={options} height={200} />;
};

export default WeeklyCaloriesChart;
