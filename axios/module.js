const axios = require("axios");


const BASEURL = "https://discord.com/api/oauth2/token";



const getCredentials = async (code) => {

    const response = await axios.post(BASEURL,new URLSearchParams({
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': process.env.CALLBACK_URL,
        'code': code
    }),{
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })



    return response.data.access_token;



}


const getUser = async (token) => {
    const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {      
            'Authorization': `Bearer ${token}`
        }
    })

    const avatar = `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.png`

    const payload={
        id: response.data.id,
        username: response.data.username,
        avatar,
        email:response.data.email
    }

    return payload
}

const userGuilds = async (token) => {
    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {  
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data
}

module.exports = {getCredentials,getUser,userGuilds}

