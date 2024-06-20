const Routes = require("express");
const request = require('../axios/module');
const router = Routes();


router.get('/', async (req, res) => {
    res.send("Hola")
})

router.get('/user/info', async (req, res) => {

    const accessToken = req.cookies.access_token;

    if(accessToken){
        const user = await request.getUser(accessToken);
        res.json(user)
    }else{
        res.send("Cookies not found")
    }
})

router.get('/user-guilds', async (req, res) => {
    const accessToken = req.cookies.access_token;       

    if(accessToken){    
        const guilds = await request.userGuilds(accessToken);
        res.json(guilds)    
    }else{
        res.send("Cookies not found")
    }
})

router.get('/callback', async (req, res) => {

    const code = req.query['code'];
    const token = await request.getCredentials(code);
    res.cookie("access_token",token);
    res.redirect(`https://qnrz9x09-9000.use2.devtunnels.ms/v1/api/auth/`)    

})




module.exports=router