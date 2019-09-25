var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
        if(req.isAuthenticated()) {
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground) {
                    req.flash("error","Campground not found");
                    res.redirect("/campgrounds");
                } else {
                    //Does User Own Campground?
                    if(foundCampground.author.id.equals(req.user.id)) {
                        next();
                    } else {
                        req.flash("error","Permission error. You are not the owner of this Campground");
                        res.redirect("back");
                    };
                };
            });
        } else {
            req.flash("error","You need to be logged in to do that");
            res.redirect("back");
        };
    };

middlewareObj.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment) {
                    req.flash("error","Comment not found.")
                    res.redirect("back");
                } else {
                    //Does User Own Comment?
                    console.log("User is: "+req.user.id);
                    console.log("Found Comment Author ID is: "+foundComment.author.id);
                    if(foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    };
                };
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        };
    };

middlewareObj.isLoggedIn = function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login")
    };

module.exports = middlewareObj;