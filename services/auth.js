const Routes = require("express");
const request = require('../axios/module');
const router = Routes();


let AuthToken =null;

router.get('/get-token', async (req, res) => {
res.json({token: AuthToken})
})

router.post('/user/info', async (req, res) => {

    const accessToken = req.body.token;   

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
    AuthToken = token;
    res.redirect(`https://qnrz9x09-5173.use2.devtunnels.ms/dashboard`)

})




module.exports=router