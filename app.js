const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ritam:ritam123@cluster0.7ckerth.mongodb.net/TodoList?retryWrites=true&w=majority")
.then(() => console.log("connection successful"))
.catch((err) => console.log(err));


const itemSchema = new mongoose.Schema({
	name: String
});

const Item = new mongoose.model('Item', itemSchema);

// const createDocument = async () => {
// 	try{
// 		const item1 = new Item({
// 			name: "Hey there"
// 		});
// 		const item2 = new Item({
// 			name: "How are you?"
// 		})
// 		const defaultItems = [item1, item2];
// 		await Item.insertMany(defaultItems);
// 	}catch(err){
// 		console.log(err);
// 	}
// }

// createDocument();
async function getItems(){
	const items = await Item.find({});
	return items;
}

app.get("/",function(req, res){
	let day = date.getDate();
	getItems().then(function(items){
		res.render("list",{listType : day, newlistItems : items});
	})
}

);
app.get("/work",function(req,res){
	res.render("list",{listType : "Work List", newlistItems : workList});
});
app.post("/",function(req,res){
	let itemName = req.body.newItem;
	const item = new Item({
		name : itemName
	});

	item.save();
	res.redirect("/");
	
	// if(req.body.List === "Work List"){
	// 	workList.push(item);
	// 	res.redirect("/work");
	// }
	// else{
	// 	listItems.push(item);
	// 	res.redirect("/");
	// }
	
});

app.post("/delete", function(req, res){
	const checkedItemId = req.body.checkbox;
	Item.findByIdAndRemove(checkedItemId).then(() => 
			console.log("Successfully deleted"),
			res.redirect("/")
	)
	.catch( (err) =>
		console.log(err)
	);
	res.redirect("/")
	  
});

app.listen(3000,function(){
	console.log("Server is running");
})