var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672' , function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var exchange = 'logs';
        var msg = process.argv.slice(2).join(' ') || 'Hello World';

        channel.assertExchange(exchange, 'fanout', {
          durable: false
        });

        channel.publish(exchange, '', Buffer.from(msg));

        /**
        ** ikinci parametre olarak boş dize olarak herhangi 
        ** bir kuyruğa göndermek istediğimiz anlamına gelir
         */
        
        console.log("[x]  Send %s", msg);
      });

      setTimeout(function() {
        connection.close();
        process.exit(0);
      },500);
});