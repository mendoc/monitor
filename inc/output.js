const output = {
    lister: function (data) {
        var keys = Object.keys(data);
        var out = "<table cellspacing='10'><thead><tr>";
        out += "<td>Clients</td>";
        out += "<td>Dernier ping</td>";
        out += "<td>Dossier</td>";
        out += "<td>IP</td>";
        out += "<td>Version</td>";
        out += "</tr></thead>";
        keys.forEach(function(client){
            var time = new Date(parseInt(data[client].time)*1000);
            out += "<tr>";
            out += "<td>"+client+"</td>";
            out += "<td>"+time.getDate() + "/" + time.getMonth() + " à " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()+"</td>";
            out += "<td>"+data[client].dir || "-" +"</td>";
            out += "<td>"+data[client].ip+"</td>";
            out += "<td>"+data[client].ver+"</td>";
            out += "</tr>";
        });
        out += "</table>";
        return out;
    },
    message: function (msg) {
        return "<pre>"+msg+"</pre>"
    }
};

module.exports = output;