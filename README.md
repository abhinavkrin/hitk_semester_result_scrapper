### TO RUN
install dependencies
```
npm run install
```

#### To pass roll numbers and sem as command line arguments 
For a single roll number:
```
npm run start <sem> <rollno>
```
example-
```
npm run start 2 12620002001
```

For a range of roll numbers:
```
npm run start <sem> <starting_rollno> <ending_rollno>
```
example-
```
npm run start 2 12620002001 12620002080
```

#### To set roll number and sem manually:
set starting roll, ending roll and semester number in result.js
```
...
const startTime = new Date().getTime();
const START_ROLL = 1261900xxx;
const END_ROLL = 1261900xxx;
const SEMESTER = 4;
scrap(SEMESTER,START_ROLL,END_ROLL)
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
