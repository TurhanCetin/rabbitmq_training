var amqp = require("amqplib/callback_api");

/**
 ** Publisherdan gelen 2. parametre olarak gelen önem (error veye warning gibi)
 ** hangi consumer hangi önem derecesine sahipse ona gidecektir. 
 */

amqp.connect('amqp://localhost:5672', function (error0,connection) {
    if (error0){
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if(error1){
            throw error1;
        }
        var exchange = 'direct_log';
        var args = process.argv.slice(2);
        var msg = args.slice(1).join(' ') || "Hello World";
        var severity = (args.length > 0) ? args[0] : "info";
            /**
             ** severity önem anlamına gelmektedir.
             */
        channel.assertExchange(exchange, 'direct', {
            durable:false
            /**
             ** in-memory mi yoksa fiziksel olarak mı saklanacağı belirlenir. 
             ** Genel de RabbitMQ’da hız amcı ile ilgili queuelerin memory’de saklanması tercih edilse de sunucunun restart olması durumunda ilgili mesajların kaybolmasından dolayı da, hızdan ödün verilerek fiziksel olarak bir hard diskte saklanması tercih edilebilir.
             */
        });
        channel.publish(exchange, severity, Buffer.from(msg));

        console.log(" [x] Sent %s: '%s'" , severity, msg);
    }); 

    setTimeout(function () {
        connection.close();
        process.exit(0);
    },500);
});