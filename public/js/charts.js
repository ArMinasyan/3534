// Charts.js
let chart=sessionStorage;
    let full=parseInt(chart.getItem('avg_of_starts'))+parseInt(chart.getItem('avg_of_transfers')), full_p=100,
    starts=parseInt(chart.getItem('avg_of_starts')),
    starts_p=parseInt(chart.getItem('avg_of_transfers'))/(parseInt(chart.getItem('avg_of_starts')))*100,
    transfer=parseInt(chart.getItem('avg_of_transfers')),
    transfer_p=100-parseInt((parseInt(chart.getItem('avg_of_transfers'))/(parseInt(chart.getItem('avg_of_starts')))));

    $('#full').text(full);
    $('#full_p').text(full_p+'%');

    $('#starts').text(starts.toString());
    $('#starts_p').text(starts_p.toPrecision(4));

    $('#transfer').text(transfer.toString());
    $('#transfer_p').text((100-starts_p).toPrecision(2));



var ctxP = document.getElementById("labelChart").getContext('2d');
var myPieChart = new Chart(ctxP, {
  plugins: [ChartDataLabels],
  type: 'pie',
  data: {
    labelTitle : " Starts that transferred ", 
    labels: [
        "Starts that didn't transfer "+ parseInt(starts_p)+'%', 
        "Starts that transferred "+parseInt((100-starts_p))+'%'
    ],
    datasets: [{
      data: [
        parseInt(starts_p.toPrecision(4)), 
        parseInt((100-starts_p).toPrecision(2)),
        ],
      backgroundColor: [
        "#EC1424", 
        "#3D5170"
      ],
    }]
  },
  options: {
    responsive: true,
    legend: {
      position: 'right',
      labels: {
        padding: 20,
        boxWidth: 10
      }
    },
    plugins: {
      datalabels: {
        // formatter: (value, ctx) => {
        //   let sum = 0;
        //   let dataArr = ctx.chart.data.datasets[0].data;
        //   dataArr.map(data => {
        //     sum += data;
        //   });
        //   let percentage = (value * 100 / sum).toFixed(2) + "%";
        //   return percentage;
        // },
        color: 'white',
        labels: {
          title: {
            
            font: {
              size: '16'
            }
          }
        }
      }
    }
  }
});


$(document).ready(function (e) {

  $.get('/item').then(function (data) {
    // console.log({
    //   "Starts that didn't transfer": data.avg_of_starts,
    //   "Starts that didn't transfer %": Math.round((data.avg_of_starts / data.avg_of_st) * 100),
    //   'Starts that transferred': data.avg_of_transfers,
    //   'Starts that transferred %': Math.round((data.avg_of_transfers / data.avg_of_st) * 100),
    //   'Average number of start': data.avg_of_st,
    // });
    // data. avg_of_arc_hours es mek@ der chka chartum vonc vor
    data.data_array.forEach((elem, index) => {
      $('#tablechart').append(
        '<tr>' +
        '<th scope="row">' + parseInt(index + 1) + '</th>' +
        '<td class="text-left">' + elem.manufacturer + '</td>' +
        '<td class="text-left">' + elem.assetId + '</td>' +
        '<td class="text-left">' + elem.UUID + '</td>' +
        '<td class="text-left">' + elem.NumberOfStarts + '</td>' +
        '<td class="text-left">' + elem.NumberOfTransfers + '</td>' +
        '<td class="text-left">' + elem.ManufacturingDate + '</td>' +
        '<td class="text-left">' + elem.PartNumber + '</td>' +
        '<td class="text-left">' + elem.timestamp + '</td>' +
        '</tr>'
      )
    });
  })
});


$(document).ready(function (e) {
  $.get('/item').then(function (data) {
    data.forEach((item, index) => {
      $('#transferchart').append(
        '<tr>' +
        '<th scope="row" class="table-title">' + parseInt(index + 1) + '</th>' +
        '<td class="table-subtitle">' + item.avg_of_starts + '</td>' +
        '<td class="table-subtitle">' + item.avg_of_starts + '</td>' +
        '<td class="table-subtitle">' + item.avg_of_starts + '</td>' +
        '</tr>'
      )
    });
  })
})



