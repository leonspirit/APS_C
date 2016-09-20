var express = require('express');
var app = express();

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
    var temp = []
    var stok1 = {"kode":1, "nama":"sendok", "stok":100, "harga_jual":1000, "harga_pokok":1500};
    var stok2 = {"kode":2, "nama":"garpu", "stok":50, "harga_jual":1200, "harga_pokok":1400};
    var stok3 = {"kode":3, "nama":"piring", "stok":150, "harga_jual":5000, "harga_pokok":5500};

    temp.push(stok1);
    temp.push(stok2);
    temp.push(stok3);

    console.log(temp);
    res.send(JSON.stringify(temp));
});
