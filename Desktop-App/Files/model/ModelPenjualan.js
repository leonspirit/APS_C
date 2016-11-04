/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/"



function getLunasPenjualanData(token, fn)
{
    $.post( baseUrl + "penjualan/list_lunas_penjualan/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getPiutangPenjualanData(token, fn)
{
    $.post( baseUrl + "penjualan/list_piutang_penjualan/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getAllpenjualanData(token, fn)
{
    $.post( baseUrl + "penjualan/list_penjualan/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}

//connection.end();