### TO RUN
install dependencies
```
npm run install
```
#### To pass roll numbers and sem as command line arguments 
```
npm run start <starting_rollno> <ending_rollno> <sem>
```
example-
```
npm run start 12620002001 12620002080 2
```
#### To set roll number and sem manually:

set starting roll, ending roll and semester number in result.js
```
...
const startTime = new Date().getTime();
const START_ROLL = 1261900xxx;
const END_ROLL = 1261900xxx;
const SEMESTER = 4;
scrap(START_ROLL,END_ROLL,SEMESTER)
.then(() => {
    const time = (new Date().getTime() - startTime)/1000;
    console.log("Done in "+time+"s")
})
...
```

Run the script
```
npm run start
```
