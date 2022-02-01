const viewPath = require("./constants").views;
module.exports.login = (req, res) => {
    return res.sendFile(viewPath + "login.html")
}