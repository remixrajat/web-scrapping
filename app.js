const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");

const app = express();
let parsedResults = [];

request(
  "https://www.flipkart.com/search?q=mobiles&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_3_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_3_na_na_na&as-pos=1&as-type=RECENT&suggestionId=mobiles%7CMobiles&requestId=cf35625c-a366-4587-a55e-867bce27e653&as-searchtext=mob",
  function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $("div._3wU53n").each(function (i, element) {
        let details = $(this);
        let title = details.text();
        let rating = details.next().text();
        let specs = details.next().next().text();
        let data = {
          title: title,
          rating: rating,
          specs: specs,
        };
        parsedResults.push(data);
      });
    }
  }
);

app.get("/flipkart/mobile", function (req, res) {
  res.json(parsedResults);
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("server started at localhost 3000");
});
