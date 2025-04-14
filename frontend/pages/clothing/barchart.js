import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barChart = ({ labels, dataset, chartTitle }) => {
	const data = {
		labels: labels,
		datasets: [{
			label: chartTitle,
			data: dataset,
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1
		},
	  ],
	};
	
	const config = {
		scales: {
			y: {
				beginAtZero: true
			}
		}
	};
	
	return <Bar data={data} options={config} />
};

export default barChart;