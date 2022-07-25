<?php
    class Usuarios{
        private $pdo;

        function __construct($pdo){
            $this->pdo = $pdo;
        }

        //busca usuário para logar
        function login($dados){
            $usuario = addslashes($dados['usuario']);
            $senha = md5(addslashes($dados['senha']));

            $sql = 'SELECT id, usuario, nome, email, img FROM usuarios WHERE usuario = ? AND senha = ?';
            $sql = $this->pdo->prepare($sql);
            $sql->execute(array($usuario, $senha));

            if($sql->rowCount() > 0){
                return $sql->fetch();
            }else{
                return false;
            }
        }

        //inserir ou alterar usuário
        function incluirAlterar($dados){
            $idAlterar = addslashes($dados['idAlterar']);
            $usuario = strtoupper(addslashes($dados['usuario']));
            $nome = strtoupper(addslashes($dados['nome']));
            $email = addslashes($dados['email']);
            $senha = md5(addslashes($dados['senha']));

            //array de retorno
            $retorno['result'] = false;
            $retorno['msg'] = '';
            $retorno['acao'] = '';
            $retorno['usuario'] = array();

            //inserir, se idAlterar for vazio
            if( empty($idAterar) ){
                //verifica se recebeu dados obrigatórios
                if($usuario && $nome && $senha){                    
                    $sql = 'insert into usuarios(usuario, nome, email, senha)values(?, ?, ?, ?)';
                    $sql = $this->pdo->prepare($sql);
                    $sql->execute(array($usuario,$nome, $email, $senha));

                    $result['result'] = true;
                    $retorno['msg'] = 'Cadastro bem sucedido! ID: '.$this->pdo->lastInsertId();
                    $result['acao'] = 'insert';
                    $result['usuario'] = $this->getUsuario('', $this->pdo->lastInsertId());

                }else{
                    $retorno['result'] = false;
                    $retorno['msg'] = 'Usuário, Nome ou Senha não recebido!';
                }

            //alterar
            }else{
                //verifica se recebeu dados obrigatórios
                if($usuario && $nome){
                    //se informou senha
                    if($senha){
                        $sql = 'update usuarios set usuario = ?, nome = ?, email = ?, senha = ? where id = ?';
                        $sql = $this->pdo->prepare($sql);
                        $sql->execute(array($usuario, $nome, $email, $senha, $idAlterar));
                    
                    }else{
                        $sql = 'update usuarios set usuario = ?, nome = ?, email = ? where id = ?';
                        $sql = $this->pdo->prepare($sql);
                        $sql->execute(array($usuario, $nome, $email, $idAlterar));
                    }

                    $retorno['result'] = true;
                    $retorno['msg'] = 'Alteração bem sucedida! ID: '.$idAlterar;
                    $result['acao'] = 'update';
                    $result['usuario'] = $this->getUsuario('', $idAlterar);

                }else{
                    $retorno['result'] = false;
                    $retorno['msg'] = 'Usuário ou Nome não recebido!';
                } 
            }  

            return $retorno;           
        }

        //verificar usuário existente
        function getUsuario($user, $id){
            $usuario = addslashes($user);
            $id = addslashes($id)

            $sql = "select id, usuario, nome, email, img from usuarios where usuario = ? or id = ?";
            $sql = $this->pdo->prepare($sql);
            $sql->execute(array($usuario, $id));

            if($sql->rowCount > 0){
                return $sql->fetch();
            }else{
                return false;
            }
        }
    }