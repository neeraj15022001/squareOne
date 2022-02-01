const viewPath = require("./constants").views;
module.exports.home = (req, res) => {
    return res.sendFile(viewPath + "home.html")
}