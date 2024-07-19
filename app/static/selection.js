
const options_list = document.getElementById('options');
const extraInputContainer = document.getElementById('extra-input-container');
const trackerInfo = document.getElementById("tracker-info");
const serverInfo = document.getElementById("server-info")
const operationStatus = document.getElementById("operation-status");
const submitBtn = document.getElementById("send-button");
var titleInput = document.getElementById("title")
var messageInput = document.getElementById("message")
const baseUrl = window.location.origin;
var IntervalId ;
var num_users_with_tokens;
var handleSubmitTriggered = false;
function toggleSendButton() {
    var titleFilled = title.value.trim() !== '';
    var messageFilled = message.value.trim() !== '';
    var isEnabled = (titleFilled && messageFilled) && !handleSubmitTriggered;
    submitBtn.disabled = !isEnabled;
 
    if (isEnabled) {
        submitBtn.querySelector('img').classList.remove('grayscale');
    } else {
        submitBtn.querySelector('img').classList.add('grayscale');
    }
}
fetch(`${baseUrl}/templatesfetchfromdb`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(templates => {
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.title;
                option.textContent = template.title; // Use textContent to set the option's text
                // Truncate message to first 4 words and add "..."
                const truncatedMessage = template.message.split(' ').slice(0, 4).join(' ') + '...';
                option.textContent = `${template.title} | ${truncatedMessage}`;
                templateDropdown.appendChild(option);
            });
            toggleSendButton(); // Check if send button should be enabled
        })
        .catch(error => console.error('Error loading final templates:', error));
 
    // Handle dropdown change event
    templateDropdown.addEventListener('change', function() {
        const selectedTitle = this.value;
        if (selectedTitle) {
            fetch(`${baseUrl}/templatesfetchfromdb`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(templates => {
                    const selectedTemplate = templates.find(template => template.title === selectedTitle);
                    if (selectedTemplate) {
                        title.value = selectedTemplate.title;
                        message.value = selectedTemplate.message;
                        toggleSendButton(); // Check if send button should be enabled
                    }
                })
                .catch(error => console.error('Error fetching template details:', error));
        } else {
            title.value = '';
            message.value = '';
            toggleSendButton(); // Check if send button should be enabled
        }
    });

titleInput.addEventListener('input',() => {
    toggleSendButton();
})
messageInput.addEventListener('input',()=>{
    toggleSendButton();
})

// Function to initialize local storage with default values

function initializeLocalStorage() {
    
    // Check if status and type are already in local storage
    if (!localStorage.getItem('status')) 
        localStorage.setItem('status', '-1');

    if (!localStorage.getItem('type')) 
        localStorage.setItem('type', '0');
}

// Function to load values from local storage when the page finishes loading

function loadFromLocalStorage() {
    
    // Get status and type from local storage
    const status = localStorage.getItem('status');
    const type = localStorage.getItem('type');

    // if status = 0 then we have not request the server to check for uninstalls
    // otherwise we have sent request to server and 
    // have to keep checking the progress of notifier

    if (status === '-1') {
        
        console.log("NOT RUNNING")
        localStorage.setItem('type', '0');

    } else {
        
        console.log("RUNNING")
        submitBtn.disabled = true
        options_list.disabled = true
        submitBtn.querySelector('img').classList.add('grayscale');
        handleSubmitTriggered = true
        if (type === '0') 
            options_list.value = "all"
        else if (type === '1') 
            options_list.value = "userid"
        else
            options_list.value = "bluboyid"
        handleDropdownChange()
        IntervalId = setInterval(()=>checkStatus(Number(status)),2000)
    }
}

// Function to get total number of users and number of users with tokens

async function getUsers(){
    fetch(`${baseUrl}/test/tracker`)
    .then(response => response.json())
    .then(data=>{

        if (localStorage.getItem('type') === '0') {
            trackerInfo.innerHTML=`
            <div>
                <p>Number of Users : ${data["num_users"]} </p>
                <p>Number of Users with Tokens in DB: ${data["num_users_with_tokens"]}</p>
                <p>Number of Logged Out Users: ${data["num_logged_out"]}</p>    
            </div>`    
        }
        num_users_with_tokens = data["num_users_with_tokens"]
    })
}



// Initialize local storage with default values
initializeLocalStorage();

// Load values from local storage when the page finishes loading
loadFromLocalStorage();

// Get Users
getUsers()

// This function is called when the submit button is clicked

async function handleSubmit(event) {

    event.preventDefault();
    submitBtn.disabled = true
    submitBtn.querySelector('img').classList.add('grayscale');
    options_list.disabled = true
    handleSubmitTriggered = true
    // Sets status to 1 indicating there was a request sent to the server
    // localStorage.setItem('status', '1');

    const options = options_list.value;
    const title = titleInput.value;
    const message = messageInput.value;
    const extraInput = document.getElementById('extra-input').value;
    
    let url;
    let data = {
        title: title,
        message: message
    };
    
    // Creates URL to hit and displays information related to each option

    if (options === 'all') 
        url = `${baseUrl}/notifications/all`;

    else if (options === 'bluboyid') {
        url = `${baseUrl}/notifications/bluboyids`;
        data.bluboyid = extraInput.split(',').map(item => item.trim());
        trackerInfo.innerHTML = `
            <div>
                <p>Number of BluBoy Ids To Check: ${data.bluboyid.length}</p>
            </div>`
    
    } else if (options === 'userid') {
        url = `${baseUrl}/notifications/userids`;
        data.userid = extraInput.split(',').map(item => item.trim());
        trackerInfo.innerHTML = `
            <div>
                <p>Number of User Ids To Check: ${data.userid.length}</p>
            </div>`
    }
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        console.log(data["id"])
        localStorage.setItem('status', data["id"].toString())
        IntervalId = setInterval(() => checkStatus(data["id"]),2000)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function checkStatus(id){
    console.log(`ID IN CHECK STATUS ${id}`)
    fetch(`${baseUrl}/test/dictionary`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:id})
    })
    .then(async (response) => {
        if (!response.ok) {
    
            clearInterval(IntervalId)
            localStorage.setItem('status', '-1');

            handleSubmitTriggered = false
            options_list.disabled = false 
            toggleSendButton()
            throw new Error('Network response was not ok ' + response.statusText);
        
        } else {

            var responseJSON = await response.json()
            if (responseJSON["exists"]) {
                localStorage.setItem('status', '-1');
                clearInterval(IntervalId)
                handleSubmitTriggered = false
                options_list.disabled = false
                toggleSendButton()
                return;
            }
            obj = responseJSON["result"].split("\n")
        
            if (options_list.value === "all") {
                serverInfo.innerHTML = `
                    <div>
                        <p>NUMBER OF TOKENS CHECKED : ${obj[1]}/${num_users_with_tokens}</p>
                        <p>NUMBER OF SUCCESS : ${obj[2]}</p>
                        <p>NUMBER OF FAILURES : ${obj[3]}</p>
                    </div>`

            } else if (options_list.value === "bluboyid" || options_list.value === "userid") {
                serverInfo.innerHTML = `
                    <div>
                        <p>NUMBER OF USERS WITH TOKENS: ${obj[1]}</p>
                        <p>NUMBER OF SUCCESS : ${obj[2]}</p>
                        <p>NUMBER OF FAILURES : ${obj[3]}</p>
                    </div>
                `
            } 
            if (obj[0] === "done") {

                console.log("DONE")
                localStorage.setItem('status', '-1');
                clearInterval(IntervalId)

                handleSubmitTriggered = false
                options_list.disabled = false
                toggleSendButton()
                operationStatus.innerHTML = `<h3>DONE</h3>`

            } else {
                console.log("ONGOING")
                operationStatus.innerHTML = `<h3>ONGOING</h3>`
            }
            
        }
    })
}

async function handleDropdownChange() {
    const options = options_list.value;

    if (options === 'all') {
        
        extraInputContainer.style.display = 'none';
        localStorage.setItem('type', '0');

        await fetch(`${baseUrl}/test/tracker`)
        .then(response => response.json())
        .then(data=>{
        
            trackerInfo.innerHTML=`
            <div>
                <p>Number of Users : ${data["num_users"]} </p>
                <p>Number of Users with Tokens in DB: ${data["num_users_with_tokens"]}</p>
                <p>Number of Logged Out Users: ${data["num_logged_out"]}</p>    
            </div>
            `    
            num_users_with_tokens = data["num_users_with_tokens"]
        })

    } else {
        if (options === "userid") 
            localStorage.setItem('type', '1');
        else 
            localStorage.setItem('type', '2');

        
        extraInputContainer.style.display = 'block';
        trackerInfo.innerHTML=``
    }
    serverInfo.innerHTML=``
    operationStatus.innerHTML=``
}
