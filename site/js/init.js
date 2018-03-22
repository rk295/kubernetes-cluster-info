$(document).ready(function() {

    $.get('pods.json', process_pods);
    $.get('svcs.json', process_svcs);
    $.get('ing.json', process_ings);
    $.get('nodes.json', process_nodes);

    $('#clusterName').append(site_name);
});

site_name = window.location.hostname;
pre_filename = site_name

columns = {
    "pod": [{
            "data": "repository",
            "title": "Repository"
        },
        {
            "data": "containerName",
            "title": "Container Name"
        },
        {
            "data": "containerVersion",
            "title": "Container Version"
        },
        {
            "data": "podName",
            "title": "Pod Name"
        },
        {
            "data": "limitsCpu",
            "title": "Limits CPU",
            "mRender": function(data) {
                return fix_cpu(data);
            }
        },
        {
            "data": "limitsMemory",
            "title": "Limits Memory (Mi)",
            "mRender": function(data) {
                return fix_memory(data);
            }
        },
        {
            "data": "requestsCpu",
            "title": "Requests CPU",
            "mRender": function(data) {
                return fix_cpu(data);
            }
        },
        {
            "data": "requestsMemory",
            "mRender": function(data) {
                return fix_memory(data);
            },
            "title": "Requests Memory (Mi)"
        },
        {
            "data": "startedAt",
            "title": "Started At"
        },
        {
            "data": "namespace",
            "title": "Namespace"
        }
    ],
    "service": [{
            "data": "Name",
            "title": "Name"
        },
        {
            "data": "Created At",
            "title": "Created At"
        },
        {
            "data": "Namespace",
            "title": "Namespace"
        },
        {
            "data": "ClusterIP",
            "title": "ClusterIP"
        },
        {
            "data": "Port",
            "title": "Port"
        },
        {
            "data": "Target Port",
            "title": "Target Port"
        },
        {
            "data": "Protocol",
            "title": "Protocol"
        },
        {
            "data": "Type",
            "title": "Type"
        },
        {
            "data": "Selector",
            "title": "Selector"
        }
    ],
    "ingress": [{
            "data": "Name",
            "title": "Name"
        },
        {
            "data": "Created At",
            "title": "Created At"
        },
        {
            "data": "Namespace",
            "title": "Namespace"
        },
        {
            "data": "Public DNS",
            "title": "Public DNS",
            "mRender": function(data) {
                return '<a href="' + data + '">' + data + '</a>';
            },
        },
        {
            "data": "Whitelist",
            "title": "Whitelist"
        },
        {
            "data": "TLS",
            "title": "TLS"
        }
    ],
    "node": [{
            "data": "Name",
            "title": "Name"
        },
        {
            "data": "Creation Timestamp",
            "title": "Created At"
        },
        {
            "data": "Hostname",
            "title": "Hostname"
        },
        {
            "data": "Instance Type",
            "title": "Instance Type",
            "mRender": function(data) {
                return '<a href="http://www.ec2instances.info/?region=eu-west-1&cost_duration=monthly&selected=' + data + '">' + data + '</a> ';
            },
        },
        {
            "data": "Region",
            "title": "Region"
        },
        {
            "data": "Availability Zone",
            "title": "Availability Zone"
        },
        {
            "data": "Role",
            "title": "Role"
        }
    ]
};


function fix_memory(data) {
    if (data != null && data.endsWith("Gi")) {
        fixed = data.replace('Gi', '') * 1024;
    } else if (data != null && data.endsWith("Mi")) {
        fixed = data.replace('Mi', '');
    } else {
        fixed = data;
    }
    return fixed;
}

function fix_cpu(data) {
    if (data != null && data.endsWith("m")) {
        fixed = data.replace('m', '') / 1000;
    } else {
        fixed = data;
    }
    return fixed;
}

function process_data(data, kind) {
    console.log(kind);

    tableName = '#' + kind + 'table'

    console.log("set target table name=" + tableName);

    var table = $(tableName).DataTable({
        "data": data,
        "iDisplayLength": 100,
        buttons: [{
            extend: 'csv',
            title: pre_filename + ' ' + kind + ' report'
        }],
        columns: columns[kind]
    });

    table.buttons().container()
        .appendTo($('.col-sm-6:eq(0)', table.table().container()));

}

function process_pods(data, status) {
    process_data(data.pods, "pod");
}

function process_svcs(data, status) {
    process_data(data.svcs, "service");
}

function process_ings(data, status) {
    process_data(data.ings, "ingress");
}

function process_nodes(data, status) {
    process_data(data.nodes, "node");
}
