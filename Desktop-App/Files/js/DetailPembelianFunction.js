/**
 * Created by Billy on 04-Nov-16.
 */

var currentToken = localStorage.getItem("token");
var currentPembelianID = 20;
function populateDetailPembelian()
{
    GetDetailPembelian(currentToken, currentPembelianID, function(result)
    {
        if (result.token_status=="success")
        {
            var  itemPembelianTable =$("#itemTable").dataTable({
               "lengthChange": true,
                "ordering": true,
                "info": true,
                "autoWidth": false
            });
            var i;
            for (i=0;i<result.barang.length;i++)
            {
                itemPembelianTable.row.add([
                    result.barang[i].pembelianbarangID,
                    "",
                    result.barang[i].quantity,
                    "<span class='pull-right'>Rp. "+numberWithCommas(result.barang[i].harga_per_biji)+"</span>",
                    result.barang[i].disc1 +"%",
                    result.barang[i].disc2 +"%",
                    result.barang[i].disc3 +"%",
                    "<span class='pull-right'>Rp. "+numberWithCommas(result.barang[i].subtotal)+"</span>",
                    ""
                ]);
            }
        }
        else
        {
            createAlert("danger", "Terdapat kesalahan pada autentikasi akun anda atau anda tidak memiliki hak akses yang benar, mohon log out lalu log in kembali ");
        }
    });
}
