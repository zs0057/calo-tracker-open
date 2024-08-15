import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const calculateTotalMax = (
  breakfast: number[],
  lunch: number[],
  dinner: number[],
  snack: number[]
): number => {
  let maxTotal = 0;
  for (let i = 0; i < breakfast.length; i++) {
    const total = breakfast[i] + lunch[i] + dinner[i] + snack[i];
    if (total > maxTotal) {
      maxTotal = total;
    }
  }
  return maxTotal;
};

const totalPlugin = {
  id: "totalPlugin",
  afterDatasetsDraw: (chart: Chart) => {
    const {
      ctx,
      scales: { x, y },
    } = chart;
    chart.data.datasets[0].data.forEach((value, index) => {
      let total = 0;
      chart.data.datasets.forEach((dataset) => {
        total += Number(dataset.data[index]);
      });

      const xPos = x.getPixelForValue(index);
      const yPos = y.getPixelForValue(total);

      ctx.save();
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(total.toString(), xPos, yPos - 10);
      ctx.restore();
    });
  },
};

Chart.register(totalPlugin);

interface WeeklyCaloriesStackedChartProps {
  breakfast: number[];
  lunch: number[];
  dinner: number[];
  snack: number[];
  labelDate: string[];
}

const WeeklyCaloriesStackedChart: React.FC<WeeklyCaloriesStackedChartProps> = ({
  breakfast,
  lunch,
  dinner,
  snack,
  labelDate,
}) => {
  const newjeans = {
    labels: labelDate,
    datasets: [
      {
        label: "아침",
        data: breakfast,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        stack: "Stack 0",
      },
      {
        label: "점심",
        data: lunch,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        stack: "Stack 0",
      },
      {
        label: "저녁",
        data: dinner,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        stack: "Stack 0",
      },
      {
        label: "간식",
        data: snack,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        stack: "Stack 0",
      },
    ],
  };
  const totalMax = calculateTotalMax(breakfast, lunch, dinner, snack);
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "주간 칼로리 섭취량",
        font: {
          size: 20,
          weight: "bold",
        },
        color: "#333",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        max: totalMax + 150,
      },
    },
  };

  return (
    <div>
      <Bar data={newjeans} options={options} height={400} />
    </div>
  );
};

export default WeeklyCaloriesStackedChart;
