import { supabase } from './supabaseclient.js';

const app = document.getElementById('app')

async function router() {
    const hash = window.location.hash || '#/'

    if (hash === '#/login') {
        await loadPage('signinform.html')
        const { initSigninform } = await import('./signinform.js')
        initSigninform()
    } else {
        await loadPage('blackjake.html')
        const { initBlackjack } = await import('./blackjake.js')
        initBlackjack()
    }
}

async function loadPage(path) {
    try {
        const html = await fetch(path).then(r => r.text())
        app.innerHTML = html
    } catch (err) {
        console.error('Failed to load', path, err)
        app.innerHTML = `<p>Could not load page: ${path}</p>`
    }
}

supabase.auth.onAuthStateChange((event, session) => {
    console.log('auth event:', event, session)

    if (event === 'SIGNED_IN') {
        window.location.hash = '#/'
    } else if (event === 'SIGNED_OUT') {
        window.location.hash = '#/login'
    }
})

window.addEventListener('hashchange', router)
window.addEventListener('load', async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
        window.location.hash = '#/'
    } else {
        window.location.hash = '#/login'
    }
    router()
})