module.exports = function(app) {
    var api = app.api.request;
    app.route('/helpdesk/requests').get(api.list);

    app.route('/helpdesk/requests/:id').get(api.listById);

    //Criar um endpoint para listar apenas os chamados abertos, ordenando-os, decrescentemente, por prioridade.
    app.route('/helpdesk/requests_opened').get(api.listOpened);

    //Criar um endpoint para inserir novos chamados.
    app.route('/helpdesk/requests_new').post(api.insertNew);

    //Criar um endpoint para atualizar os chamados existentes.
    app.route('/helpdesk/requests_update/:id').put(api.updateOne);

}