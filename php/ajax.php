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

    /*
    //teste de incluirAlterar
    $_POST['incluirAlterar'] = true;
    $_POST['tabela'] = 'usuarios';
    $_POST['idAlterar'] = '';
    $_POST['usuario'] = 'willasmar7';
    $_POST['nome'] = 'Willas Prata2';
    $_POST['email'] = '';
    $_POST['senha'] = '888';*/

    //inserir ou alterar
    if(isset($_POST['incluirAlterar']) && !empty($_POST['incluirAlterar'])){
        $tabela = $_POST['tabela'];
        
        switch ($tabela) {
            case 'usuarios':
                $retorno = $usuarios->incluirAlterar($_POST); //inclui ou altera usuário

                //verifica resultado pra atualizar seção
                if($retorno['result']){
                    $_SESSION['usuario'] = $retorno['usuario'];
                }
                break;
            
            default:
                $retorno['result'] = false;
                $retorno['msg'] = 'Tabela '.$tabela.' inválida!';
                break;
        }

        echo json_encode($retorno, JSON_FORCE_OBJECT);
    }

    //login
    if( isset($_POST['login']) && !empty($_POST['login']) ){
        $retorno = $usuarios->login($_POST);
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


