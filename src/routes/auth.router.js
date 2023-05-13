import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";

const AuthRouter = Router();


//register
AuthRouter.post("/signup", async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email:email});
        if (!user) {
            const newUser = await UserModel.create({email, password});
            req.session.user = newUser.email;
            req.session.rol = "user";
            if (email = "adminCoder@coder.com") {
                req.session.rol = "admin";
                console.log(req.session);
            }
            //ejemplo a profile en este caso va a products
            return res.redirect("/products");
        } else {
            res.send(`Usuario ya registrado <a href="/login">Iniciar sesion </a>`)
        }
    } catch (error) {
        console.log(error);
    }
});
//login
AuthRouter.post("/login", async (req,res) => {
    const {email, password} = req.body;
    const authorized = await UserModel.findOne({email:email,password:password});
    if(!authorized){
        res.send("ususario no identificado");
    }else{
        if (email === "adminCoder@coder.com") {
            req.session.user = email;
            req.session.rol = "admin";
            console.log(req.session);
        }else{
            req.session.user = email;
        req.session.rol = "user";
        }
        return res.redirect("/products");
    }  
    
})

//logOut
AuthRouter.post("/logout", (req,res) =>{
    req.session.destroy(error => {
        if (error) {
            return res.send ("no se pudo cerrar la sesion");
        } else {
            return res.redirect("/login");
        }
    });
});

export {AuthRouter}