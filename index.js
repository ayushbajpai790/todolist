const express=require("express")
const ejs=require("ejs")
const mongoose=require('mongoose')
const _=require("lodash")

const app=express()
mongoose.connect("Give your conection url here")
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static("public"))
const todolistschema=new mongoose.Schema({
    name:String
})
const Item =mongoose.model("item",todolistschema)
const item1=new Item({
    name:"Welcome to your todolist"
})
const item2=new Item({
    name:"Hit the + button to add a new thing "
})
const item3=new Item({
    name:"check the checkbox to delete things"
})
const defaultarray=[item1,item2,item3];



// let items=[]
// let workitems=[]
app.get("/",function(req,res){
    var date=new Date();
    var options={
        weekday:"long",
        day:"numeric",
        month:"long",
    };
    var day=date.toLocaleDateString("en-us",options)
    console.log(day);
    Item.find({},function(err,founditems){
       if(founditems.length===0)
       {
        Item.insertMany(defaultarray,function(err){
            if(err){
            console.log(err);
        }
        else{
            console.log("successfully inserted");
        }
        }
     
        )
        res.redirect("/")
       }
        else{
            res.render("list",{listTitle:"today",itemset:founditems});
    }
    })
    
})
const listschema={
    name:String,
    items:[todolistschema]
}
const list= mongoose.model("list",listschema)
// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"work list",itemset:workitems})
// })
app.post("/",function(req,res){
    // var t=req.body.button;
   
   //console.log(t);
    // if(t==="work")
    // {
    //     workitems.push(item);
    //     res.redirect("/work");
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");
    // },
    const  item5=req.body.in;
    //console.log(item5);
const newitem=new Item({
    name:item5
})
const listitem=req.body.button;
if(listitem=="today")
{
    newitem.save();
    
res.redirect("/")
}
else{
    list.findOne({name:listitem},function(err,foundlist){
       
        foundlist.items.push(newitem)
        foundlist.save()
        res.redirect("/"+listitem)
    })
}


})
// app.get("/category/:new",function(req,res){
//     console.log(req.params)
// })
app.post("/delete",function(req,res){
    const del=req.body.checkbox;
    const listName=req.body.listname;
   
    if(listName==="today")
    {
    Item.findByIdAndRemove(del,function(err){
        if(!err)
        {
            console.log("successfully deleted")
            res.redirect("/")
        }
    })

}
else{
    list.findOneAndUpdate({
        name:listName
    },{
        $pull:{items:{_id:del}}
    },function(err,foundlist)
    {
        if(!err)
        {
            res.redirect("/"+listName);
        }
    })
}
})
app.get("/:customlistname",function(req,res){
    const customlistname=_.capitalize(req.params.customlistname)
list.findOne({name:customlistname},function(err,founditem){
    if(!founditem)
   {
    const newlist=new list({
        name:customlistname,
        items:defaultarray
    })
    newlist.save();
    res.redirect("/"+customlistname)
   }
    else
    res.render("list",{listTitle:founditem.name,itemset:founditem.items})
}
)    

})
app.listen(3000,function(){
    console.log("server running");
})
