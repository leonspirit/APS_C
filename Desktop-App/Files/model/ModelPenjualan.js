/**
 * Created by Billy on 14-Sep-16.
 */


var baseUrl = "http://localhost:3000/";



function getLunasPenjualanData(token, tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl + "penjualan/list_lunas_penjualan/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getPiutangPenjualanData(token, tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl + "penjualan/list_piutang_penjualan/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getBarangPenjualanData(token, barangID, tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl + "penjualan/list_penjualan_barang_A/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal,
            barangID:barangID
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getAllPenjualanData(token, tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl + "penjualan/list_penjualan/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getJatuhTempoPenjualanData(token, n, fn)
{
    $.post( baseUrl + "penjualan/list_penjualan_jatuh_tempo/",
        {
            token: token,
            n:n
        }, function(  data ) {
            fn(data);
        }, "json");
}


function AddPenjualan(token, pelangganID, tanggal_transaksi, jatuh_tempo, subtotal, isPrinted, status, notes, alamat, satuan, voucher, fn)
{
    console.log("asaudia")
    console.log(voucher);
    $.post( baseUrl + "penjualan/tambah_penjualan/",
        {
            token: token,
            pelangganID: pelangganID,
            tanggal_transaksi:tanggal_transaksi,
            jatuh_tempo:jatuh_tempo,
            subtotal:subtotal,
            isPrinted:isPrinted,
            status:status,
            notes:notes,
            alamat:alamat,
            satuan:satuan,
            voucher:voucher
        }, function(data) {
            fn(data);
        }, "json");
}

function GetDetailPenjualan(token, penjualanID, fn)
{
    $.post( baseUrl + "penjualan/detail_penjualan/",
        {
            token: token,
            penjualanID: penjualanID
        }, function(  data ) {
            fn(data);
        }, "json");
}

function AddCicilanPenjualan(token,penjualanID, tanggal_cicilan, nominal, notes, cara_pembayaran, bank, nomor_giro, tanggal_pencairan,fn )
{
    $.post( baseUrl + "penjualan/tambah_cicilan_penjualan/",
        {
            token: token,
            penjualanID: penjualanID,
            tanggal_cicilan:tanggal_cicilan,
            nominal:nominal,
            notes:notes,
            cara_pembayaran:cara_pembayaran,
            bank:bank,
            nomor_giro:nomor_giro,
            tanggal_pencairan:tanggal_pencairan
        }, function(  data ) {
            fn(data);
        }, "json");
}

function EditPenjualan(token, penjualanID, tanggal_transaksi, jatuh_tempo, alamat, notes, fn)
{
    $.post( baseUrl + "penjualan/edit_penjualan/",
        {
            token: token,
            alamat:alamat,
            penjualanID: penjualanID,
            tanggal_transaksi:tanggal_transaksi,
            jatuh_tempo:jatuh_tempo,
            notes:notes
        }, function(  data ) {
            fn(data);
        }, "json");
}
function EditPenjualanBarang(token, penjualanbarangID, harga_jual_saat_ini, disc, fn)
{
    $.post( baseUrl + "penjualan/edit_penjualanbarang/",
        {
            token: token,
            penjualanbarangID: penjualanbarangID,
            harga_jual_saat_ini:harga_jual_saat_ini,
            disc:disc
        }, function(  data ) {
            fn(data);
        }, "json");
}
function AddReturPenjualan(token, penjualanbarangID, tanggal, qty, metode, fn)
{
    $.post( baseUrl + "retur/tambah_retur_penjualan/",
        {
            token: token,
            penjualanbarangID: penjualanbarangID,
            tanggal:tanggal,
            quantity:qty,
            metode:metode
        }, function(  data ) {
            fn(data);
        }, "json");
}

function ListVoucherPelanggan(token, pelangganID, fn)
{
    $.post( baseUrl + "voucher/list_voucher_pelanggan_A/",
        {
            token: token,
            pelangganID:pelangganID
        }, function(  data ) {
            fn(data);
        }, "json");
}
function GetPenjualanDariVoucher(token, voucherID, fn)
{
    $.post( baseUrl + "voucher/get_voucher_penjualan/",
        {
            token: token,
            voucherpenjualanID:voucherID
        }, function(  data ) {
            fn(data);
        }, "json");
}



//connection.end();