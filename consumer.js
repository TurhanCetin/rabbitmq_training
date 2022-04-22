var amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue"; // terminalde 2. parametrede queuename alarak aslında bi routing key belirledik.
const data = require("./data.json");


const message = {
    descriprtion : "Bu bir test mesajıdır", // bu bizim rabbit ile göndereceğimiz mesajdır.
}

connect_rabbitmq();

async function connect_rabbitmq(){ // async bir fonksiyon oluşturuyoruz await ile bekleticez çünkü
   try{ // olurda hata verir ise diye try catch bloğunun içine aldık.
    const connection = await amqp.connect("amqp://localhost:5672");// rabbitmq'yu kullanıdığımız porta bağlanacağımızı söylüyoruz.
    const channel = await connection.createChannel(); // burada oluşturduğumuz connection içerisinde veri ve mesajlarımızı ilettiğimiz channel'ları kuruyoruz.
    const assertion = await channel.assertQueue(queueName); // channel içerisinde bir kuyruk oluşturuyoruz.

    //Mesajın alınması ...
    console.log("Waiting to message");
    channel.consume(queueName , message => {
        const messageInfo = JSON.parse(message.content.toString());
        const userInfo = data.find(u => u.id == messageInfo.descriprtion);
        if(userInfo){
            console.log("İşlenen Kayıt : ",userInfo);
            channel.ack(message);
        }
        channel.ack(message);
    });

    }catch(error){
    console.log("Error", error);
    }




}