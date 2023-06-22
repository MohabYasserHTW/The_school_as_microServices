/* const kafka = require("node-rdkafka")

const consumer = kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092'
},{})

consumer.connect()

consumer
.on("ready", () => {
    consumer.subscribe(['notification'])
    consumer.consume()
})
.on("data", (data) => {
    console.log(data)
}) */

const { Kafka } = require("kafkajs");
const Notification = require("../models/notification-model")
const express = require("express")
const app = express()
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "first-group" });
const f = async () => {
  let notification 

  await consumer.connect();

  await consumer.subscribe({
    topic: "notification",
    fromBeginning: true,
  });

  let data 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(message,"message")
      data = JSON.parse(message.value)
      console.log(JSON.parse(message.value),"message value")
      
      console.log(data)
        if(data){
          notification = new Notification()
          notification.examName = data.examName
          notification.madeTo = data.madeTo
          notification.madeBy = data.madeBy
          notification.url = data.url
          notification.notificationType = data.notificationType
          try {
            await notification.save();
            console.log(notification,"sent to mongo")
            
          } catch (err) {
            console.log(err,"dsdsa")
          }
        }
    },
  });


};

module.exports = f



