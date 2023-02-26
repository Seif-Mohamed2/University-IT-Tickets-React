University-IT-Tickets 


<h2>Introduction</h2>
University-IT-Tickets Is a full-stack application that serves students who have technical issues with their computers, university accounts, etc. In the platform they can sign in with their credentials and when they are logged in students are able to create tickets. Each created ticket gets assigned to an employee (with an algorithm that ensures each employee gets an equal number of tickets). <br/><br/>

On the other side of the platform, employees are able to login and browse the tickets that got assigned to them where they can review it and mark it as completed once the issue is solved. In addition employees are able to create tickets and assign them to specific student (in case a student makes a request over phone or email). <br/>

In addition, an user can be an employee or a manager. Managers have more authorities (they are able to create and delete employees and students). <br/>
<br/>
You can access the website through this link: 
https://university-it-tickets.onrender.com
<br/><br/>
To login as Manager or Admin:<br/>
Username: seifm<br/>
password : aaaa<br/>

To login as Employee:<br/>
Username: Employee1<br/>
password : aaaa<br/>

To login as Student:<br/>
Username: student1<br/>
password : aaaa<br/>

Note: it’s case sensitive. <br/>


<h2>Platform views and functionality</h2>

Once you open the platform you get to the login component, which does not require any authentication to access. Then you need to login:

![1](https://user-images.githubusercontent.com/105813102/221369033-627c770f-2f46-46ac-847a-d5d197eb93e2.JPG)

If you login as Admin you get the dashboard that gives you full control over the platform: 

![2](https://user-images.githubusercontent.com/105813102/221369042-35ed32df-946a-44ad-9c6a-33488c5c6edc.JPG)

You have options to: view or edit tickets, view or edit students, view or edit users(employees). 

You can access tickets list:

![3](https://user-images.githubusercontent.com/105813102/221369048-a5b3a1b9-2be4-4cd9-abba-2c88aa6a29df.JPG)

You can edit or create new Ticket: 

![4](https://user-images.githubusercontent.com/105813102/221369066-52ca56a9-ea8d-4c0f-991e-10c648e9294f.JPG)

Same thing with users and students lists: 

![5](https://user-images.githubusercontent.com/105813102/221369071-00a67e8c-8edb-4b5f-9e3d-e516019bb2cb.JPG)

You can also edit student or user(employee)

![6](https://user-images.githubusercontent.com/105813102/221369080-8c214dff-7178-4a60-be81-f25d64e6f78e.JPG)

Header components have hyperlinks to navigate to all options you can access. While footer have your username and your status. 

Note how it is different when you login as student in which you only have access to your tickets and when you create a new ticket you don’t have the option of assigning a specific user to it. 
![7](https://user-images.githubusercontent.com/105813102/221369088-b62983c9-b13c-41d8-90ac-d3544fd21ef0.JPG)
![8](https://user-images.githubusercontent.com/105813102/221369097-3c02b218-b026-4355-b9b6-e3799ea77b90.JPG)

<h2>Major components</h2>

<strong>Redux Store</strong>: in src/app there is the redux store created using redux toolkit that acts as the main store for the app. The store is used because different components are accessing and editing the same data so the redux store keeps everything consistent and synchronized. 

<br/>
src/app/api contains the main api slice to fetch and manipulate data from the api (the api is created using node and you can access the code for it here: https://github.com/Seif-Mohamed2/University-IT-Tickets-api ) 


There are 4 apiSlice files for each feature, all of them inject additional endpoints to the main apliSlice file. 
<br/><br/>

<strong>Authentication</strong>: src/features/auth/RequireAuth is wrapped around all routes dash routes in index.js and it allows users with specific roles to access specific data.  
<br/> src/hooks/useAuth provides the application with the current user cookie. Using cookie token content the application is able to provide the necessary data for this user and prohibit them from accessing data they shouldn’t be accessing. 
<br/>
<h2>How to run</h2> 
 
```powershell
npm start
```


