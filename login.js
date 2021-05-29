

const baseUrl = "https://api.github.com/graphql";

const headers = {
    "Content-Type": "application/json",
    authorization: `token ${token} `,
}

const submitBtn = document.querySelector('.submit-btn')
const inputField = document.getElementById('username_field')
let username

const showToast  = (message) => {
    document.querySelector('.toast-message').textContent = message
    const toast = document.getElementById("toast")
    toast.className = "show";
    setTimeout(() => { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

const  getUser = () =>  {
    submitBtn.innerHTML = '<div class="loader form"></div>'
    submitBtn.disabled = true
    fetch(baseUrl, {
        method: "POST",
        headers: headers,
        mode: "cors",
        cache: "no-cache",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            query: `
            query { 
                user(login: "${username}") {
                    name
                    email
                    company
                    bio
                    location
                    login
                    avatarUrl
                    followers{
                        totalCount
                    }
                    following {
                        totalCount
                    }
                    status {
                        emojiHTML
                        message
                    }
                    starredRepositories {
                        totalCount
                    }
                    repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                        nodes {
                            name
                            url
                            updatedAt
                            isPrivate
                            primaryLanguage {
                                name
                                color
                            }
                            stargazerCount
                            forkCount
                            descriptionHTML
                            description
                        }
                        totalCount
                    }
                }
              }
                 
            `
        })
    })
    .then((res) => res.json())
        .then(({ data }) => {
            submitBtn.innerHTML = 'View Profile'
            submitBtn.disabled = false
            if (data.user) {
                localStorage.setItem('data', JSON.stringify(data))
                inputField.value = ''
                window.location.href = '/repos.html'
            } else {
                showToast('No record found for this user')
            }
        })
}
document.getElementById('submitUsername').addEventListener('click' , (e) => {
    e.preventDefault()
    if(!inputField.value) {
        showToast('Username field is required')
        return
    }
    username = inputField.value
    getUser()
})
