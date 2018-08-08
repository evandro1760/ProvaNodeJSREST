var mongoose = require('mongoose');

var model = mongoose.model('Request');
var api = {
    list: function(req, res) {
        model.find()
            .then(function(helpdesk_requests) {
                res.json(helpdesk_requests);
            }, function(error) {
                console.log(error);
                res.status(500).json(error);
            });
    },
    listById: function(req, res) {
        model.findById(req.params.id)
            .then(function(helpdesk_request) {
                res.json(helpdesk_request);
            }, function(error) {
                console.log(error);
                res.status(500).json(error);
            });
    },
    
    //Criar um endpoint para listar apenas os chamados abertos, ordenando-os, decrescentemente, por prioridade.    
    listOpened: function(req, res) {
        model.find({'status':'OPENED'}).sort({'priority': -1 })
            .then(function(helpdesk_requests) {
                res.status(200).json(helpdesk_requests);
            }, function(error) {
                console.log(error);
                res.status(500).json(error);
            });
    },
    
    //Criar um endpoint para inserir novos chamados.
    insertNew: function(req, res) {
        var novo = req.body;
        var request = new model(novo);

        request.save().then(function(helpdesk_requests) {
            res.status(201).json(helpdesk_requests);
        }, function(error) {
            console.log(error);
            res.status(500).json(error);
        });
    },
    
    //Criar um endpoint para atualizar os chamados existentes.
    updateOne: function(req, res) {
        var novo = req.body;
        
        //Garantir que a cada atualização dos chamados, a propriedade "updated_at" seja atualizada automaticamente
        //com a data e hora atual.
        
        //Crio request para atualizar a "updated_at"

        var request = new model(novo);        
        novo.updated_at = request.updated_at;

        //Garantir que chamados atualizados do status aberto, para o status fechado, só serão de fato atualizados
        //se o corpo da requisição possuir o nome da pessoa que atuou no chamado (closed.by), bem como os minutos
        //trabalhados(closed.worked_minutes).
        
        //CALLBACK HELL NERVOSO AQUI
        model.findOne({'_id':req.params.id})
            .then(function(helpdesk_requests) {
                if(helpdesk_requests.status == 'OPENED'){
                    if(novo.status == "CLOSED"){
                        req.assert("closed", "Campo 'closed' deve ser preenchido para mudar o status da requisicao" ).notEmpty();
                        req.assert("closed.by", "Campo 'closed.by' deve conter o nome de quem resolveu a requisicao").notEmpty().isString();
                        req.assert("closed.worked_minutes", "Campo 'closed.worked_minutes' deve conter a quantidade de minutos que foram necessarios para encerrar a requisicao").notEmpty().isNumeric();
                    } 
                    if(novo.status == "OPENED" || novo.status == undefined){
                        req.assert("closed", "Campo 'closed' deve ser preenchido apenas quando o status for CLOSED").isEmpty();
                        req.assert("closed.by", "Campo 'closed.by' deve ser preenchido apenas quando o status for CLOSED").isEmpty();
                        req.assert("closed.worked_minutes", "Campo 'closed.worked_minutes' deve ser preenchido apenas quando o status for CLOSED").isEmpty();
                    }
                } else {
                    if(novo.status == "OPENED"){
                        console.log("Não é possivel tornar aberta uma requisição já fechada");
                        res.status(400).send({'error' : "Não é possivel tornar aberta uma requisição já fechada"});
                        return;
                    }
                    if(novo.status == "CLOSED"|| novo.status == undefined){
                        req.assert("closed", "Campo 'closed' deve ser preenchido para mudar o status da requisicao" ).notEmpty();                        
                    }
                }

                var errors = req.validationErrors();

                if(errors){
                    console.log("Erros de validação encontrados");
                    res.status(400).send(errors);
                    return;
                }

                model.updateOne({'_id':req.params.id}, novo)
                    .then(function(helpdesk_requests) {
                        res.status(200).json(helpdesk_requests);
                    }, function(error) {
                        console.log(error);
                        res.status(500).json(error);
                    });

        }, function(error) {
            console.log(error);
            res.status(500).json(error);
        });
    }
}

module.exports = api;