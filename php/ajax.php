<?php
    //inicia seção pra salvar dados na página
    session_start();

    //importa conexão com o banco e as classes
    require 'conexao.php';
    require 'class/usuarios.class.php';

    //instancia as classes
    $usuarios = new Usuarios($pdo);

    //usado pra salvar retorno das classes
    $retorno = array();

    //login
    if( isset($_POST['login']) && !empty($_POST['login']) ){
        $retorno = $usuarios->getUsuario($_POST);
        $_SESSION['usuario'] = $retorno;
        
        echo json_encode($retorno, JSON_FORCE_OBJECT);
    }   