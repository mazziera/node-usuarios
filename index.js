const express = require('express');
const uuid = require('uuid'); // biblioteca utilizada para gerar uma serie de alfanumericos como id.
const cors = require('cors'); // biblioteca usada para habilitar solicitações entre back-end para chamadas front-end.

const app = express();
app.use(cors());

app.use(express.json()); // Adicionando um middleware que permite o uso do formato JSON nas requisições.


const usuarios = []; // array de usuários simulando um banco de dados

//Função Middleware para checar o id do usuário
const checkUserId = (request, response, next) => {
    const { id } = request.params 

    const userIndex = usuarios.findIndex(usuario => usuario.id === id) 

    if(userIndex < 0){
        return response.status(404).json({message: "User not found"})
    }

    request.index = userIndex;
    request.userId = id

    next()
};

//BUSCANDO USUARIOS NO SERVIDOR
app.get('/users', (request, response) =>{

    return response.json(usuarios)
});

//CRIANDO USUARIOS NO SERVIDOR
app.post('/users', (request, response) =>{

    const {name, age} = request.body

    const usuario = { id: uuid.v4(), name, age} 
    usuarios.push(usuario) 

    return response.status(201).json(usuario) 
});

//ATUALIZANDO OS USUARIOS NO SERVIDOR
app.put('/users/:id', checkUserId, (request, response) => {

    const {name, age} = request.body 
    const userIndex = request.index
    const id = request.userId

    const updatedUser = {id, name, age} 

    usuarios[userIndex] = updatedUser

    return response.json(updatedUser)
});

//DELETANDO USUÁRIOS NO SERVIDOR
app.delete('/users/:id', checkUserId, (request, response) => {
    const userIndex = request.index

    usuarios.splice(userIndex, 1)

    return response.status(204).json()
});

app.listen(8000, () => {
    console.log('Servidor iniciado na porta 8000');
})
