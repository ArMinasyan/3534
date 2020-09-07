$(document).on('click', '#logout', function () {
    $.ajax({
        url: '/logout',
        method: 'DELETE',
        success: function (data) {
            if (!data.login) window.location.href = '/';
        }
    })
})

$(document).ready(function () {
    $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
   
    $.get('/item', function (res) {

        $('#Live').DataTable({
            serverside: true,
            data: res.data,
            "scrollX": true,
            "columnDefs": [{
                'visible': false,

                'targets': [11, 12, 13, 14, 15, 16, 17, 18]
            }],
            'columnDefs': [
                {
                    'className': "text-center",
                    'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'sortable': false,
                    'width': "13%",
                    'render': function (data, type, row, meta) {
                        if (type === 'display') data = '<div class="float-left">' +
                            '<input type="checkbox" class="dt-checkboxes">' +
                            '<button class="btn btn-primary btn-sm">Show Chart</button>' +
                            '</div>';
                        return data
                    },
                    'checkboxes': {
                        'selectRow': true,
                    }
                }
            ],
        });

        let str

        sessionStorage.setItem("avg_of_starts", res.chart[0]);
        sessionStorage.setItem("avg_of_transfers", res.chart[1])
        sessionStorage.setItem("avg_of_arc_hours", res.chart[2])
    })
});

let st_avg = 0, st_tr = 0;

$(document).on('change', '#Live tbody tr', function (e) {

    $("#dialog_avg").dialog();

    $('#dialog_avg').removeAttr("hidden")


    if ($(this).hasClass('checked')) {
        st_avg -= parseInt($('#Live').DataTable().row(this).data()[8]);
        st_tr -= parseInt($('#Live').DataTable().row(this).data()[9]);
        $(this).removeClass('checked');
    } else {
        st_avg += parseInt($('#Live').DataTable().row(this).data()[8]);
        st_tr += parseInt($('#Live').DataTable().row(this).data()[9]);
        $(this).addClass('checked');
    }
    $('#SAvg').text(st_avg);
    $('#TAvg').text(st_tr);
})

$('#Live tbody').on('click', 'button', function () {


    let data = $('#Live').DataTable().row($(this).parent().parent().parent()).data();
    $("#manufacturer").text(data[0]);
    $("#assetId").text(data[1]);
    $("#UUID").text(data[2]);
    $("#EndofLive").text(data[3]);
    $("#ArcTime").text(data[4]);
    $("#PilotTime").text(data[5]);
    $("#TransferTime").text(data[6]);
    $("#NumberOfStarts").text(data[7]);
    $("#NumberOfTransfers").text(data[8]);
    $("#ManufacturingDate").text(data[9]);
    $("#PartNumber").text(data[10]);
    $("#timestamp").text(data[11]);
    $("#deviceUUID").text(data[12]);
    $("#ManufacturingTestStatus").text(data[13]);
    $("#Faults").text(data[14]);
    $("#CartrigeType").text(data[15]);
    $("#SerialNumber").text(data[16]);
    $("#PartNumberRevision").text(data[17]);
    $("#CartrigeDesignRevision").text(data[18]);


    $("#dialog").dialog({
        modal: false,
        width: "800px",

    });

    $('#dialog').removeAttr("hidden")

    ownChart(parseInt(data[8]), parseInt(data[9]))



});


let ownChart = (a, b) => {
    let ctxD = document.getElementById("doughnutChart").getContext('2d');
    new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: ["Starts", "Transfers"],
            datasets: [{
                data: [a, b],
                backgroundColor: ["#00FF00", "#FF0000"],
            }]
        },
        options: {
            responsive: true
        }
    });
}