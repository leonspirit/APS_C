<?php

session_start();
include ('connection/connection.php');
if ($_POST['user']=="admin" && $_POST['pass']=="admin")
{
	header("Location:Stok.php?stat=admin");
}
else 
{
    header("Location:Stok.php");
}
?>