// Custom Style JS.
let chart = sessionStorage;
let starts = parseInt(chart.getItem('avg_of_starts')),
  transfer = parseInt(chart.getItem('avg_of_transfers'));

// Animations initialization
new WOW().init();

// Line in dashbord html
var ctx = document.getElementById("TransfersChart").getContext('2d');
var TransfersChart = new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [
      {
        label: 'Starts ',
        data: [starts],
        backgroundColor: '#0000FF'
      },
      {
        label: 'Transfers',
        data: [transfer],
        backgroundColor: '#FF0000',
      }
    ]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// // 
// var ctxBc = document.getElementById('bubbleChart').getContext('2d');
// var bubbleChart = new Chart(ctxBc, {
//   type: 'bubble',
//   data: {
//     datasets: [{
//       label: 'John',
//       data: [{
//         x: 3,
//         y: 7,
//         r: 10
//       }],
//       backgroundColor: "#ff6384",
//       hoverBackgroundColor: "#ff6384"
//     }, {
//       label: 'Peter',
//       data: [{
//         x: 5,
//         y: 7,
//         r: 10
//       }],
//       backgroundColor: "#44e4ee",
//       hoverBackgroundColor: "#44e4ee"
//     }, {
//       label: 'Donald',
//       data: [{
//         x: 7,
//         y: 7,
//         r: 10
//       }],
//       backgroundColor: "#62088A",
//       hoverBackgroundColor: "#62088A"
//     }]
//   }
// })

// Material Select Initialization
$(document).ready(function () {
  $('.mdb-select').materialSelect();
});

