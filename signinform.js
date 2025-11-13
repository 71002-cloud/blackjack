import { supabase } from './supabaseclient.js'

export async function initSigninform() {
    const emailEl = document.getElementById("email-el")
    const passwordEl = document.getElementById("password-el")
    const loginBtn = document.getElementById("login-btn")
    const signupBtn = document.getElementById("signup-btn")
    const signUpEl = document.getElementById("signup")
    const signinformTextEl = document.getElementById("signinform-text")
    const loginEl = document.getElementById("login-el")

    let state = "login"

    loginBtn.addEventListener("click", function() {
        const emailFromUser = emailEl.value
        const passwordFromUser = passwordEl.value

        async function signInWithEmail() {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailFromUser,
                password: passwordFromUser,
            })

        console.log(data)
        }

        signInWithEmail()
    })

    signUpEl.addEventListener("click", function() {
        if (state === "login") {
            loginBtn.style = "display: none;"
            signupBtn.style = "display: block;"
            signinformTextEl.textContent = 'Har du en konto?'
            loginEl.textContent = "Sign up"
            state = "signup"
        } else if (state === "signup") {
            loginBtn.style = "display: block;"
            signupBtn.style = "display: none;"
            signinformTextEl.textContent = 'Mangler du en konto?'
            loginEl.textContent = "Login"
            state = "login"
        } else {
            console.log("Hva fuck")
        }
    })
}