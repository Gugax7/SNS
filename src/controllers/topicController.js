const topicService = require("../services/topicService.js");

const create = (req, res) => {
  try {
    // TODO: deal with these attributes with zod
    const { name, attributes } = req.body;

    const newTopic = topicService.createTopic(name, attributes);

    res.status(201).json(newTopic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const list = (req, res) => {
  try{
    const allTopics = topicService.listTopics();

    res.status(200).json(allTopics);
  }catch(err){
    res.status(400).json({error: err.message});
  }
}

const getAttributes = (req, res) => {
  try{
    const { arn } = req.params;

    const attributes = topicService.getTopicAttributes(arn);

    if(!attributes) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.status(200).json(attributes);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

const remove = (req, res) => {
  try{
    const { arn } = req.params;
    
    const isDeleted = topicService.deleteTopic(arn);

    if(!isDeleted){
      return res.status(404).json({error: "topic not found!"});
    }

    res.status(204).send();
  }catch(err){
    res.status(500).json({error: err.message})
  }
}

module.exports = {
  remove,
  create,
  list,
  getAttributes
}
