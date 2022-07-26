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
            $senha = $dados['senha'] ? md5(addslashes($dados['senha'])) : '';

            //array de retorno
            $retorno['result'] = false;
            $retorno['msg'] = '';
            $retorno['acao'] = '';
            $retorno['usuario'] = array();

            //inserir, se idAlterar for vazio
            if( empty($idAlterar) ){
                $retorno['acao'] = 'insert';
                
                //verifica se recebeu dados obrigatórios
                if($usuario && $nome && $senha){
                    //busca por usuário
                    $usuarioExistente = $this->getUsuario($usuario, '');
                    
                    //se usuário não existir
                    if(!$usuarioExistente){
                        $sql = 'insert into usuarios(usuario, nome, email, senha)values(?, ?, ?, ?)';
                        $sql = $this->pdo->prepare($sql);
                        $sql->execute(array($usuario,$nome, $email, $senha));

                        $retorno['result'] = true;
                        $retorno['msg'] = 'Cadastro bem sucedido! ID: '.$this->pdo->lastInsertId();
                        $retorno['usuario'] = $this->getUsuario('', $this->pdo->lastInsertId());

                    }else{
                        $retorno['result'] = false;
                        $retorno['msg'] = 'Usuário já Cadastrado!';
                    }
                }else{
                    $retorno['result'] = false;
                    $retorno['msg'] = 'Usuário, Nome ou Senha não recebido!';
                }

            //alterar
            }else{
                $retorno['acao'] = 'update';

                //verifica se recebeu dados obrigatórios
                if($usuario && $nome){
                    //busca por usuário
                    $usuarioExistente = $this->getUsuario('', $idAlterar);                    
                    
                    //se existir usuário com idAlterar
                    if($usuarioExistente){
                        //busca por usuário
                        $usuarioExistente = $this->getUsuario($usuario, '');

                        //se não existir usuário com nome escolhido
                        if( !$usuarioExistente || ($idAlterar == $usuarioExistente['id']) ){
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
                            $retorno['usuario'] = $this->getUsuario('', $idAlterar);
                        
                        }else{
                            $retorno['result'] = false;
                            $retorno['msg'] = 'Usuário já cadastrado!'; 
                            $retorno['usuario'] = $usuarioExistente;
                        }
                    }else{
                        $retorno['result'] = false;
                        $retorno['msg'] = 'Usuário não encontrado!';
                    }

                }else{
                    $retorno['result'] = false;
                    $retorno['msg'] = 'Usuário ou Nome não recebido!';
                } 
            }

            return $retorno;           
        }

        //verificar usuário existente
        function getUsuario($_usuario, $_id){
            $usuario = addslashes($_usuario);
            $id = addslashes($_id);

            $sql = "select id, usuario, nome, email, img from usuarios where usuario = ? or id = ?";
            $sql = $this->pdo->prepare($sql);
            $sql->execute(array($usuario, $id));

            if($sql->rowCount() > 0){
                return $sql->fetch();
            }else{
                return false;
            }
        }
    }