const cheerio = require('cheerio');
const axios = require('axios').default;
const URL = "http://136.232.2.202:8084/stud21i.aspx";
const RESURL = "http://136.232.2.202:8084/hresult21i.aspx";
const fs = require('fs');


const startTime = new Date().getTime();
const START_ROLL = 0;
const END_ROLL = 0;
const SEMESTER = 4; // 1,2,3,4,5,6,7,8
scrap(START_ROLL,END_ROLL,SEMESTER)
.then(() => {
    const time = (new Date().getTime() - startTime)/1000;
    console.log("Done in "+time+"s")
})
.catch(e => console.error(e.message));


/**
 * 
 * @param {Number} start starting roll number
 * @param {Number} end ending roll number
 * @param {Number} sem 2, 4, 6 
 */
async function scrap(start,end,sem){
    const results = [];
    let resString = "";
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);
    const __EVENTTARGET = $("#__EVENTTARGET").val(); 
    const __EVENTARGUMENT = $("#__EVENTARGUMENT").val(); 
    const __VIEWSTATE = $("#__VIEWSTATE").val(); 
    const __PREVIOUSPAGE = $("#__PREVIOUSPAGE").val(); 
    const __EVENTVALIDATION = $("#__EVENTVALIDATION").val(); 

    const formData = {
        __EVENTTARGET: __EVENTTARGET?encodeURIComponent(__EVENTARGET):'',
        __EVENTARGUMENT: __EVENTARGUMENT?encodeURIComponent(__EVENTARGUMENT):'',
        __VIEWSTATE: __VIEWSTATE?encodeURIComponent(__VIEWSTATE):'',
        __PREVIOUSPAGE: __PREVIOUSPAGE?encodeURIComponent(__PREVIOUSPAGE):'',
        __EVENTVALIDATION: __EVENTARGUMENT?encodeURIComponent(__EVENTARGUMENT):''
    }
    
    let formBodyText = Object.keys(formData).map(key => key+'='+(formData[key]?formData[key]:'')).join('&')+'&PFAT=';
    let errors = 0, success = 0;
    for(let i=start; i<=end; i++){
        results.push(new Promise(async (resolve,reject )=> {
            try {
                const body = formBodyText+'&roll='+i+'&sem='+sem+'&Button1=Show+Result';
                const resultPage = await axios(RESURL,{
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: body
                }); 
                const $ = cheerio.load(resultPage.data);        
                const res1 = {
                    roll: $("#lblroll").text().replace('Roll No.','').trim(),
                    name: $("#lblname").text().replace('Name','').trim(),
                    sgpa: parseFloat($("#lblbottom2").text().replace('EVEN(4th.) SEMESTER:','').replace('SGPA','').trim(),10)
                }
                if(res1.roll){
                    resolve(res1);
                    success++;
                    console.log('Roll '+i+' '+res1.name+' '+res1.sgpa+' OK');
                } else {
                    throw new Error("Data not found for "+i);
                }
            } catch(e){
                errors++;
                console.log('Roll '+i+' Skipped');
                resolve(null);
            } 
        }))       
    }
    Promise.all(results)
    .then(data => {
        data
        .filter(d => d !== null)
        .sort((a,b)=>b.sgpa-a.sgpa)
        .forEach(res => {
            resString+=res.roll+','+res.name+','+res.sgpa+'\n';
        })
        console.log("Success: ",success);
        console.log("Error: ",errors);
        const fname = sem+'sem_'+start+'to'+end+'.csv';
        fs.writeFileSync(__dirname+'/'+fname,resString);
        console.log('Saved in '+fname);
    })
}