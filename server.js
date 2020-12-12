var mqtt = require('mqtt');
var server = mqtt.connect('mqtt://test.mosquitto.org');
const Cliente = require('./util/Cliente');
const Imovel = require('./util/Imovel');

const CADASTRA_IMOVEL = 'cadastra-imovel';
const REALIZA_RESERVA = 'realizar-reserva';
const CONSULTA_DATA_DISPONIVEL_IMOVEL = 'consulta-data-disponivel-imovel';
const LISTA_IMOVEIS = 'lista-imoveis';

var imoveis = [];

const imovel1 = new Imovel("12311", "casa do joao", "AP", "rua A, n 12 centro");
const imovel2 = new Imovel("1233", "QUITANDINHA DO OPA", "QUARTO", "rua B, n 12 centro");
const imovel3 = new Imovel("13", "CASA DA MÃE JOANA", "AP", "rua C, n 12 centro");
const imovel4 = new Imovel("1", "BBhouse", "QUARTO", "rua D, n 12 centro");

const cadastrarImovelTeste = function (imoveis, imovel) {
    imoveis.push(imovel);
}
cadastrarImovelTeste(imoveis, imovel1);
cadastrarImovelTeste(imoveis, imovel2);
cadastrarImovelTeste(imoveis, imovel3);
cadastrarImovelTeste(imoveis, imovel4);

server.on('connect', function () {




    server.subscribe(REALIZA_RESERVA, function (err) {
        if (!err) {
            console.log("Subscrito no tópico '" + REALIZA_RESERVA + "' com sucesso!");
        }
    });

    server.subscribe(CADASTRA_IMOVEL, function (err) {
        if (!err) {
            console.log('Subscrito no tópico ' + CADASTRA_IMOVEL + ' com sucesso!');
        }
    });


    server.subscribe(CONSULTA_DATA_DISPONIVEL_IMOVEL, function (err) {
        if (!err) {
            console.log("Subscrito no tópico '" + CONSULTA_DATA_DISPONIVEL_IMOVEL + "' com sucesso!");
        }
    });

    server.subscribe(LISTA_IMOVEIS, function (err) {
        if (!err) {
            console.log('Subscrito no tópico ' + LISTA_IMOVEIS + ' com sucesso!');
        }
    });
});

server.on('message', function (topic, message) {
    console.log(">>>>>>> Tópico: " + topic + "\n menssagem: " + message);
    switch (topic) {
        case CADASTRA_IMOVEL:
            console.log("CADASTRANDO IMOVEL");
            const imovel = JSON.parse(message);
            cadastrarImovelTeste(imoveis, imovel);
            console.log(imoveis)
            break;

        case REALIZA_RESERVA:
            console.log("REALIZA_RESERVA");
            const parametrosDeConsulta = JSON.parse(message); 
            const c = parametrosDeConsulta.cod;
            const dt_i = parametrosDeConsulta.dti;
            const dt_f = parametrosDeConsulta.dtf;
            const imovel2 = imoveis.find(i => i.codigo == c);
            const resposta = imovel2.reservar(dt_i, dt_f);
            console.log(resposta);
           
            break;

        case CONSULTA_DATA_DISPONIVEL_IMOVEL:
            console.log("CONSULTA DATA DISPONIVEL IMOVEL");
            
            const clienteTeste = new Cliente("José", "123000123-20");
            const cd = "1";
            const resp = clienteTeste.datasDisponiveis(imoveis, cd);
            console.log(resp);
            
            server.publish('resultado-consulta-data-disponivel-imovel', JSON.stringify(resp));
            break;

        case LISTA_IMOVEIS:
            console.log("LISTA IMOVEIS");
            var listaResposta = [];
            for (let i = 0; i < imoveis.length; i++){
                if(imoveis[i].disponivel == true){
                    listaResposta.push(imoveis[i])
                }
            }
           
           
            console.log(listaResposta);
            server.publish('resultado-lista-imoveis', JSON.stringify(listaResposta));
            break;
    }

     console.log(message.toString());
});