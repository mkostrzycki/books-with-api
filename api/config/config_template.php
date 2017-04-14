<?php

include_once(__DIR__ . '/../src/Book.php');

/**
 * Enter your data and rename the file to "config.php"
 */

$servername = "";
$username = "";
$password = "";
$baseName = "";

$conn = new mysqli($servername, $username, $password, $baseName);

if ($conn->connect_error) {
    echo "Connection failed. Error: " . $conn->connect_error;
    die;
}

$setEncodingSql = "SET CHARSET utf8";
$conn->query($setEncodingSql);

Book::$conn = $conn;
