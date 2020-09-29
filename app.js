const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
let parsedResults = [];

app.get("/flipkart/mobile", async (req, res) => {
  try{
  request(
    "https://www.flipkart.com/search?q=mobiles&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_3_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_3_na_na_na&as-pos=1&as-type=RECENT&suggestionId=mobiles%7CMobiles&requestId=cf35625c-a366-4587-a55e-867bce27e653&as-searchtext=mob",
    async function (error, response, html) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
        $("a._31qSD5").each(function (i, element) {
          let details = $(this);
          let url = details.attr("href");
          let mobileDetails = details
            .children()
            .next()
            .children()
            .children()
            .next()
            .next();
          let specs = mobileDetails.text();
          let rating = mobileDetails.prev().text();
          let title = mobileDetails.prev().prev().text();
          let data = {
            url: url,
            title: title,
            rating: rating,
            specs: specs,
          };
          parsedResults.push(data);
        });

        let responseData = parsedResults.map((item) => {
          return new Promise((resolve, reject) => {
            newUrl = "https://www.flipkart.com" + item.url;
            request(newUrl, async (error, res, html) => {
              if (!error) {
                let $ = cheerio.load(html);
                let details = $("div.ooJZfD");
                let data = details.children().text();
                item.cmpDetails = data;
                resolve(item);
              } else {
                resolve(item);
                console.log(error);
              }
            });
          });
        });
        let data = await Promise.all(responseData);
        res.json({ message: data });
      }
    }
  );
  }catch(err){
    res.json(err);
  }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(7000, () => {
  console.log("server started at localhost 7000");
});
