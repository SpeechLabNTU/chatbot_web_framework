const express = require('express');
const mongoose = require('mongoose');
/*  
    GET /models 
    Response:
    {
    "name":"Rushi",
    "model_endpoint":[
        {"topic":"Baby Bonus", "topic_endpoint":"rushi/api/queryEndpoint"},
        {"topic":"Covid 19", "topic_endpoint":"/rushi/api/queryEndpoint"},
        {"topic":"ComCare", "topic_endpoint":"/rushi/api/queryEndpoint"},
        {"topic":"Adoption", "topic_endpoint":"/rushi/api/queryEndpoint"}
    }    
*/
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model_endpoint:[{
        topic: {type: String},
        topic_endpoint: {type: String},
    }]
})
const Model = mongoose.model('Model', modelSchema)

module.exports = () => {
    const router = express.Router()
  
    router.get("/", async (req, res) => { 
        try{
            const models = await Model.find();
            res.json(models);
        } catch (err) {
            res.json({message: err})
        } 
    });

    router.get('/new', (req, res) => {
        const filter =  Model.findOne({name: req.body.name});
        const update = {model_endpoint: req.body.model_endpoint.map(model_endpoint => {
                            return {
                                topic: model_endpoint.topic,
                                topic_endpoint: model_endpoint.topic_endpoint
                            };
                        })};
        const options = {upsert: true, returnOriginal: false};
        Model.findOneAndUpdate(filter, update, options, function(error, model) {
            if (!error) {
                if (!model) {
                    model = new Model({
                        name: req.body.name,
                        update
                    });
                }
                model.save(function(error) {
                    if (!error) {
                        console.log("Model created/updated");
                    } else {
                        throw error;
                    }
                });
            }
        });
    });
    
    router.delete("/deleteAll", async (req, res) => {
        await Model.deleteMany()
        .then(function(){console.log("Data deleted");})
        .catch(function(error){console.log(error);});
    });
    return router
}