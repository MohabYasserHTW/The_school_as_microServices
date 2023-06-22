/* const kafka = require("node-rdkafka")



const stream = kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
},
{},{
    topic: "notification"
})

const sendMessage = () => {
    const response = stream.write(Buffer.from('message'))
    if(response){
        console.log("message sent successfully ")
    }
}

setInterval( () => {
    sendMessage()
},3000)
 */

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const f = async () => {
  await producer.connect();

  await producer.send({
    topic: "notification",
    messages: [
      {
        value: JSON.stringify({
          studentId: "12",
          examName: "Java-01",
          timestamp: "02-03....",
          url: "http://exam-eng.....",
          eventType: "EXAM_ASSIGNMENT",
        }),
      },
    ],
  });

  await producer.disconnect();
};
setInterval(() => {
  f();
}, 5000);
