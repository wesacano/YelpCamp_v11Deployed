var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
//INDEX
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })
})
//Create route
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form & add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author}
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyCreated){
        if(err) {
            console.log(err)
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
//New Route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

//SHOW - Shows more info about one campground
router.get("/:id", function(req, res){
    //Find the campground with the provided ID and render the show template for that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error","Campground not found")
            res.redirect("back");
        } else {
            console.log(foundCampground);
            //Render SHOW template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    //Render SHOW template with that campground
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update campground Route
router.put("/:id", function(req, res) {
    //find and update the correct campground and redirect
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        };
    });
});

//Delete campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        };
    });
});

module.exports = router;