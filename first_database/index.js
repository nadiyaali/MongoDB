const express = require("express")
const app = express()
const port = 8080
const sql = require("mssql");


app.listen(port, ()=>{
    console.log(`Listening on port : ${port}`)
})


/*
const config = {
    user: 'DESKTOP-V2RFM0L\A',
    password: '',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'students',
}
*/
app.get("/db", (req,res)=>{
console.log("Gto db request")
    async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('Server=localhost,1433;Database=students;User Id=DESKTOP-V2RFM0L\A;Password=;Encrypt=true')
        const result = await sql.query`select * from InfoStudents`
        console.dir(result)
    } catch (err) {
        // ... error checks
        console.log(err)
    }
}
})

app.get("/", (req,res)=>{
    res.send("Hi from the server")
})