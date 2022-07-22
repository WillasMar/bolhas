<?php
    class Usuarios{
        private $pdo;

        function __construct($pdo){
            $this->pdo = $pdo;
        }

        function getUsuario($dados){
            $usuario = addslashes($dados['usuario']);
            $senha = md5(addslashes($dados['senha']));

            $sql = 'SELECT * FROM usuarios WHERE usuarios.usuario = ? AND usuarios.senha = ?';
            $sql = $this->pdo->prepare($sql);
            $sql->execute(array($usuario, $senha));

            if($sql->rowCount() > 0){
                return $sql->fetch();
            }else{
                return false;
            }
        }
    }