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
  `stok` int(11) DEFAULT NULL,
  PRIMARY KEY (`barangID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barang`
--

LOCK TABLES `barang` WRITE;
/*!40000 ALTER TABLE `barang` DISABLE KEYS */;
INSERT INTO `barang` VALUES (20,'garpu',200),(21,'piring',800);
/*!40000 ALTER TABLE `barang` ENABLE KEYS */;
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
  `hak_akses` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`karyawanID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `karyawan`
--

LOCK TABLES `karyawan` WRITE;
/*!40000 ALTER TABLE `karyawan` DISABLE KEYS */;
INSERT INTO `karyawan` VALUES (2,'billy bonkas','0841239417','Jl. PuKer 19','billy','bonka','asisten'),(3,'andre','08941234','Jl. TPI 42','streamz','sembah','karyawan');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelanggan`
--

LOCK TABLES `pelanggan` WRITE;
/*!40000 ALTER TABLE `pelanggan` DISABLE KEYS */;
INSERT INTO `pelanggan` VALUES (1,'Arianto Wibowo','0839183234','Jl Babatan Mutki M 72'),(2,'Billy Bonka','08314923','Jl Puker 19'),(4,'pewpewpew','08412347','Jl. PewPewPew');
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
  PRIMARY KEY (`pembelianID`),
  KEY `SUPPLIER_FK` (`supplierID`),
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
  `satuanID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`pembelianbarangID`),
  KEY `PEMBELIAN_FK` (`pembelianID`),
  KEY `SATUANPEMBELIAN_FK` (`satuanID`),
  CONSTRAINT `PEMBELIAN_FK` FOREIGN KEY (`pembelianID`) REFERENCES `pembelian` (`pembelianID`),
  CONSTRAINT `SATUANPEMBELIAN_FK` FOREIGN KEY (`satuanID`) REFERENCES `satuanbarang` (`satuanID`)
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
  PRIMARY KEY (`penjualanID`),
  KEY `PELANGGAN_FK` (`pelangganID`),
  CONSTRAINT `PELANGGAN_FK` FOREIGN KEY (`pelangganID`) REFERENCES `pelanggan` (`pelangganID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penjualan`
--

LOCK TABLES `penjualan` WRITE;
/*!40000 ALTER TABLE `penjualan` DISABLE KEYS */;
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
  PRIMARY KEY (`penjualanbarangID`),
  KEY `PENJUALAN_FK` (`penjualanID`),
  KEY `SATUAN_FK` (`satuanID`),
  CONSTRAINT `PENJUALAN_FK` FOREIGN KEY (`penjualanID`) REFERENCES `penjualan` (`penjualanID`),
  CONSTRAINT `SATUAN_FK` FOREIGN KEY (`satuanID`) REFERENCES `satuanbarang` (`satuanID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penjualanbarang`
--

LOCK TABLES `penjualanbarang` WRITE;
/*!40000 ALTER TABLE `penjualanbarang` DISABLE KEYS */;
/*!40000 ALTER TABLE `penjualanbarang` ENABLE KEYS */;
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
  `harga_pokok` int(11) DEFAULT NULL,
  `satuan` varchar(20) DEFAULT NULL,
  `konversi` int(11) DEFAULT NULL,
  PRIMARY KEY (`satuanID`),
  KEY `BARANG_FK` (`barangID`),
  CONSTRAINT `BARANG_FK` FOREIGN KEY (`barangID`) REFERENCES `barang` (`barangID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `satuanbarang`
--

LOCK TABLES `satuanbarang` WRITE;
/*!40000 ALTER TABLE `satuanbarang` DISABLE KEYS */;
INSERT INTO `satuanbarang` VALUES (15,20,1500,1750,'biji',1),(16,21,5500,6750,'biji',1),(17,21,30000,35000,'lusin',12),(18,21,300000,350000,'dus',50),(19,20,50000,55000,'dus',50),(20,20,50000,55000,'dus',50);
/*!40000 ALTER TABLE `satuanbarang` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'PT BOnka','03184239','Chocolate Fektori');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-20 18:48:14
