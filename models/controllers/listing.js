const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //requiring geocoding service from github(mapbox-sdk-js) in that ccreating clients 
const mapToken = process.env.MAP_TOKEN; //access token
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //staring service by passing our access token


module.exports.index = async (req, res) => {
    if(req.query.cat) {
        cat = req.query.cat;
        const allListings = await Listing.find({category: cat});
        if(allListings.length > 0) {
        res.render("listings/index.ejs", { allListings });
        }else {
            req.flash("error","Couldn't find Listings for the specified Location.");
            res.redirect("/listings");
        }
    }
     else if (req.query.Loc) {
        srchLoc = req.query.Loc;
        const regex = new RegExp(srchLoc, 'i'); //we use this for pattern matching and we write i so that it's not case sensitive
        const allListings = await Listing.find({ location: { $regex: regex } });
        if(allListings.length > 0) {
            res.render("listings/index.ejs", { allListings });
            }else {
                req.flash("error","Couldn't find Listings for the specified Location.");
                res.redirect("/listings");
            }
        }
    else {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner"); //i.e for every review associate with an author
    if (!listing) {
        req.flash("error", "Listing you're trying to access doesn't exist!");
        res.redirect("/listings");
    };
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    
        .send()
    let category = req.body.category;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //this step is done so that we can access the name of the user who has loggedin so to display their name in listing they've created,,, passport has users info--to access it we use req.user
    newListing.image = { url, filename };
    newListing.category = category;

    newListing.geometry = response.body.features[0].geometry; //this val comes from mapbox and we're saving in our listing in DB

    let savedListing = await newListing.save(); //so we're also saving geometry now so we can display the coords from this in map
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you're trying to access doesn't exist!");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });  //edited and not edit list after clicking on edit,a put request is send and it is stored in ...req.body
    //for whatever changes, it'll be upladed above...for image we do this only after checking if there was any file selected to update else we dont do this:
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    };
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};