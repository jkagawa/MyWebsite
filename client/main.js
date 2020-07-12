import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import './main.html';
import './templates/homeContent.html';
import './templates/bmiContent.html';
import './templates/artContent.html';


Post = new Mongo.Collection('post');

Meteor.methods({
  addPost: function(content){

    Post.insert({
      content: content,
      created: new Date()
    });
  }
});

//Template.body.helpers({
//  template_name: function(){
//    return Session.get("templateName")
//  }
//});
//
//Template.body.events({
//  "click .bmi": function() {
//    Session.set("templateName", "index_bmi");
//  },
//  "click .art": function() {
//     Session.set("templateName", "index_art");
//  }
//  // ..
//});


//Template.registerHelper('currentRouteIs', function (route) { 
//  return Router.current().route.getName() === route; 
//});


Router.route('/', function () {
  this.render('home');
}, {
  name: 'home'
});
Router.route('/bmi');
Router.route('/art');


//doSomething = function bmi()
Template.calculateBMI.events({
  'click button': function(event) {
    event.preventDefault();
    
	var hf = Number(document.calculate_bmi.height_feet.value); 
	var hi = Number(document.calculate_bmi.height_inches.value);
	var h = (hf*12)+hi;
	var w = Number(document.calculate_bmi.weight.value); 
	var value = (w/(h*h))*703;
	value = Math.round(value*100)/100
	
	var r = "";
	if(value<18.5)
	{
		r = " Underweight";
	}
	else if(value>=18.5 && value<25)
	{
		r = " Normal weight";
	}
	else if(value>=25 && value<30)
	{
		r = " Overweight";
	}
	else if(value>=30)
	{
		r = " Obesity";
	}

	document.calculate_bmi.display_bmi.value = value;
	document.getElementById("bmi_range").innerHTML = r;
	
	var errors = 0;
	document.getElementById("height_error").innerHTML = "";
	document.getElementById("weight_error").innerHTML = "";
	if((!(hf>0) && !(hi>0)) || !(h>0) || hf<0 || hi<0)
	{
	document.getElementById("height_error").innerHTML = "INVALID HEIGHT: Please make sure this is a valid height.";
	++errors
	}
	if(!(w>0))
	{
	document.getElementById("weight_error").innerHTML = "INVALID WEIGHT: Please make sure this is a valid weight.";
	++errors
	}
	if(hi>=12)
	{
	document.getElementById("height_error").innerHTML = "INVALID HEIGHT: Please make sure this is a valid height. The inches must not equal or exceed 12.";
	++errors
	}
	if(errors>0)
	{
	document.calculate_bmi.display_bmi.value = "";
	document.getElementById("bmi_range").innerHTML = "";
	}

}
});

//Function for storing post after button click
Template.postForm.events({
  'submit form': function(event){
    event.preventDefault();
    var content = document.getElementById('content').value;
      
    Meteor.call('addPost', content);
//      Post.insert({
//      content: content,
//      created: new Date()
//    });
      
    event.target.reset();
  }
});

//Function for retrieving stored posts
Template.postsList.helpers({
  posts: function(){
    return Post.find({}, {sort: {created: -1}});
  }
});

Template.postsList.events({
  'click .remove-post': function(event){
    event.preventDefault();
    
    var postID = this._id;
    console.log(postID);
    
    Meteor.call('removePost', postID);
  }
});

