var amqp = require("amqplib");
const message = {
    descriprtion : "Bu bir test mesajıdır", // bu bizim rabbit ile göndereceğimiz mesajdır.
}

const queueName = process.argv[2] || "jobsQueue"; // terminalde 2. parametrede queuename alaraka aslında bi routing key belirledik.

const data = require("./data.json");

connect_rabbitmq();

async function connect_rabbitmq(){ // async bir fonksiyon oluşturuyoruz await ile bekleticez çünkü
   try{ // olurda hata verir ise diye try catch bloğunun içine aldık.
    const connection = await amqp.connect("amqp://localhost:5672") // rabbitmq'yu kullanıdığımız porta bağlanacağımızı söylüyoruz.
    const channel = await connection.createChannel(); // burada oluşturduğumuz connection içerisinde veri ve mesajlarımızı ilettiğimiz channel'ları kuruyoruz.
    const assertion = await channel.assertQueue(queueName); // channel içerisinde bir kuyruk oluşturuyoruz.


    data.forEach(i => {
        message.descriprtion = i.id;
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log("Message : ", i.id);
    });
    
    // Interval -------------------------------------------------------
    // setInterval(() => {
    //     message.descriprtion = new Date().getTime();
    //     channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    //     console.log("Message : ", message);
      
    // },1000);
    // -----------------------------------------------------------------
   }catch(error){
    console.log("Error", error);
   }




}