document.addEventListener('DOMContentLoaded', function() {
    var titleInput = document.getElementById('title-input');
    var messageInput = document.getElementById('message-input');
    var sendButton = document.getElementById('send-button');
    var progressBar = document.getElementById('progress');
    var progressBarContainer = document.getElementById('progress-bar');
    var footer = document.querySelector('footer');
    var moveAllUsersButton = document.getElementById('move-all-users-button');
    var moveSelectedUsersButton = document.getElementById('move-selected-users-button');
    var moveSelectedBackButton = document.getElementById('move-selected-back-button');
    var userList = document.getElementById('user-list');
    var userListPart3 = document.getElementById('user-list-part3');
    var searchUserList = document.getElementById('search-user-list');
    var searchUserListPart3 = document.getElementById('search-user-list-part3');
    var selectAllUsersButton = document.getElementById('select-all-users');
    var selectAllUsersPart3Button = document.getElementById('select-all-users-part3');
    var originalUserCount = 0; // Variable to store the original total number of users
    var emptyMessagePart1 = document.getElementById('empty-message-part1');
    var emptyMessagePart3 = document.getElementById('empty-message-part3');
    var templateDropdown = document.getElementById('templateDropdown');
    const baseUrl = window.location.origin;

    // Hide footer and progress bar initially
    footer.style.display = 'none';

    function toggleSendButton() {
        var usersInPart3 = userListPart3.querySelectorAll('li').length > 0;
        var titleFilled = titleInput.value.trim() !== '';
        var messageFilled = messageInput.value.trim() !== '';

        var isEnabled = usersInPart3 && titleFilled && messageFilled;
        sendButton.disabled = !isEnabled;

        if (isEnabled) {
            sendButton.querySelector('img').classList.remove('grayscale');
        } else {
            sendButton.querySelector('img').classList.add('grayscale');
        }
    }

    titleInput.addEventListener('input', toggleSendButton);
    messageInput.addEventListener('input', toggleSendButton);
    sendButton.addEventListener('click', ()=>{
        var title = titleInput.value;
        var message = messageInput.value;
        var users = Array.from(userListPart3.querySelectorAll('li')).map(li => {
            return li.textContent.split('-')[1].trim(); // Convert to integer
        });
        console.log(users)
        var numberOfUsers = users.length;

        var dialogMessage = 'Title: ' + title + '\nMessage: ' + message + '\nNumber of users: ' + numberOfUsers;
        var dialog = confirm(dialogMessage);
    });

    sendButton.addEventListener('click', function() {
        var title = titleInput.value;
        var message = messageInput.value;
        var users = Array.from(userListPart3.querySelectorAll('li')).map(li => {
            return li.textContent.split('-')[1].trim(); // Convert to integer
        });
        console.log(users)
        var numberOfUsers = users.length;

        var dialogMessage = 'Title: ' + title + '\nMessage: ' + message + '\nNumber of users: ' + numberOfUsers;
        var dialog = confirm(dialogMessage);

        if (dialog) {
            appendToJsonFile(users, title, message); // Append the new data to the JSON file
            showFooterAndProgressBar(numberOfUsers); // Show footer and progress bar based on users in part3
        }
    });

    function appendToJsonFile(newUsers, title, message) {
        var newData = {
            "Title": title,
            "Message": message,
            "users": newUsers
        };

        fetch(`${baseUrl}/pushnotificationtodb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Success:', responseData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function showFooterAndProgressBar(usersInPart3) {
        footer.style.display = 'block'; // Show footer
        progressBarContainer.classList.remove('hidden'); // Show progress bar
        var width = 0;
        var targetWidth = 100;
        var interval = setInterval(function() {
            if (width >= targetWidth) {
                clearInterval(interval);
                showSaveTemplateDialog(); // Display save template dialog after progress bar completes
            } else {
                width++;
                progressBar.style.width = width + '%';
            }
        }, 20); // Adjust interval time as needed
    }

    function saveTemplatesJSON(title, message) {
        var newEntry = {
            template: [
                { title: title, message: message }
            ]
        };

        try {
            const response = fetch(`${baseUrl}/pushtemplatetodb`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = response.json();
            console.log('Success:', responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to display the save template dialog
    function showSaveTemplateDialog() {
        var title = titleInput.value;
        var message = messageInput.value;

        var dialogMessage = 'Do you want to save this as template?\n\nTitle: ' + title + '\nMessage: ' + message;
        var dialogResult = window.confirm(dialogMessage);

        if (dialogResult) {
            saveTemplatesJSON(title, message)

            // Perform the action to save the template here
        }
        // Reload the page after the dialog box closes
        location.reload();
    }

    // Adjust interval time as needed

    // Move all users from Part 1 to Part 3
    moveAllUsersButton.addEventListener('click', function() {
        var listItems = Array.from(userList.children); // Create an array from the list items
        listItems.forEach(function(listItem) {
            listItem.querySelector('input[type="checkbox"]').checked = false;
            userListPart3.appendChild(listItem);
        });
        moveAllUsersButton.style.display = 'none'; // Hide the ALL button
        resetSelectAllButtons(); // Reset the select all buttons
        toggleSendButton(); // Check if send button should be enabled
        updateEmptyMessage();
    });

    // Move selected users from Part 1 to Part 3
    moveSelectedUsersButton.addEventListener('click', function() {
        var checkboxes = userList.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(function(checkbox) {
            var listItem = checkbox.parentElement;
            checkbox.checked = false; // Uncheck the checkbox
            userListPart3.appendChild(listItem);
        });
        resetSelectAllButtons(); // Reset the select all buttons
        toggleSendButton(); // Check if send button should be enabled
        updateEmptyMessage();
    });

    // Move selected users from Part 3 to Part 1
    moveSelectedBackButton.addEventListener('click', function() {
        var checkboxes = userListPart3.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(function(checkbox) {
            var listItem = checkbox.parentElement;
            checkbox.checked = false; // Uncheck the checkbox
            userList.appendChild(listItem);
        });
        resetSelectAllButtons(); // Reset the select all buttons
        toggleSendButton(); // Check if send button should be enabled
        updateEmptyMessage();
    });

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
                        titleInput.value = selectedTemplate.title;
                        messageInput.value = selectedTemplate.message;
                        toggleSendButton(); // Check if send button should be enabled
                    }
                })
                .catch(error => console.error('Error fetching template details:', error));
        } else {
            titleInput.value = '';
            messageInput.value = '';
            toggleSendButton(); // Check if send button should be enabled
        }
    });

    // Search function
    function searchUsers(searchInput, list) {
        var filter = searchInput.value.toLowerCase();
        var listItems = list.getElementsByTagName('li');
        Array.from(listItems).forEach(function(item) {
            var text = item.textContent || item.innerText;
            if (text.toLowerCase().indexOf(filter) > -1) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    searchUserList.addEventListener('input', function() {
        searchUsers(searchUserList, userList);
    });

    searchUserListPart3.addEventListener('input', function() {
        searchUsers(searchUserListPart3, userListPart3);
    });

    // Select all checkboxes function
    function selectAllCheckboxes(button, list) {
        var listItems = list.getElementsByTagName('li');
        var allChecked = button.textContent === 'Deselect All';
        Array.from(listItems).forEach(function(item) {
            var itemCheckbox = item.querySelector('input[type="checkbox"]');
            itemCheckbox.checked = !allChecked;
        });
        button.textContent = allChecked ? 'Select All' : 'Deselect All';
    }

    selectAllUsersButton.addEventListener('click', function() {
        selectAllCheckboxes(selectAllUsersButton, userList);
    });

    selectAllUsersPart3Button.addEventListener('click', function() {
        selectAllCheckboxes(selectAllUsersPart3Button, userListPart3);
    });

    // Function to reset the select all buttons
    function resetSelectAllButtons() {
        selectAllUsersButton.textContent = 'Select All';
        selectAllUsersPart3Button.textContent = 'Select All';
    }

    // Function to update the empty message and toggle visibility of search and select all buttons
    function updateEmptyMessage() {
        var userCountPart1 = userList.querySelectorAll('li').length;
        var userCountPart3 = userListPart3.querySelectorAll('li').length;

        emptyMessagePart1.style.display = userCountPart1 === 0 ? 'block' : 'none';
        emptyMessagePart3.style.display = userCountPart3 === 0 ? 'block' : 'none';
        searchUserList.style.display = userCountPart1 === 0 ? 'none' : 'block';
        searchUserListPart3.style.display = userCountPart3 === 0 ? 'none' : 'block';
        selectAllUsersButton.style.display = userCountPart1 === 0 ? 'none' : 'block';
        selectAllUsersPart3Button.style.display = userCountPart3 === 0 ? 'none' : 'block';

        // Toggle the visibility of the ALL button based on the user count in part 1
        moveAllUsersButton.style.display = userCountPart1 === 0 ? 'none' : 'block';
    }

    // Initial update of the empty messages
    updateEmptyMessage();
    

    // New functions to handle form submission and dropdown change
    /*function handleSubmit(event) {
        event.preventDefault();

        const options = document.getElementById('options').value;
        const title = document.getElementById('title').value;
        const message = document.getElementById('message').value;
        const extraInput = document.getElementById('extra-input').value;

        let url;
        let params = new URLSearchParams();

        params.append('options', options);
        params.append('title', encodeURIComponent(title));
        params.append('message', encodeURIComponent(message));

        if (options === 'bluboyid' || options === 'userid') {
            params.append('extra-input', encodeURIComponent(extraInput));
        }

        url = `${baseUrl}/selection?${params.toString()}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function handleDropdownChange() {
        const options = document.getElementById('options').value;
        const extraInputContainer = document.getElementById('extra-input-container');

        if (options === 'all') {
            extraInputContainer.style.display = 'none';
        } else {
            extraInputContainer.style.display = 'block';
        }
    }

    // Add event listeners for the new form and dropdown
    document.getElementById('options').addEventListener('change', handleDropdownChange);
    document.querySelector('form[onsubmit="handleSubmit(event)"]').addEventListener('submit', handleSubmit);*/
});
