// Im going to use Map here because of the size that i really dont know 
// how big it can be, so to access  it  always  with  O(1)  we  can  do
// something like it:

const mockSubscribersMap = new Map([
  [
    "http://localhost:3001/webhook",
    {
      username: "Alice",
      protocol: "http",
      filterPolicy: {
        plan: ["premium", "gold"],
        age: [{"numeric": [">=", 18]}] 
      },
      maxDlqRetries: 3,
    }
  ],
  [
    "http://localhost:3002/webhook",
    {
      username: "Bruno",
      protocol: "email",
      filterPolicy: {
        status: [{"anything-but": ["banned", "inactive"]}],
        plan: ["basic"]
      },
      maxDlqRetries: 0,
    }
  ],
  [
    "http://localhost:3003/webhook",
    {
      username: "Carla",
      protocol: "sms",
      filterPolicy: {
        event_type: [{"prefix": "order_"}],
        age: [{"numeric": [">=", 20, "<=", 40]}] 
      },
      maxDlqRetries: 1,
    }
  ],
  [
    "http://localhost:3004/webhook",
    {
      username: "Valdinei",
      protocol:"http",
      filterPolicy: {
        plan: ["basic", "premium"],
        department: [{"prefix": "sales_"}]
      },
      maxDlqRetries: 2,
    }
  ]
]);

// 2. Agora criamos o banco de Tópicos (topicsDb), que também é um Map.
// A chave é o topicArn, e o valor é o objeto completo do tópico.
const topicsDb = new Map([
  [
    "arn:local:sns:topic:7eb0c05c-a0c4-4feb-a8ec-65801ed5d697", // CHAVE
    {                                                           // VALOR
      topicArn: "arn:local:sns:topic:7eb0c05c-a0c4-4feb-a8ec-65801ed5d697",
      name: "dogsTopic",
      attributes: {},
      createdAt: "2026-04-14T22:43:11.881Z",
      subscribersMap: mockSubscribersMap // Injetamos o Map de inscritos aqui!
    }
  ]
]);

module.exports = topicsDb