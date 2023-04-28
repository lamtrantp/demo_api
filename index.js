const { response } = require("express");
const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

class Sipment {
  constructor(id, milestone, type, customer, status) {
    this.id = id;
    this.milestone = milestone;
    this.type = type;
    this.customer = customer;
    this.status = status;
  }
}

app.get("/", (req, res) => {
  try {
    let newArray = [];

    const data = fs.readFileSync("./data.csv", "utf8");

    const array = data.split("\n");

    array.forEach((item, index) => {
      if (index > 0) {
        let array1 = item.split(",");

        let Shipment1 = new Sipment(
          array1[0],
          array1[1],
          array1[2],
          array1[3],
          array1[4]
        );

        newArray.push(Shipment1);
      }
    });

    // const newArray = array.map((value, index) => {
    //   return value.split(",");
    // });

    // const Stripment1 = new Stripment(
    //   newArray[1][0],
    //   newArray[1][1],
    //   newArray[1][2],
    //   newArray[1][3],
    //   newArray[1][4]
    // );

    // function arrayToObject() {
    //   let keys = newArray[0];
    //   let values = newArray.slice(1, newArray.length);
    //   let formatted = [];

    //   values.forEach((item, index) => {
    //     let obj = {};
    //     for (let j = 0; j < keys.length; j++) obj[keys[j]] = item[j];
    //     formatted.push(obj);
    //   });
    //   return formatted;
    // }

    res.send(newArray);
  } catch (err) {
    console.error(err);
  }
});

app.post("/post", (req, res) => {
  try {
    const data = fs.readFileSync("./data.csv", "utf8");
    let obj = req.body;
    let arr = Object.values(obj);
    let string = arr.toString();
    let newData = data + "\n" + string;

    fs.writeFile("./data.csv", newData, (err) => (err ? console.log(err) : ""));
    res.sendStatus(200).end();
  } catch (err) {
    console.error(err);
  }
});

app.put("/put/:id", (req, res) => {
  try {
    let id = req.params.id;

    const data = fs.readFileSync("./data.csv", "utf8");
    const array = data.split("\n");

    let newArray = array.map((item, index) => {
      if (index > 0) {
        let values = item.split(",");
        if (id === values[0]) {
          let obj = req.body;
          let keys = Object.keys(obj);
          let arr = Object.values(obj);
          keys.forEach((item, index) => {
            switch (item) {
              case "milestone":
                values[1] = arr[index];
                break;
              case "type":
                values[2] = arr[index];
                break;
              case "customer":
                values[3] = arr[index];
                break;
              case "status":
                values[4] = arr[index];
                break;

              default:
                break;
            }
          });
        }
        return values;
      }
      return item;
    });
    let newData = newArray.join("\n");
    fs.writeFile("./data.csv", newData, (err) => (err ? console.log(err) : ""));
    res.sendStatus(200).end();
  } catch (err) {
    console.error(err);
  }
});

app.delete("/delete/:id", (req, res) => {
  try {
    let id = req.params.id;

    const data = fs.readFileSync("./data.csv", "utf8");
    const array = data.split("\n");

    array.forEach((item, index) => {
      if (index > 0) {
        let values = item.split(",");
        if (id === values[0]) {
          array.splice(index, 1);
          return;
        }
      }
    });
    let newData = array.join("\n");
    fs.writeFile("./data.csv", newData, (err) => (err ? console.log(err) : ""));
    res.sendStatus(200).end();
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
