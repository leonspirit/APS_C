/**
 * Created by Billy on 14-Sep-16.
 */


var mysql  =  require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: '',
    database: 'tokokohong-test'
})
connection.connect();
function getData() {
    connection.query('select * from pelanggan', function (err, rows, fields) {
        if (!err) {
            var i
            for (i = 0; i < rows.length; i++) {
                var table = document.getElementById('PelangganTable');

                var rowCount = table.rows.length;
                var row = table.insertRow(rowCount);

                var cell1 = row.insertCell(0);
                cell1.innerHTML = rows[i].id;

                var cell2 = row.insertCell(1);
                cell2.innerHTML = rows[i].nama;

                var cell3 = row.insertCell(2);
                cell3.innerHTML = rows[i].telp;

                var cell4 = row.insertCell(3);
                cell4.innerHTML = rows[i].alamat;

                var cell5 = row.insertCell(4);

                var editButton = document.createElement("a");
                var editIcon = document.createElement("i");
                editIcon.setAttribute("class", "glyphicon glyphicon-edit");
                editButton.appendChild(editIcon);

                var delButton = document.createElement("a");
                delButton.setAttribute("href", "");
                delButton.setAttribute("style", "color:red;")
                var delIcon = document.createElement("i");
                delIcon.setAttribute("class", "glyphicon glyphicon-remove");
                delButton.appendChild(delIcon);

                cell5.appendChild(editButton);
                cell5.innerHTML += " ";
                cell5.appendChild(delButton);

            }
        }
        else {
            console.log("Error query");
        }
    })
}
//connection.end();