import React, { useState } from "react";
import { Chart } from "primereact/chart";
import colors from "../../themes/colors";

const DoughnutChart = () => {
  const [chartData] = useState({
    labels: ["Study", "Exercise", "Read"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          colors.brand.yellow[200],
          colors.brand.red[300],
          colors.brand.lightGray,
        ],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  });

  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  });

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",

        height: "100%",
        width: "100%",
      }}
    >
      <Chart
        type="doughnut"
        data={chartData}
        options={lightOptions}
        style={{
          margin: "auto",
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

export default DoughnutChart;
