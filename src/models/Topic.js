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
        plan: ["premium", "gold", "basic"],
        age: [{"numeric": [">=", 18]}] 
      },
      maxDlqRetries: 3,
    }
  ],
  [
    "http://localhost:3002/webhook",
    {
      username: "Bruno",
      protocol: "http",
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
      protocol: "http",
      filterPolicy: {
        event_type: [{"prefix": "order_"}],
        age: [{"numeric": [">=", 20, "<=", 40]}],
        plan: ["basic"],
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

const systemSubscriberMap = new Map(
  Array.from(mockSubscribersMap.entries()).map(([endpoint, clientInfo]) => {
    const {filterPolicy, ...rest} = clientInfo;

    return [
      endpoint,
      {
        ...rest,
        filterPolicy: {},
      }
    ]
  })
)

const topicsDb = new Map([
  [
    "arn:local:sns:topic:7eb0c05c-a0c4-4feb-a8ec-65801ed5d697",
    {                                                          
      topicArn: "arn:local:sns:topic:7eb0c05c-a0c4-4feb-a8ec-65801ed5d697",
      name: "dogsTopic",
      attributes: {},
      createdAt: "2026-04-14T22:43:11.881Z",
      subscribersMap: mockSubscribersMap
    }
  ],
  [
    "arn:local:sns:topic:7eb0c05c-b1c4-5tjb-b9ec-34801jk5d697", 
    {                                                         
      topicArn: "arn:local:sns:topic:7eb0c05c-b1c4-5tjb-b9ec-34801jk5d697",
      name: "SystemAllerts",
      attributes: {},
      createdAt: "2026-04-14T22:43:11.881Z",
      subscribersMap: systemSubscriberMap
    }
  ]
]);

module.exports = topicsDb