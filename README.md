# projetobrasil-server [![Build Status](https://secure.travis-ci.org/fth-ship/projetobrasil-server.png?branch=master)](http://travis-ci.org/fth-ship/projetobrasil-server)

Servidor REST do ProjetoBrasil.org

## Getting Started
Install the module with: `npm install projetobrasil-server`

```javascript
var projetobrasil-server = require('projetobrasil-server');
projetobrasil-server.awesome(); // "awesome"
```

## Documentação
A URL base da API é `api.projetobrasil.org`

### Tipos de requisições
Os protocolos padrões de HTTP são utilizados para comunicação com o servidor:
 * `GET`
 * `POST`
 * `PUT`
 * `DELETE`

### Perfil ###
Rota:
```
api.projetobrasil.org/v1/profile
```
Restrito a usuários logados: 
```
Sim
```

Retorno:

| Campo             |  Descrição    | Retorno       |
| -------------     |---------------|---------------|
| ratingsImported   |               | integer |
| username          |               | string |
| escolaridade      |               | string |
| ratedProposals    |               | array |
| provider_id       |               | string |
| exportFace        |               | integer |
| preferenciaPoliticaPublica |      | array |
| sexo              |               | string |
| nome              |               | string |
| provider          |               | string |
| partidoPreferencia |              | string |
| engajamentoPolitico |             | string |
| renda             |               | string |
| cidade            |               | string |
| imported          |               | string |
| blindRatedProposals |             | array |
| cidadeOndeVota    |               | string |
| updated_at        |               | string |
| dataNascimento    |               | string |


### Propostas políticas
Rota:
```
api.projetobrasil.org/v1/proposals
```
Restrito a usuários logados: 
```
Não
```

Retorno:
Um array de objetos, cada um contendo:

| Campo             |  Descrição    | Retorno       |
| -------------     |---------------|---------------|
| palavras_chaves   |               | string |
| titulo   |            | string |
| id   |               | string |
| politicians_id   |               | string |
| blindMedia   |               | float |
| created_at   |               | string |
| tema   |               | string |
| subtema   |               | string |
| updated_at   |               | string |
| fonte   |               | string |
| media   |               | double |

### Proposta
Rota:
```
api.projetobrasil.org/v1/proposal/:id
```
Restrito a usuários logados: 
```
Não
```

Retorno:
Um objeto contendo:

| Campo             |  Descrição    | Retorno       |
| -------------     |---------------|---------------|
| palavras_chaves   |               | string |
| titulo   |            | string |
| id   |               | string |
| politicians_id   |               | string |
| blindMedia   |               | float |
| created_at   |               | string |
| tema   |               | string |
| subtema   |               | string |
| updated_at   |               | string |
| fonte   |               | string |
| media   |               | double |


### Candidato

#### Perfil

Rota:
```
api.projetobrasil.org/v1/politician/:id
```
Restrito a usuários logados: 
```
Não
```

Retorno:
Um objeto contendo:

| Campo             |  Descrição    | Retorno       |
| -------------     |---------------|---------------|
| nome_coligacao   |               | string |
| titulo   |            | string |
| partido   |               | string |
| created_at   |               | integer |
| facebook   |               | string |
| twitter   |               | string |
| fonte_historico   |               | string |
| youtube   |               | string |
| image_partido   |               | string |
| composicao_coligacao   |               | string |
| nome   |               | string |
| gplus   |               | string |
| id   |               | string |
| vice   |               | string |
| formacao   |               | string |
| nome_urna   |               | string |
| site   |               | string |
| nome_url   |               | string |
| foto   |               | string |
| updated_at   |               | string |
| nome_partido   |               | string |
| numero   |               | string |

#### Bens declarados

Rota:
```
api.projetobrasil.org/v1/politician/:id/goods
```
Restrito a usuários logados: 
```
Não
```

Retorno:
Um array de objetos, cada um contendo:

| Campo             |  Descrição    | Retorno       |
| -------------     |---------------|---------------|
| created_at   |               | integer |
| id   |               | string |
| politicians_id   |               | string |
| valor   |               | string |
| updated_at   |               | integer |
| descricao   |               | string |

#### Histórico

Rota:
```
api.projetobrasil.org/v1/politician/:id/curriculum
```
Restrito a usuários logados: 
```
Não
```

Retorno:
Um array de objetos, cada um contendo:

| Campo             |  Descrição    | Retorno       |
| -------------     |---------------|---------------|
| created_at   |               | integer |
| id   |               | string |
| politicians_id   |               | string |
| categoria   |               | string |
| updated_at   |               | integer |
| descricao   |               | string |
| data   |               | string |

### Candidatos
Rota:
```
api.projetobrasil.org/v1/politicians
```
Restrito a usuários logados: 
```
Não
```

Retorno:
Um array de objetos, cada um contendo os mesmos campos do perfil de um candidato

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Luiz Ferreira. Licensed under the MIT license.
