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

    //incluir img ao cadastrar ou alterar
    function incluirImg($tabela, $id, $imagem, $imgAtual){
        global $pdo;

        $img = $imagem['inputFotoCad']['tmp_name']; //imagem original
        $imgName = $imagem['inputFotoCad']['name']; //nome da imagem original
        $imgInfo = getimagesize($img); //informações da imagem					
        $largura = 500; //largura máxima a ser definida
        $altura = 500; //altura máxima a ser definida
        $folder = '../img/'.$tabela.'/'.$id.'/'; //diretório
        $imgSalvarNome = 'img_'.$id.'_'.rand(0, 999).'.png'; //nome da imagem
        $imgSalvar = $folder.$imgSalvarNome; //define um nome   

        removerImg($imgAtual);

        //se não existir o diretório, cria
        if(!is_dir($folder)){
            mkdir($folder, 0755); //cria o diretório com permissões de escrita e leitura
        }        
            
        //pega largura e altura da imagem
        list($largura_original, $altura_original) = getimagesize($img);

        //proporção entre largura e altura
        $ratio = $largura_original / $altura_original;

        //define tamanho proporcional
        if($largura / $altura > $ratio){
            $largura = $altura * $ratio;
        }else{
            $altura = $largura / $ratio;
        }	

        //verifica extensão pra mover imagem pro servidor
        if( $imgInfo['mime'] == 'image/webp' ){ 
            move_uploaded_file($img, $imgSalvar); //move imagem pra pasta
            $imgCreate = imagecreatefromwebp( $imgSalvar ); //captura imagem como webp         
        }else if( $imgInfo['mime'] == 'image/jpeg' ){
            move_uploaded_file($img, $imgSalvar); //move imagem pra pasta
            $imgCreate = imagecreatefromjpeg( $imgSalvar ); //captura imagem como jpeg
        }else if( $imgInfo['mime'] == 'image/png' ){
            move_uploaded_file($img, $imgSalvar); //move imagem pra pasta
            $imgCreate = imagecreatefrompng( $imgSalvar ); //captura imagem como png
        }else if( $imgInfo['mime'] == 'image/gif' ){
            move_uploaded_file($img, $imgSalvar); //move imagem pra pasta
            $imgCreate = imagecreatefromgif( $imgSalvar ); //captura imagem como gif
        }

        //salva imagem capturada como png por cima da que foi movida acima
        imagepng($imgCreate, $imgSalvar); 

        //prepara imagem pra mudar o tamanho
        $imagem_original = imagecreatefrompng($imgSalvar); 

        //prepara nova imagem com o tamanho novo
        $imagem_final = imagecreatetruecolor($largura, $altura);        

        //cria imagem nova de imagem original
        imagecopyresampled(
            $imagem_final, $imagem_original, //imagens
            0, 0, 0, 0, //posição x e y das duas imagens, left e top
            $largura, $altura, //tamanhos novos
            $largura_original, $altura_original //tamanhos anteriores
        );
        
        //salva imagem como png por cima da que foi criada acima
        imagepng($imagem_final, $imgSalvar);

        //define no banco a imagem
        $sql = 'update '.$tabela.' set img = ? where id = ?';
        $sql = $pdo->prepare($sql);
        $sql->execute(array($imgSalvar, $id));

        return $imgSalvar;
    }
    
    //remover imagem
    function removerImg($img){
        global $pdo;

        //exclui imagem se existir
        if( !empty($img) ){
            unlink($img);

            //se usuário estiver logado, remove imagem
            if(isset($_SESSION['usuario']) && !empty($_SESSION['usuario'])){
                //verifica se a imagem existe no servidor
                $_SESSION['usuario']['img'] = '';

                $sql = 'update usuarios set img = null where id = ?';
                $sql = $pdo->prepare($sql);
                $sql->execute(array( $_SESSION['usuario']['id'] ));
            }
        }
    }

    //valida extensão
    function validaExtensao($type){
        //verifica extensão
        if( $type == 'image/webp' || $type == 'image/jpeg' || $type == 'image/png' || $type == 'image/gif' ){
            return true;
        }else{
            return false;        
        }
    }

    //inserir ou alterar
    if(isset($_POST['incluirAlterar']) && !empty($_POST['incluirAlterar'])){
        $tabela = $_POST['tabela'];
        
        switch ($tabela) {
            case 'usuarios':
                //se enviou imagem
                if( !empty($_FILES['inputFotoCad']['tmp_name']) ){
                    $extensao = validaExtensao( $_FILES['inputFotoCad']['type'] );
                    
                    //se extensão for válida
                    if($extensao){                        
                        $retorno = $usuarios->incluirAlterar($_POST); //inclui ou altera usuário
                        $imgNova = incluirImg($tabela, $retorno['usuario']['id'], $_FILES, $retorno['usuario']['img']);
                        $retorno['usuario']['img'] = $imgNova;
                    
                    }else{
                        $retorno['result'] = false;
                        $retorno['msg'] = 'Extensão da foto é inválida! É aceito webp, jpeg, png e gif.';
                    }
                    
                }else{
                    $retorno = $usuarios->incluirAlterar($_POST); //inclui ou altera usuário
                    $retorno['imagem'] = 'Sem imagem!';
                } 

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
            //verifica se a imagem existe no servidor
            echo json_encode($_SESSION['usuario'], JSON_FORCE_OBJECT);
        }else{
            echo json_encode(false, JSON_FORCE_OBJECT);
        }
    } 

    //remove imagem
    if( isset($_GET['removerFoto']) && !empty($_GET['removerFoto']) ){
        //$img = addslashes($_GET['img']);
        removerImg($_GET['img']);
    }

    //desconectar usuário
    if( isset($_GET['sairLogin']) && !empty($_GET['sairLogin'])){
        unset($_SESSION['usuario']);
    }


