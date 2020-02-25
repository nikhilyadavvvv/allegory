var express = require('express');
var router = express.Router();
var story = require("../controller/storyController");

const Story = require('../model/story');
const Data = require('../model/data');

const checkAuth = require('../middleware/checkAuth');

router.get('/:story_id', function (req, res, next) {
  var story_id = req.params.story_id;
  story.getStoryDataById(story_id, (rows) => {
    if (!rows) {
      res.json({
        "status": "failed",
        "error": rows
      })
    } else {
      res.json({ "result": rows });
    }
  });
});

router.post('/', checkAuth, (req, res, next) => {
  var host  = req.headers.host;
  console.log('Create Request -- %s', JSON.stringify(req.body));
  resp = { created: false };
  if (req.body.storyname) {
    //create story
    newStory = new Story({
      name: req.body.storyname,
      user_id: req.userData.userId, 
      background: ''
    });

    if(req.files.background){
      //update backgroud path for story
      newStory.background = 'http://' + host + '/static/' + story.saveImage(req.files.background);
    }

    newStory.save()
      .then((result) => {
        //add slides/data
        storyId = result.id;
        savedData = [];
        let index = 0;

        while (story.hasValidScene(req.body.heading[index], req.body.center[index], req.body.footer[index])) {
          console.log("Valid Scene found for index (%s)  -- %s , %s", index, req.body.heading[index]);
          storyData = new Data({
            story_id: result.id,
            image: '', 
            heading: req.body.heading[index],
            center: req.body.center[index],
            footer: req.body.footer[index],
            animation: req.body.animation[index],
            fontColor: req.body.fontColor[index]
          });

          if(req.files.image[index]){
            storyData.image = 'http://' + host + '/static/' + story.saveImage(req.files.image[index])
          }

          console.log("STORY DATA = %s", JSON.stringify(storyData));

          //save data
          storyData.save()
            .then(result => {
              savedData.push(result);
            }).catch(err => {
              console.log("Error! -- %s", err);
              return res.status(500).json({
                message: "Failed to create user story data",
                error: err.toString()
              })
            });

          index++;
        }

        console.log("about to send response back");
        //return result
        return res.json({
          mesage: "Story created successfully",
          story : newStory,
          scenes : savedData
        });

      }).catch(err => {
        console.log("Error!! -- %s", err);
        return res.status(500).json({
          message: "Failed to create user story",
          error: err.toString()
        })
      });
  }else{
    res.json(resp);
  }
});


router.get('/', function (req, res, next) {
  var story_id = req.params.story_id;
  story.getAllStories((rows) => {
    if (!rows) {
      res.json({
        "status": "failed",
        "error": rows
      })
    } else {
      res.json({ "result": rows });
    }
  });
});

module.exports = router;
