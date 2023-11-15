//const express = require('express')
import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
const port = 3000;
require("dotenv").config();

async function main(){
//import mysql from 'mysql2/promise';
const db = await mysql.createPool({
		host:process.env.DB_HOST,
		user:process.env.DB_USER,
		password:process.env.DB_PW,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		waitForConnections: true,
		insecureAuth: true
});

// missions completed
const [rows1,fields1]= await db.query(`select m.point,s.name,m.name from member_mission as c inner join mission as m on m.id = c.mission_id inner join store as s on s.id = m.store_id where c.status = 'done' and c.user_id = (select id from user where name='eunjin')`);
console.log(rows1);
// missions doing by user
const [ result2 ] = await db.query(`select m.point,s.name,m.name from member_mission as c inner join mission as m on m.id = c.mission_id inner join store as s on s.id = m.store_id where c.status = 'ing' and c.user_id = (select id from user where name='eunjin')`);
console.log(result2);
// show reviews
const [ result3 ] = await db.query(`select m.*, s.name, s.info, (now()-m.createdAt) as period from mission as m left join store as s on s.dong='seongbukgu' where s.id = m.store_id and m.id not in (select mission_id from member_mission where user_id = (select id from user as u where name='eunjin'))`);
console.log(result3);
// search missions that can be completed 
const [result4] = await db.query(`select * from mission where store_id = any(select id from store where dong='seongbukgu') and id not in (select mission_id from member_mission where user_id = (select id from user where name ='eunjin'))`);
console.log(result4);
// get name, email, phone info
const [result5] = await db.query(`select name, email, phone from user where id =2023`);
console.log(result5);
// get the user's point
const [result6] = await db.query(`select sum(m.point) from member_mission as c inner join mission as m on m.id = c.mission_id where c.status="done"`);
console.log(result6);

}

main();
//console.log(test1);

app.get('/', (req, res) => {
  //res.send('Hello World!testing nodemon....')
	res.send("testing");	
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
