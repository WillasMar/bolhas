//Jquery
$(function(){
    //variáveis globais    
    var usuarioG = ''

    //variáveis constantes
    const urlAjaxG = './php/ajax.php'
    const imgPadraoUsuarioG = 'img/usuarios/padrao.png'
    const sonsG = ['sfx/bubble-1.wav', 'sfx/egg-bubble-pop.wav', 'sfx/liquid-bubble.wav', 'sfx/soap-bobble-sound.wav']
	const requisitosSenhaG = '<div class="forcaPass-requisitos-forca">'+
        '<span>Excelente</span>'+
            '<span>Tamanho mínimo de 10 dígitos</span>'+
            '<span>Números</span>'+
            '<span>Letras Minúsculas</span>'+
            '<span>Letras Maiúsculas</span>'+
            '<span>Caracteres Especiais</span>'+                        		
            '<span>Até 2 caractere repetidos</span>'+
        '</div>'+
        '<div class="forcaPass-requisitos-forca">'+
            '<span>Forte</span>'+
            '<span>Tamanho mínimo de 8 dígitos</span>'+
            '<span>Números</span>'+
            '<span>Letras Minúsculas</span>'+
            '<span>Letras Maiúsculas</span>'+
            '<span>Caracteres Especiais</span>'+                        		
            '<span>Até 2 caractere repetidos</span>'+
        '</div>'+
        '<div class="forcaPass-requisitos-forca">'+
            '<span>Média</span>'+
            '<span>Tamanho mínimo de 6 dígitos</span>'+
            '<span>Números</span>'+
            '<span>Letras Minúsculas ou Maiúsculas</span>'+
            '<span>Caracteres Especiais</span>'+                        		
            '<span>Até 2 caractere repetidos</span>'+
        '</div>'
    
    //atualiza o requisitos de senha
    $('.forcaPass-requisitos').html(requisitosSenhaG)

    verificaLogin()

//ajax
    //ajax, cadastrar ou alterar
    function incluirAlterar(dados){
        let resultado = false

        $.ajax({
            url: urlAjaxG,            
            data: dados, 
            type:'POST',           
            dataType: "json",
            contentType: false,
            cache: false,
            processData: false,
            async: false,
            success: function(retorno){ resultado = retorno }

        }).fail(function(jqXHR, textStatus){
            console.log( 'Falha no ajax: incluirAlterar()' )
        })

        return resultado
    }

    //ajax, login
    function login(usuario, senha){
        let resultado = false

        $.ajax({
            url: urlAjaxG,
            data: {login: true, usuario:usuario, senha:senha},
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function(retorno){ resultado = retorno }
        }).fail(function(jqXHR, textStatus){
            console.log( 'Falha no ajax: login()' )
        })

        return resultado
    }

    //ajax, verificar se tem usuário logado
    function verificaLogin(){
        $.ajax({
            url: urlAjaxG,
            data: { verificaLogin: true },
            type: 'POST',
            dataType: 'json',
            success: function(retorno){ 
                usuarioG = retorno
                
                //se tiver usuário logado
                if(retorno){
                    let nomeUsuario = usuarioG.nome
                    let imgUsuario = usuarioG.img ? usuarioG.img : imgPadraoUsuarioG
                    
                    $('.formLogin').hide()
                    $('.areaUsuario').css('display', 'flex')

                    $('.nomeUsuario').html( nomeUsuario )
                    $('.imgUsuario').attr('src', imgUsuario.replace('../', ''))
                    $('#inputSenhaCadastro').removeAttr('required')
                    $('#inputSenhaCadastro').parent().find('.required').hide()

                }else{
                    $('.formLogin').css('display', 'flex')
                    $('.areaUsuario').hide()
                    $('#inputSenhaCadastro').attr('required', '')
                    $('#inputSenhaCadastro').parent().find('.required').show()
                }

                //se não tiver usuário logado, limpa os campos
                if(!usuarioG){
                    limpaCampos()
                }               
             }
        }).fail(function(jqXHR, textStatus){
            console.log( 'Falha no ajax: verificaLogin()' )
        })
    }

    //get, desconectar usuário
    function sairLogin(){
        $.get(urlAjaxG, "sairLogin=true").done(function(retorno){
           verificaLogin()
       })
    }

    //get, remover foto
    function removerImg(img){
        $.get(urlAjaxG, "removerFoto=true&img="+img).done(function(retorno){
            verificaLogin()
        })
    }

    //limpar campos
    function limpaCampos(){
        let labels = $('.labels')

        $('.campo input').val('')
        $('.campo input').blur()
        $('.forcaPass').hide()
        $('.campo .label').removeClass('labelFocus')        
    }

    //mostra ou exibe campos
    function exibeOcultaCampos(labels, acao, alteracao){
        //percorre labels
        for(let item of labels){
            let label = item
            let inputVal = $(label).parent().find('input').val()

            if(acao){ //1: exibe
                if( alteracao ){ //se for alteração
                    if( inputVal ){  //se campo estiver preenchido                    
                        $(label).animate({ //cria animação pra mostrar
                            'margin-top': '-35px',
                            'font-size': '12px',
                            'color': '#aaa'
                        },{
                            duration: 300,
                            complete:function(){
                                $(label).animate({
                                    'margin-left': '-5px'
                                }, 300)
                            }
                        })
                    }
                }else{                    
                    $(label).animate({ //cria animação pra mostrar
                        'margin-top': '-35px',
                        'font-size': '12px',
                        'color': '#aaa'
                    },{
                        duration: 300,
                        complete:function(){
                            $(label).animate({
                                'margin-left': '-5px'
                            }, 300)
                        }
                    })
                }

            //mostra
            }else{                
                //verifica se o campo está vazio
                if( !inputVal ){
                    //cria animação pra ocultar
                    $(label).animate({
                        'margin-top': '0px',
                        'font-size': '20px',
                        'color': '#555',
                        'margin-left': '0px'
                    },300 )
                }
            }
        }
    }

    //mostrar gif de carregando envio
	function gifCarregando(obj, funcao){	
		//verifica se é pra mostrar gif
		if(funcao){
			$(obj).css('display', 'flex')
			$(obj).parent().find('.areaGifCarregando').addClass('gifCarregando') //classe carregando
		}else{
			$(obj).hide()
			$(obj).parent().find('.areaGifCarregando').removeClass('gifCarregando') //classe carregando
		}
	}

//eventos
    //ao da submit no form de cadastro
    $('form').submit(function(e){
        //para submit
        e.preventDefault()

        //pega campos do formulário
        let dados = new FormData(this)

        //adiciona chamada no php, id do usuário e tabela do banco
        dados.append('incluirAlterar', true)
        dados.append( 'idAlterar', usuarioG.id ? usuarioG.id : '' )
        dados.append( 'tabela', $(this).attr('data-tabela') )

        //envia dados para inclusão ou alteração
        retorno = incluirAlterar(dados)

        //se inclusão ou alteração teve sucesso
        if(retorno.result == true || retorno.result == 'true'){
            $('.modalBase').hide('fast')
            verificaLogin()
            limpaCampos()
        
        }else{
            alert( retorno.msg )
        }

        console.log('InclurAlterar: ' + retorno.result)
    })

    //ao clicar no botão de fechar modal
    $('.btnFecharModal').click(function(){
        $(this).closest('.modalBase').hide('fast')

        limpaCampos()
    })

    //ao clicar no botão de login
    $('#btnLogin').click(function(){
        let tabela = $(this).attr('data-tabela')
        let usuario = $(this).closest('#formLogin').find('#inputUsuario').val()
        let senha = $(this).closest('#formLogin').find('#inputSenha').val()
       
        usuarioG = login(usuario, senha)

        if( usuarioG ){
            verificaLogin()
        }else{
            alert('Usuário ou senha inválida!')

        }        
    })

    //ao clicar no botão de cadastro
    $('.btnLoginCadastro').click(function(){
        $('#modalCadUser').show('fast')
        
        if(usuarioG){
            let labels = $('#modalCadUser .label')

            //preenche campos
            $('#modalCadUser #inputUsuarioCadastro').val( usuarioG.usuario )
            $('#modalCadUser #inputNomeCadastro').val( usuarioG.nome )
            $('#modalCadUser #inputEmailCadastro').val( usuarioG.email )
            $('#modalCadUser #imgUsuarioCadastro').val( usuarioG.img )            

            exibeOcultaCampos( labels, 1, 1 )
            $('#modalCadUser #inputUsuarioCadastro').focus()
        }
    })

    //abrir modal
    $('.btnModal').click(function(){
        $($(this).attr('data-modal')).show('fast')

        if(!usuarioG){
            $('.imgUsuario').attr('src', imgPadraoUsuarioG)
        }
    })

    //ao clicar no botão de desconectar o usuário
    $('.btnSairLogin').click(function(){
        let resposta = confirm('Deseja realmente sair, '+ usuarioG.nome +'?')

        if(resposta){
            sairLogin()
        }
    })

    //ao focar no input, exibe campo
    $('.campo input').focus(function(){
        //busca label do campo para ser passado num array
        let label = [ $(this).parent().find('.label') ]

        exibeOcultaCampos(label, 1, 0)
    })

    //ao sair do input. oculta campo
    $('.campo input').blur(function(){
        //busca label do campo para ser passado num array
        let label = [ $(this).parent().find('.label') ]

        exibeOcultaCampos(label, 0, 0)
    })

    //evento ao digitar a senha pra exibir a força
    $('.campo .inputVerificaSenha').keyup(function(e){
        let val = $(this).val()
        let key = e.key
        
        //verifica tecla
        //if(key != 'Shift' && key != 'Alt' && key != 'Enter' && key != 'Control' && key != 'CapsLock' && key != 'Escape'){
        //verifica se tem valor 
        if( val ){
            let forca = 'forcaPass-fraca' //foça padrão
            let forcaTxt = 'Fraca' //texto padrão
            let fraca = 'forcaPass-fraca' //diferente das de baixo 
            let media = 'forcaPass-media' //número, letra e 6 digitos
            let forte = 'forcaPass-forte' //número, minúscula, maiúscula, str especial, 8 digitos, repetição até 2
            let excelente = 'forcaPass-excelente' //número, minúscula, maiúscula, str especial, 10 digitos, repetição até 2
            let numero = 0 //qtd números
            let minuscula = 0 //qtd str minúscula
            let maiuscula = 0 //qtd str maiúscula
            let strEspecial = 0 //qtd caractere especial
            let qtdStr = val.length //qtd de str digitado no campo
            let maxStrRepeticao = 2 //maximo de str que pode repetir
            let strRepetido = false //saber se tem str repedito mais que o máximo

            //verifica caractere
            for(let item in val){
                let str = val[item] //string
                let strQtd = 0 //usada pra verificar a qtd desse str em val

                //verifica tipo de string
                if( /^[0-9]+$/.test(str) ){ //número
                    numero++
                }else if( /^[a-z]+$/.test(str) ){ //minúscula
                    minuscula++
                }else if( /^[A-Z]+$/.test(str) ){ //maiúscula
                    maiuscula++
                }else{ //caractere especial
                    strEspecial++
                }

                //procura por string repetida
                for(let item in val){
                    //verifica se string tem na posição item em val
                    if(str == val[item]){
                        strQtd++
                    }
                }

                //verifica se a string repetiu mais que a quantidade máxima
                if(strQtd > maxStrRepeticao){
                    strRepetido = true
                }
            }

            //Excelente [ 10 digitos, número, minúscula, maiúscula, str especial, repetição até 2 ]
            if( (qtdStr >= 10) && numero && minuscula && maiuscula && strEspecial  && !strRepetido ){
                forca = excelente
                forcaTxt = 'Excelente'
            //Forte [ 8 digitos, número, minúscula, maiúscula, str especial, repetição até 2 ]	
            }else if( (qtdStr >= 8) && numero && minuscula && maiuscula && strEspecial && !strRepetido ){
                forca = forte
                forcaTxt = 'Forte'
            //Média [ 6 digitos, número, letra , repetição até 2 ]
            }else if((qtdStr >= 6) && numero && (minuscula || maiuscula) && strEspecial ){
                forca = media
                forcaTxt = 'Média'
            }

            //faz atualizações na exibição da força da senha
            $(this).parent().find('.forcaPass').css('display', 'flex') //exibe força da senha	
            $(this).parent().find('.forcaPass').removeClass('forcaPass-fraca') 
            $(this).parent().find('.forcaPass').removeClass('forcaPass-media')
            $(this).parent().find('.forcaPass').removeClass('forcaPass-forte')
            $(this).parent().find('.forcaPass').removeClass('forcaPass-excelente')
            $(this).parent().find('.forcaPass').addClass(forca)	//adiciona nova classe
            $(this).parent().find('.forcaPass-forca').html(forcaTxt) //adiciona novo texto	

        }else{
            //oculta a força da senha
            $(this).parent().find('.forcaPass').hide()
        }	
    })

    //ver requisitos de senha
    $('.forcaPass-verRequisitos').click(function(){
        let requisitos = $(this).parent().find('.forcaPass-requisitos')
        let status = parseInt($(requisitos).attr('data-status'))
        
        //se tiver fechado
        if( !status ){
            $(this).addClass('forcaPass-verRequisitos-ativo')            
            $(requisitos).css('display', 'flex') //mostra requisitos
            $(requisitos).attr('data-status', 1) //muda status pra aberto
        }else{
            $(this).removeClass('forcaPass-verRequisitos-ativo')
            $(requisitos).hide() //oculta requisitos
            $(requisitos).attr('data-status', 0) //muda status pra fechado
        }
    })

    //ao clicar no botão de zerar input
    $('.campo .btnLimparInput').click(function(){
        $(this).parent().find('input').val('')
        $(this).parent().find('input').focus()
    })

    //ao passar mouse no botão de ver senha
    $('.campo .btnVerSenha').hover(function(){
        if( !parseInt($(this).attr('data-status')) ){
            $(this).css('background-color','greenyellow')
            $(this).attr('src', 'img/campos/olhoAberto.png')
            $(this).parent().find('input').attr('type', 'text')
        }       
    }, function(){
        if( !parseInt($(this).attr('data-status')) ){
            $(this).css('background-color','#ccc')
            $(this).attr('src', 'img/campos/olhoFechado.png')
            $(this).parent().find('input').attr('type', 'password')
        }        
    })

    //ao clicar no botão de ver senha
    $('.campo .btnVerSenha').click(function(){
        if( !parseInt($(this).attr('data-status')) ){
            $(this).attr('data-status', 1)
            $(this).css('background-color','greenyellow')
            $(this).attr('src', 'img/campos/olhoAberto.png')
            $(this).parent().find('input').attr('type', 'text')
            $(this).parent().find('input').focus()
        }else{
            $(this).attr('data-status', 0)
            $(this).css('background-color','#ccc')
            $(this).attr('src', 'img/campos/olhoFechado.png')
            $(this).parent().find('input').attr('type', 'password')
            $(this).parent().find('input').focus()
        }        
    })

    //previsualizar imagem no cadastro
    $('.inputImgCad').change(function(){
        let obj = $(this).closest('.areaImgCad').find('.areaGif')
        let img = $(this).closest('.areaImgCad').find('.areaImgCadastro img')
        
        gifCarregando(obj, true)

        let reader = new FileReader()
        reader.onload = imageIsLoaded
        reader.readAsDataURL(this.files[0])

        function imageIsLoaded(e) {
            $(img).attr('src', e.target.result)
            gifCarregando(obj, false)
        }
    })

    //remove a foto do usuário
    $('.btnUsuarioRemoverFoto').click(function(){       
        //se usuário estiver logado e ter imagem
        if(usuarioG && usuarioG.img){
            let resp = confirm('Deseja realmente remover a foto!')

            if(resp){
                removerImg(usuarioG.img)

                $(this).closest('.areaImgCad').find('.areaImgCad-botoes #inputMudarFoto').val('')
                $(this).closest('.areaImgCad').find('.areaImgCadastro img').attr('src', imgPadraoUsuarioG)
            }
           
        }else{
            $(this).closest('.areaImgCad').find('.areaImgCad-botoes #inputMudarFoto').val('')
            $(this).closest('.areaImgCad').find('.areaImgCadastro img').attr('src', imgPadraoUsuarioG)
        }
    })

    $('.imgLogo').click(function(){
        let somLogo = document.getElementById('somLogo')        
        let som = Math.floor(Math.random() * 3)

        somLogo.src = sonsG[som]
        somLogo.play()
    })
})