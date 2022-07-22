//Jquery
$(function(){
    //variáveis globais
    var ajaxG = 'php/ajax.php'
    var usuarioG = ''
	var requisitosSenhaG = '<div class="forcaPass-requisitos-forca">'+
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
    
    $('.forcaPass-requisitos').html(requisitosSenhaG)

//ajax
    //login
    function login(usuario, senha){
        let resultado = false

        $.ajax({
            url: ajaxG,
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


//eventos
    //ao clicar no botão de login
    $('#btnLogin').click(function(){
        let tabela = $(this).attr('data-tabela')
        let usuario = $(this).closest('#formLogin').find('#inputUsuario').val()
        let senha = $(this).closest('#formLogin').find('#inputSenha').val()
       
        usuarioG = login(usuario, senha)

        console.log(usuarioG)
    })

    //ao focar no input
    $('.campo input').focus(function(){
        //busca label do campo
        let label = $(this).parent().find('.label')

        //cria animação
        $(label).animate({
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

    })

    //ao sair do input
    $('.campo input').blur(function(){
        //verifica se o campo não está preenchido
        if( !$(this).val() ){
            //busca label do campo
            let label = $(this).parent().find('.label')

            //cria animação
            $(label).animate({
                'margin-top': '0px',
                'font-size': '20px',
                'color': '#555',
                'margin-left': '0px'
            },300 )
        }        
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
    $('.campo .forcaPass-verRequisitos').click(function(){
        let requisitos = $(this).parent().find('.forcaPass-requisitos')

        //se tiver aberto
        if( !parseInt($(requisitos).attr('data-status')) ){
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

    //ao clicar no botão de ver requisitos da senha
    $('.campo .verRequisitos').click(function(){
        //verifica se os requisitos está fechado
        if( !parseInt( $(this).parent().find('.requisitos').attr('data-status')) ){
            $(this).parent().find('.requisitos').css('display', 'flex')
            $(this).parent().find('.requisitos').attr('data-status', '1')
            $(this).parent().css('border-bottom-left-radius', '0px')
            $(this).parent().css('border-bottom-right-radius', '0px')
        }else{
            $(this).parent().find('.requisitos').hide()
            $(this).parent().find('.requisitos').attr('data-status', '0')
            $(this).parent().css('border-bottom-left-radius', '10px')
            $(this).parent().css('border-bottom-right-radius', '10px')
        }        
    })
})