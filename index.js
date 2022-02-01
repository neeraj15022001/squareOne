const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "/assets")));
app.use("/", require("./routes"))

app.listen(PORT, (err) => {
    if (err) {
        console.log("Error while running app", err);
        return;
    }
    console.log("App up and running on PORT: ", PORT)
})