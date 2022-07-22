<?php
    $dsn = 'mysql:dbname=bolhas;host=localhost;charset=utf8;port=3308';
    $user = 'root';
    $pass = '';

    try{
        $pdo = new PDO($dsn, $user, $pass);

    }catch(PDOException $e){
        echo 'Erro: '.$e->getMessage();
    }
