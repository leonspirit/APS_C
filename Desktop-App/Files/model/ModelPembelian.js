/**
 * Created by Billy on 14-Sep-16.
 */

var baseUrl = "http://localhost:3000/"

function getLunasPembelianData(token, tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl + "pembelian/list_lunas_pembelian/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getHutangPembelianData(token, tgl_awal, tgl_akhir,fn)
{
    $.post( baseUrl + "pembelian/list_hutang_pembelian/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal
        }, function(  data ) {
            fn(data);
        }, "json");
}
function getAllPembelianData(token,tgl_awal, tgl_akhir, fn)
{
    $.post( baseUrl + "pembelian/list_pembelian/",
        {
            token: token,
            tgl_akhir:tgl_akhir,
            tgl_awal:tgl_awal
        }, function(  data ) {
            fn(data);
        }, "json");
}

function getJatuhTempoPembelianData(token,n, fn)
{
    $.post( baseUrl + "pembelian/list_pembelian_jatuh_tempo/",
        {
            token: token,
            n:n
        }, function(  data ) {
            fn(data);
        }, "json");
}


function AddPembelian(token, supplierID, tanggal_transaksi, jatuh_tempo, subtotal, disc, isPrinted, status, notes, satuan, voucher, fn)
{
    $.post( baseUrl + "pembelian/tambah_pembelian/",
        {
            token: token,
            supplierID: supplierID,
            tanggal_transaksi:tanggal_transaksi,
            jatuh_tempo:jatuh_tempo,
            subtotal:subtotal,
            disc:disc,
            isPrinted:isPrinted,
            status:status,
            notes:notes,
            satuan:satuan,
            voucher:voucher
        }, function(data) {
            fn(data);
        }, "json");
}

function GetDetailPembelian(token, pembelianID, fn)
{
    $.post( baseUrl + "pembelian/detail_pembelian/",
        {
            token: token,
            pembelianID: pembelianID
        }, function(  data ) {
            fn(data);
        }, "json");
}
function AddCicilanPembelian(token,pembelianID, tanggal_cicilan, nominal, notes, cara_pembayaran, bank, nomor_giro, tanggal_pencairan,fn )
{
    $.post( baseUrl + "pembelian/tambah_cicilan_pembelian/",
        {
            token: token,
            pembelianID: pembelianID,
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
function EditPembelian(token, pembelianID, tanggal_transaksi, jatuh_tempo, disc, notes, fn)
{
    $.post( baseUrl + "pembelian/edit_pembelian/",
        {
            token: token,
            pembelianID: pembelianID,
            tanggal_transaksi:tanggal_transaksi,
            jatuh_tempo:jatuh_tempo,
            disc:disc,
            notes:notes
        }, function(  data ) {
            fn(data);
        }, "json");
}
function EditPembelianBarang(token, pembelianbarangID, harga_per_biji, disc_1, disc_2, disc_3, fn)
{
    $.post( baseUrl + "pembelian/edit_pembelianbarang/",
        {
            token: token,
            pembelianbarangID: pembelianbarangID,
            harga_per_biji:harga_per_biji,
            disc_1:disc_1,
            disc_2:disc_2,
            disc_3:disc_3
        }, function(  data ) {
            fn(data);
        }, "json");
}

function AddReturPembelian(token, pembelianbarangID, tanggal, qty, metode, fn)
{
    $.post( baseUrl + "retur/tambah_retur_pembelian/",
        {
            token: token,
            pembelianbarangID: pembelianbarangID,
            tanggal:tanggal,
            quantity:qty,
            metode:metode
        }, function(  data ) {
            fn(data);
        }, "json");
}

function ListVoucherSupplier(token, supplierID, fn)
{
    $.post( baseUrl + "voucher/list_voucher_supplier_A/",
        {
            token: token,
            supplierID:supplierID
        }, function(  data ) {
            fn(data);
        }, "json");
}
function GetPembelianDariVoucher(token, voucherID, fn)
{
    $.post( baseUrl + "voucher/get_voucher_pembelian/",
        {
            token: token,
            voucherpembelianID:voucherID
        }, function(  data ) {
            fn(data);
        }, "json");
}

function ChangePembelianPrintedStatus(token, pembelianID, fn)
{
    $.post( baseUrl + "pembelian/change_printed_status/",
        {
            token: token,
            pembelianID:pembelianID
        }, function(  data ) {
            fn(data);
        }, "json");
}


//connection.end();