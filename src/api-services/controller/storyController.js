var sequelize = require('../common/mysql');
var path = require('path');

module.exports.getStoryDataById = function (story_id, callback) {
    var statement = `SELECT 
    data.id, story.name, data.image,data.animation,data.heading, data.center,data.footer,
    story.id AS story_id,story.background,data.fontColor
    FROM story, data
    WHERE
    story.id = data.story_id
    AND
    story.id = `+story_id+` ORDER BY
    data.id ASC`;
    sequelize.query(statement, { type: sequelize.QueryTypes.SELECT }).then((data) => {
        callback(data);
    });
}

module.exports.getAllStories = function (callback) {
    var statement = `SELECT story.id AS story_id,user.name AS user_name, story.name AS story_name, story.background FROM story INNER JOIN user ON user.id=story.user_id;`;
    sequelize.query(statement, { type: sequelize.QueryTypes.SELECT }).then((data) => {
        callback(data);
    });
}

module.exports.hasValidScene =  function hasNext(header, center, footer) {
    hasNextScene = false;
    if(header || footer || center){
      hasNextScene =  true
    }
    return hasNextScene;
  }

module.exports.saveImage = function (imageFile) {
      var date = new Date();
      const ext = imageFile.name.split('.').pop();
      const fileName = `${date.getTime()}.${ext}`;
      let savePath = `public/uploads/${fileName}`;
      let filepath = path.join(global.appRoot, savePath);
      imageFile.mv(filepath);

      return fileName;
}