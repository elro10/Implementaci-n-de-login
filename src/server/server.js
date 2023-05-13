import express, {urlencoded} from "express";
import productManagerRouter from "../routes/productManager.router.js";
import cartManagerRouter from "../routes/cartManager.router.js";
import chatManagerRouter from "../routes/chatManager.router.js";
import ChatManager from "../dao/db-managers/chatManager.js";
import { AuthRouter } from "../routes/auth.router.js";

import __dirname from "./utils.js";
import { engine} from "express-handlebars";
import { Server } from "socket.io";
import viewer from "../routes/views.router.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";


const app = express();
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/../views");

app.use(express.json());
app.use(express.static(__dirname + "/../../public"));

//session
app.use(session({
    store:MongoStore.create({
        mongoUrl:`mongodb+srv://elro10:Abc123@cluster0.odajrhz.mongodb.net/Backend?retryWrites=true&w=majority`,
        ttl:10000
    }),
    secret:"adminCod3r123",
    resave:true,
    saveUninitialized:true
}));
//viewer route
app.use("/", viewer);
app.use("/products", viewer);
app.use("/products/productDetail", viewer);
app.use("/cart", viewer);
app.use("/profile", viewer);


//API PACK
//sessions
app.use("/api/sessions", AuthRouter);

//products route
app.use("/api/products", productManagerRouter);
//cart route
app.use("/api/cart", cartManagerRouter);
//chat route
app.use("/chat", chatManagerRouter);
//call de io products
app.use((req,res, midSocket) =>{
     const data = req.enviarProds;
    req.socketServer = socketServer;
    socketServer.emit("productList", data);
    midSocket();
});



//chat directo
const chat = new ChatManager;

//connect mongoose
mongoose.connect(`mongodb+srv://elro10:Abc123@cluster0.odajrhz.mongodb.net/Backend?retryWrites=true&w=majority`).then((con) => {
    console.log("connected to mongo");
})

//escucha
const httpServer = app.listen(8080, () => {
console.log("listening 8080");
});

// const messages= chat.getMessages();
// chat.getMessages(messages)

const socketServer = new Server(httpServer);
//listener se socket
socketServer.on("connection", (socket)=>{
    console.log("nuevo cliente conectado");
    //products
    socket.emit("productList", "mensaje desde server");
    socket.emit("messages", "mensaje para chat")
    //chat
    socket.on("chat-message", async (data) => {
        await chat.recieve(data);
        const messages = await chat.getMessages()
        socketServer.emit("messages", messages);
    });

    socket.on("new-user", async (userName) => {
        const messages = await chat.getMessages();
        socket.emit("messages", messages);
        socket.broadcast.emit("new-user", userName)
    });

});

