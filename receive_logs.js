var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (error0 ,connection) {
    if(error0){
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if(error1){
            throw error1;
        }
        var exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
            /**
            ** Bu method rastgele isimlerle kuyrukları otomatik oluşturacaktır.
            ** Consumer kapatıldığında otomatik olarak silinecektir.
            */
        }, function (error2,q) {
            if(error2){
                throw error2;
            }
            console.log("[*] Wating for messages şn %s. To exit press Ctrl+C", q.queue);
            channel.bindQueue(q.queue, exchange, '');

            channel.consume(q.queue, function(msg) {
                if(msg.content){
                    console.log(" [x] %s ", msg.content.toString());
                }
            },{
                noAck: true
                /**
                  ** Burada if kontrolü ile kontrol ettiğimiz mesaj gelirse noAck:true kuyruğu otomatik olarak kapatacaktır. 
                 */
            });
        });
    }); 
});