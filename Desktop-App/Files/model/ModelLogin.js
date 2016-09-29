/**
 * Created by Billy on 28-Sep-16.
 */


var baseUrl = "http://localhost:3000/";

String.prototype.hashCode = function()
{
    var hash = 0, i, chr, len;
    if (this.length === 0)
        return hash;
    for (i = 0, len = this.length; i < len; i++)
    {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function UserLogin(username, password, fn)
{
    $.post( baseUrl+"karyawan/login/",
        {
            username:username,
            password:password
        },function( data ) {
            fn(data);
        }, "json");
}

function UserLogout(token, fn)
{
    $.post( baseUrl + "karyawan/logout/",
        {
            token: token
        }, function(  data ) {
            fn(data);
        }, "json");
}
