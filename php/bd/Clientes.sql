/* localiza clientes */
SET @STATUS = 1;
SET @id = 0;
SET @idAuxiliar = '';
SET @nome = '';
SET @cgc = '';
SET @ordem = 'order by nome';

select * from clientes
				 	where STATUS = @status 
				 		AND ( id = @id OR @id = 0 )
				 		and ( id_auxiliar LIKE @idAuxiliar OR @idAuxiliar = '' )
						and ( nome LIKE @nome OR @nome = '' )
						and ( cpf LIKE @cgc or cnpj LIKE @cgc OR (@cgc = '') )
				ORDER BY nome 

insert into clientes( id_endereco, id_auxiliar, nome, razao, cpf, cnpj, rg, inscricao_estadual, inscricao_municipal, 
	email, data_cadastro )
VALUES( '0','','SARA','','','','','','','' ,NOW() )


update clientes set id_endereco = '4', id_auxiliar = '', nome = 'ELISANGELA' , razao = '', cpf = '', cnpj = '', 
	rg = '', inscricao_estadual = '', inscricao_municipal = '', email = 'meu.email@email.com', data_alteracao = now()
WHERE id = 2
				