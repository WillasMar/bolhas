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
    
    //verifica login
    if( isset($_POST['verificaLogin']) && !empty($_POST['verificaLogin']) ){  
        //retorna array com dados do usuário salvos anteriormente por login  
        if(isset($_SESSION['usuario']) && !empty($_SESSION['usuario'])){
            echo json_encode($_SESSION['usuario'], JSON_FORCE_OBJECT);
        }else{
            echo json_encode(false, JSON_FORCE_OBJECT);
        }
    } 

    //desconectar usuário
    if( isset($_GET['sairLogin']) && !empty($_GET['sairLogin'])){
        unset($_SESSION['usuario']);
    }


