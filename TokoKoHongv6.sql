-- MySQL dump 10.16  Distrib 10.1.16-MariaDB, for osx10.6 (i386)
--
-- Host: localhost    Database: TokoKoHong
-- ------------------------------------------------------
-- Server version	10.1.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `barang`
--

DROP TABLE IF EXISTS `barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `barang` (
  `barangID` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) DEFAULT NULL,
  `harga_pokok` int(11) DEFAULT NULL,
  PRIMARY KEY (`barangID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang`
--

LOCK TABLES `barang` WRITE;
/*!40000 ALTER TABLE `barang` DISABLE KEYS */;
INSERT INTO `barang` VALUES (26,'sendok',1000),(27,'garpu',990),(28,'piring',2980),(29,'piringrino',0);
/*!40000 ALTER TABLE `barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cicilanpembelian`
--

DROP TABLE IF EXISTS `cicilanpembelian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cicilanpembelian` (
  `cicilanpembelianID` int(11) NOT NULL AUTO_INCREMENT,
  `pembelianID` int(11) DEFAULT NULL,
  `tanggal_cicilan` date DEFAULT NULL,
  `nominal` int(11) DEFAULT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `cara_pembayaran` varchar(30) DEFAULT NULL,
  `bank` varchar(30) DEFAULT NULL,
  `nomor_giro` varchar(30) DEFAULT NULL,
  `tanggal_pencairan` date DEFAULT NULL,
  PRIMARY KEY (`cicilanpembelianID`),
  KEY `CICILAN_PEMBELIAN_FK` (`pembelianID`),
  CONSTRAINT `CICILAN_PEMBELIAN_FK` FOREIGN KEY (`pembelianID`) REFERENCES `pembelian` (`pembelianID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cicilanpembelian`
--

LOCK TABLES `cicilanpembelian` WRITE;
/*!40000 ALTER TABLE `cicilanpembelian` DISABLE KEYS */;
/*!40000 ALTER TABLE `cicilanpembelian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cicilanpenjualan`
--

DROP TABLE IF EXISTS `cicilanpenjualan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cicilanpenjualan` (
  `cicilanpenjualanID` int(11) NOT NULL AUTO_INCREMENT,
  `penjualanID` int(11) DEFAULT NULL,
  `tanggal_cicilan` date DEFAULT NULL,
  `nominal` int(11) DEFAULT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `cara_pembayaran` varchar(30) DEFAULT NULL,
  `bank` varchar(30) DEFAULT NULL,
  `nomor_giro` varchar(30) DEFAULT NULL,
  `tanggal_pencairan` date DEFAULT NULL,
  PRIMARY KEY (`cicilanpenjualanID`),
  KEY `CICILAN_PENJUALAN_FK` (`penjualanID`),
  CONSTRAINT `CICILAN_PENJUALAN_FK` FOREIGN KEY (`penjualanID`) REFERENCES `penjualan` (`penjualanID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cicilanpenjualan`
--

LOCK TABLES `cicilanpenjualan` WRITE;
/*!40000 ALTER TABLE `cicilanpenjualan` DISABLE KEYS */;
/*!40000 ALTER TABLE `cicilanpenjualan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hakakses`
--

DROP TABLE IF EXISTS `hakakses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hakakses` (
  `hakaksesID` int(11) NOT NULL AUTO_INCREMENT,
  `karyawanID` int(11) DEFAULT NULL,
  `nama` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`hakaksesID`),
  KEY `KARYAWAN_AKSES_FK` (`karyawanID`),
  CONSTRAINT `KARYAWAN_AKSES_FK` FOREIGN KEY (`karyawanID`) REFERENCES `karyawan` (`karyawanID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hakakses`
--

LOCK TABLES `hakakses` WRITE;
/*!40000 ALTER TABLE `hakakses` DISABLE KEYS */;
INSERT INTO `hakakses` VALUES (7,2,'stok'),(8,2,'laporan_penjualan'),(9,2,'hutang'),(10,2,'piutang'),(11,2,'laba'),(12,2,'daftar_supplier'),(13,2,'daftar_pelanggan'),(14,2,'daftar_karyawan'),(36,6,'daftar_pelanggan'),(37,6,'stok'),(38,6,'daftar_supplier'),(39,6,'hutang'),(40,6,'piutang');
/*!40000 ALTER TABLE `hakakses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `karyawan`
--

DROP TABLE IF EXISTS `karyawan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `karyawan` (
  `karyawanID` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) DEFAULT NULL,
  `telp` varchar(20) DEFAULT NULL,
  `alamat` varchar(100) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`karyawanID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `karyawan`
--

LOCK TABLES `karyawan` WRITE;
/*!40000 ALTER TABLE `karyawan` DISABLE KEYS */;
INSERT INTO `karyawan` VALUES (2,'billy bonkas','0841239417','Jl. PuKer 19','billy','bonka','aktif'),(3,'pypqwefqwf','081234812639784','jl samting','streamz','abcde','inaktif'),(5,'arianto','081423','puncak kertajaya','leonspirit','pyupyupyu','aktif'),(6,'ariari','081234812639784','jl gatau','disisis','abcde','aktif');
/*!40000 ALTER TABLE `karyawan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pelanggan`
--

DROP TABLE IF EXISTS `pelanggan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pelanggan` (
  `pelangganID` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) DEFAULT NULL,
  `telp` varchar(20) DEFAULT NULL,
  `alamat` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`pelangganID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelanggan`
--

LOCK TABLES `pelanggan` WRITE;
/*!40000 ALTER TABLE `pelanggan` DISABLE KEYS */;
INSERT INTO `pelanggan` VALUES (1,'Arianto Wibowo','0839183234','Jl Babatan Mutki M 72'),(4,'pyupyupyu','08123423','Jl. PyuPyuPyu'),(5,'tester','081234','myhome'),(6,'testses','08413241234','pyuyupyu');
/*!40000 ALTER TABLE `pelanggan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pembelian`
--

DROP TABLE IF EXISTS `pembelian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pembelian` (
  `pembelianID` int(11) NOT NULL AUTO_INCREMENT,
  `supplierID` int(11) DEFAULT NULL,
  `tanggal_transaksi` date DEFAULT NULL,
  `jatuh_tempo` date DEFAULT NULL,
  `subtotal` int(11) DEFAULT NULL,
  `karyawanID` int(11) DEFAULT NULL,
  `disc` float DEFAULT NULL,
  `isPrinted` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`pembelianID`),
  KEY `SUPPLIER_FK` (`supplierID`),
  KEY `PEMBELIAN_KARY_FK` (`karyawanID`),
  CONSTRAINT `PEMBELIAN_KARY_FK` FOREIGN KEY (`karyawanID`) REFERENCES `karyawan` (`karyawanID`),
  CONSTRAINT `SUPPLIER_FK` FOREIGN KEY (`supplierID`) REFERENCES `supplier` (`supplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pembelian`
--

LOCK TABLES `pembelian` WRITE;
/*!40000 ALTER TABLE `pembelian` DISABLE KEYS */;
/*!40000 ALTER TABLE `pembelian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pembelianbarang`
--

DROP TABLE IF EXISTS `pembelianbarang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pembelianbarang` (
  `pembelianbarangID` int(11) NOT NULL AUTO_INCREMENT,
  `pembelianID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `harga_per_biji` int(11) DEFAULT NULL,
  `disc_1` float DEFAULT NULL,
  `disc_2` float DEFAULT NULL,
  `disc_3` float DEFAULT NULL,
  `satuanID` int(11) DEFAULT NULL,
  `stokID` int(11) DEFAULT NULL,
  PRIMARY KEY (`pembelianbarangID`),
  KEY `PEMBELIAN_FK` (`pembelianID`),
  KEY `FK_SATUAN_PEMBELIAN` (`satuanID`),
  KEY `PEMBELIAN_STOK_FK` (`stokID`),
  CONSTRAINT `FK_SATUAN_PEMBELIAN` FOREIGN KEY (`satuanID`) REFERENCES `satuanbarang` (`satuanID`),
  CONSTRAINT `PEMBELIAN_FK` FOREIGN KEY (`pembelianID`) REFERENCES `pembelian` (`pembelianID`),
  CONSTRAINT `PEMBELIAN_STOK_FK` FOREIGN KEY (`stokID`) REFERENCES `stok` (`stokID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pembelianbarang`
--

LOCK TABLES `pembelianbarang` WRITE;
/*!40000 ALTER TABLE `pembelianbarang` DISABLE KEYS */;
/*!40000 ALTER TABLE `pembelianbarang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penjualan`
--

DROP TABLE IF EXISTS `penjualan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `penjualan` (
  `penjualanID` int(11) NOT NULL AUTO_INCREMENT,
  `pelangganID` int(11) DEFAULT NULL,
  `tanggal_transaksi` date DEFAULT NULL,
  `jatuh_tempo` date DEFAULT NULL,
  `subtotal` int(11) DEFAULT NULL,
  `karyawanID` int(11) DEFAULT NULL,
  `isPrinted` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `alamat` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`penjualanID`),
  KEY `PELANGGAN_FK` (`pelangganID`),
  KEY `PENJUALAN_KARY_FK` (`karyawanID`),
  CONSTRAINT `PELANGGAN_FK` FOREIGN KEY (`pelangganID`) REFERENCES `pelanggan` (`pelangganID`),
  CONSTRAINT `PENJUALAN_KARY_FK` FOREIGN KEY (`karyawanID`) REFERENCES `karyawan` (`karyawanID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penjualan`
--

LOCK TABLES `penjualan` WRITE;
/*!40000 ALTER TABLE `penjualan` DISABLE KEYS */;
INSERT INTO `penjualan` VALUES (18,1,'2016-05-05','2016-05-11',100000,2,0,'belum lunas',NULL),(19,1,'2016-05-05','2016-05-11',100000,2,0,'belum lunas','Jl Babatan Mukti M68'),(20,1,'2016-05-05','2016-05-11',100000,2,0,'belum lunas','Jl Babatan Mukti M68');
/*!40000 ALTER TABLE `penjualan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penjualanbarang`
--

DROP TABLE IF EXISTS `penjualanbarang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `penjualanbarang` (
  `penjualanbarangID` int(11) NOT NULL AUTO_INCREMENT,
  `penjualanID` int(11) DEFAULT NULL,
  `satuanID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `disc` float DEFAULT NULL,
  `harga_pokok_saat_ini` int(11) DEFAULT NULL,
  `harga_jual_saat_ini` int(11) DEFAULT NULL,
  `stokID` int(11) DEFAULT NULL,
  PRIMARY KEY (`penjualanbarangID`),
  KEY `PENJUALAN_FK` (`penjualanID`),
  KEY `SATUAN_FK` (`satuanID`),
  KEY `PENJUALANBARANG_STOK_FK` (`stokID`),
  CONSTRAINT `PENJUALANBARANG_STOK_FK` FOREIGN KEY (`stokID`) REFERENCES `stok` (`stokID`),
  CONSTRAINT `PENJUALAN_FK` FOREIGN KEY (`penjualanID`) REFERENCES `penjualan` (`penjualanID`),
  CONSTRAINT `SATUAN_FK` FOREIGN KEY (`satuanID`) REFERENCES `satuanbarang` (`satuanID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penjualanbarang`
--

LOCK TABLES `penjualanbarang` WRITE;
/*!40000 ALTER TABLE `penjualanbarang` DISABLE KEYS */;
INSERT INTO `penjualanbarang` VALUES (17,18,7,10,50,0,1500,NULL),(18,18,9,15,10,0,6500,NULL),(19,19,7,10,50,0,1500,NULL),(20,19,9,15,10,0,6500,NULL),(21,20,7,10,50,1000,1500,NULL),(22,20,9,15,10,2980,6500,NULL);
/*!40000 ALTER TABLE `penjualanbarang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returpembelian`
--

DROP TABLE IF EXISTS `returpembelian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `returpembelian` (
  `returpembelianID` int(11) NOT NULL AUTO_INCREMENT,
  `pembelianbarangID` int(11) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `karyawanID` int(11) DEFAULT NULL,
  PRIMARY KEY (`returpembelianID`),
  KEY `PEMBELIAN_RETUR_FK` (`pembelianbarangID`),
  KEY `RETURPEMBELIAN_KARYAWAN_FK` (`karyawanID`),
  CONSTRAINT `PEMBELIAN_RETUR_FK` FOREIGN KEY (`pembelianbarangID`) REFERENCES `pembelianbarang` (`pembelianbarangID`),
  CONSTRAINT `RETURPEMBELIAN_KARYAWAN_FK` FOREIGN KEY (`karyawanID`) REFERENCES `karyawan` (`karyawanID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returpembelian`
--

LOCK TABLES `returpembelian` WRITE;
/*!40000 ALTER TABLE `returpembelian` DISABLE KEYS */;
/*!40000 ALTER TABLE `returpembelian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returpenjualan`
--

DROP TABLE IF EXISTS `returpenjualan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `returpenjualan` (
  `returpenjualanID` int(11) NOT NULL AUTO_INCREMENT,
  `penjualanbarangID` int(11) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `karyawanID` int(11) DEFAULT NULL,
  PRIMARY KEY (`returpenjualanID`),
  KEY `PENJUALAN_RETUR_FK` (`penjualanbarangID`),
  KEY `RETURPENJUALAN_KARYAWAN_FK` (`karyawanID`),
  CONSTRAINT `PENJUALAN_RETUR_FK` FOREIGN KEY (`penjualanbarangID`) REFERENCES `penjualanbarang` (`penjualanbarangID`),
  CONSTRAINT `RETURPENJUALAN_KARYAWAN_FK` FOREIGN KEY (`karyawanID`) REFERENCES `karyawan` (`karyawanID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returpenjualan`
--

LOCK TABLES `returpenjualan` WRITE;
/*!40000 ALTER TABLE `returpenjualan` DISABLE KEYS */;
/*!40000 ALTER TABLE `returpenjualan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `satuanbarang`
--

DROP TABLE IF EXISTS `satuanbarang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `satuanbarang` (
  `satuanID` int(11) NOT NULL AUTO_INCREMENT,
  `barangID` int(11) DEFAULT NULL,
  `harga_jual` int(11) DEFAULT NULL,
  `satuan` varchar(20) DEFAULT NULL,
  `konversi` int(11) DEFAULT NULL,
  `satuan_acuan` varchar(20) DEFAULT NULL,
  `konversi_satuan` int(11) DEFAULT NULL,
  PRIMARY KEY (`satuanID`),
  KEY `BARANG_FK` (`barangID`),
  CONSTRAINT `BARANG_FK` FOREIGN KEY (`barangID`) REFERENCES `barang` (`barangID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `satuanbarang`
--

LOCK TABLES `satuanbarang` WRITE;
/*!40000 ALTER TABLE `satuanbarang` DISABLE KEYS */;
INSERT INTO `satuanbarang` VALUES (7,26,1500,'pieces',1,NULL,NULL),(8,27,1500,'pieces',1,NULL,NULL),(9,28,6500,'pieces',1,NULL,NULL),(10,29,0,'pieces',1,NULL,NULL),(11,29,50000,'biji',1,NULL,NULL),(12,29,2500000,'hampir kardus',30,NULL,NULL),(13,29,7500000,'truk',150,NULL,NULL);
/*!40000 ALTER TABLE `satuanbarang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stok`
--

DROP TABLE IF EXISTS `stok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stok` (
  `stokID` int(11) NOT NULL AUTO_INCREMENT,
  `barangID` int(11) DEFAULT NULL,
  `harga_beli` int(11) DEFAULT NULL,
  `stok_awal` int(11) DEFAULT NULL,
  `stok_skrg` int(11) DEFAULT NULL,
  `koreksi` int(11) DEFAULT NULL,
  PRIMARY KEY (`stokID`),
  KEY `BARANG_STOK_FK` (`barangID`),
  CONSTRAINT `BARANG_STOK_FK` FOREIGN KEY (`barangID`) REFERENCES `barang` (`barangID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stok`
--

LOCK TABLES `stok` WRITE;
/*!40000 ALTER TABLE `stok` DISABLE KEYS */;
/*!40000 ALTER TABLE `stok` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier` (
  `supplierID` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) DEFAULT NULL,
  `telp` varchar(20) DEFAULT NULL,
  `alamat` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`supplierID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'PT BOnka','03184239','Chocolate Fektori'),(3,'tester','081234','myhome'),(5,'PT testerino','08412348','Jl cobarino');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token` (
  `tokenID` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(40) DEFAULT NULL,
  `statusToken` varchar(30) DEFAULT NULL,
  `karyawanID` int(11) DEFAULT NULL,
  PRIMARY KEY (`tokenID`),
  KEY `KARY_TOKEN_FK` (`karyawanID`),
  CONSTRAINT `KARY_TOKEN_FK` FOREIGN KEY (`karyawanID`) REFERENCES `karyawan` (`karyawanID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (13,'20c7f211-72a8-41e0-abc5-e44ee8f2904b','aktif',2),(14,'7c669442-4d65-4b9b-b501-f213be264aa7','inaktif',2),(15,'d73de0c1-a4ec-4395-9bee-62f8e1183d84','aktif',3);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voucher` (
  `voucherID` int(11) NOT NULL AUTO_INCREMENT,
  `pelangganID` int(11) DEFAULT NULL,
  `returpenjualanID` int(11) DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL,
  PRIMARY KEY (`voucherID`),
  KEY `VOUCHER_PELANGGAN_FK` (`pelangganID`),
  KEY `VOUCHER_RETUR_FK` (`returpenjualanID`),
  CONSTRAINT `VOUCHER_PELANGGAN_FK` FOREIGN KEY (`pelangganID`) REFERENCES `pelanggan` (`pelangganID`),
  CONSTRAINT `VOUCHER_RETUR_FK` FOREIGN KEY (`returpenjualanID`) REFERENCES `returpenjualan` (`returpenjualanID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-19 17:51:58
