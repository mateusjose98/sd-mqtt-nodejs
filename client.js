var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://test.mosquitto.org')
const Imovel  = require('./util/Imovel');
// codigo, nome, tipo, endereco
const imovelNovo = {
  codigo: "555",
  nome: "Bacon",
  tipo: "AP",
  endereco: "rua Deus nos ajuda vai da certo"
}

const imovelNovo2 = new Imovel("1310", "Moradia de Teste", "AP", "Rua X, casa 007");


client.on('connect', function () {
 // client.publish('cadastra-imovel', JSON.stringify(imovelNovo2));

 // client.publish('realizar-reserva',JSON.stringify({cod:"1", dti:"04-01-2021", dtf:"06-01-2021"}));

//  client.subscribe('resultado-consulta-data-disponivel-imovel', function (erro){
//    if(!erro){
//      console.log("Não houve erros ao consultar datas disponíveis");

//      client.publish("consulta-data-disponivel-imovel", "");
//    }
//  });


 client.subscribe('resultado-lista-imoveis', function (erro){
  if(!erro){
    console.log("Não houve erros ao consultar datas disponíveis");

    client.publish("lista-imoveis", "");
  }
});


})

client.on('message', function (topic, message) {

  console.log(message.toString());
  client.end();

})