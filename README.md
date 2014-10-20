# projetobrasil-server [![Build Status](https://secure.travis-ci.org/fth-ship/projetobrasil-server.png?branch=master)](http://travis-ci.org/fth-ship/projetobrasil-server)

Servidor REST do ProjetoBrasil.org

## Getting Started
Install the module with: `npm install projetobrasil-server`

```javascript
var projetobrasil-server = require('projetobrasil-server');
projetobrasil-server.awesome(); // "awesome"
```

## Documentation
A URL base da API é `api.projetobrasil.org`

### Tipos de requisições ###
Os protocolos padrões de HTTP são utilizados para comunicação com o servidor:
 * `GET`
 * `POST`
 * `PUT`
 * `DELETE`

### Perfil ###
Requisição:
```
api.projetobrasil.org/v1/profile
```
Restrito a usuários logados: 
```
Sim
```

Retorno:

| Campo             | Retorno       | Descrição       |
| -------------     |---------------|---------------|
| ratingsImported   | integer       | |
| username          | string        | |
| escolaridade      | string        | |
| ratedProposals    | array         | |
| provider_id       | string        | |
| exportFace        | integer       | |
| preferenciaPoliticaPublica | array | |
| sexo              | string        | |
| nome              | string        | |
| provider          | string        | |
| partidoPreferencia | string       | |
| engajamentoPolitico | string      | |
| renda             | string        | |
| cidade            | string        | |
| imported          | string        | |
| blindRatedProposals | array       | |
| cidadeOndeVota    | string        | |
| updated_at        | string        | |
| dataNascimento    | string        | |


## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Luiz Ferreira. Licensed under the MIT license.
