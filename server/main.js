import { Meteor } from 'meteor/meteor';


Post = new Mongo.Collection('post');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  addPost: function(content){

    Post.insert({
      content: content,
      created: new Date()
    });
      
  },
  removePost: function(postID){

    Post.remove({
      _id: postID
    });
      
  }
});