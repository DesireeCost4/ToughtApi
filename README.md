# _ToughtsApi_

ToughtsRoutes


GET /
	
	https://toughtapi.onrender.com/
	
	Este endpoint faz uma solicitação HTTP GET para recuperar dados de toughtapi.onrender.com 
	Abaixo está o esquema JSON para a resposta:
	json
	{
	  "type": "object",
	  "properties": {
	  
	  }
	}

GET DASHBOARD

	GET /toughts/dashboard
	Este endpoint recupera os pensamentos do painel.
	
	Solicitar Esta solicitação não requer um corpo de solicitação. Resposta A resposta será um objeto JSON com o seguinte esquema:
	
	{
	  "toughts": {
	    "type": "array",
	    "items": {
	      "type": "object",
	      "properties": {
	        "id": {
	          "type": "string"
	        },
	        "content": {
	          "type": "string"
	        },
	        "author": {
	          "type": "string"
	        },
	        "timestamp": {
	          "type": "string",
	          "format": "date-time"
	        }
	      }
	    }
	  }
	}

GET PROFILE 
	https://toughtapi.onrender.com/toughts/profile
	
	
	Este endpoint é uma solicitação GET para recuperar as informações de perfil do usuário. A solicitação não requer um corpo de solicitação, pois é uma solicitação GET simples. Após a execução bem-sucedida, a resposta incluirá os detalhes do perfil, como nome de usuário, email e outras informações relevantes.

POST ADD
	https://toughtapi.onrender.com/toughts/add
	
	
	O endpoint POST /toughts/add é usado para adicionar um novo "toughts" ao sistema. Após uma solicitação bem-sucedida, a resposta estará na forma de um esquema JSON que descreve a estrutura dos dados de resposta.

GET EDIT
	https://toughtapi.onrender.com/toughts/edit
	
	Obtenha a edição do Toughts Este endpoint é usado para recuperar os detalhes para editar um "pensamento" específico. Corpo da Solicitação Este endpoint não requer um corpo de solicitação. Resposta A resposta incluirá os detalhes do post que podem ser editados, como título, conteúdo e qualquer outra informação relevante.

DELETE
	https://toughtapi.onrender.com/toughts/remove/
	
	Remover o pensamento Este endpoint é usado para excluir um "pensamento" do sistema. 
	Solicitar Método: DELETAR Ponto final: https://toughtapi.onrender.com/toughts/remove/
	Corpo da Solicitação Esta solicitação não requer um corpo de solicitação. Resposta A resposta para esta solicitação é um esquema JSON. O esquema da resposta será fornecido separadamente.

POST REGISTER
	https://toughtapi.onrender.com/auth/register
	
	Cadastrar usuário Este endpoint permite que os usuários se registrem no aplicativo. Corpo da Solicitação nome de usuário (texto, obrigatório): O nome de usuário do usuário. email (texto, obrigatório): O endereço de email do usuário. senha (texto, obrigatório): A senha da conta do usuário. Resposta A resposta desta solicitação é um esquema JSON, que inclui as seguintes propriedades: userId: O identificador exclusivo do usuário registrado. nome de usuário: O nome de usuário do usuário registrado. email: O endereço de email do usuário registrado. criadoAt: o carimbo de data/hora que indica quando a conta do usuário foi criada.

POST LOGIN
	https://toughtapi.onrender.com/auth/login
	
	Login de autenticação Este endpoint é usado para autenticar um usuário e obter um token de acesso para futuras solicitações de API. Corpo da Solicitação nome de usuário (texto, obrigatório): O nome de usuário do usuário. senha (texto, obrigatório): A senha do usuário. Resposta A resposta desta solicitação é um esquema JSON que representa a estrutura do objeto de resposta. Inclui as seguintes propriedades: access_token: O token de acesso gerado para o usuário autenticado. token_type: o tipo de token gerado. Exemplo:
	
	JSON
	{
	  "tipo": "objeto",
	  "propriedades": {
	    "token_acesso": {
	      "tipo": "string"
	    },
	    "token_type": {
	      "tipo": "string"
	    }
	  }
	}



GET LOGOUT
	https://toughtapi.onrender.com/auth/logout
	
	Logout de autenticação Este endpoint é usado para efetuar logout do usuário autenticado. Solicitar Método: GET URL: https://toughtapi.onrender.com/auth/logout Resposta A resposta para esta solicitação é um objeto JSON em conformidade com o seguinte esquema:
	
	JSON
	{
	  "tipo": "objeto",
	  "propriedades": {
	    "mensagem": {
	      "tipo": "string"
	    }
	  }
	}

