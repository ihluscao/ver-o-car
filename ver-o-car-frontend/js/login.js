async function fazerLogin(username, password) {
    try {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            alert("Sucesso! Redirecionando para o painel...");
            window.location.href = "painel.html"; // Vai para a próxima tela
        } else {
            alert("Credenciais inválidas. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro no servidor:", error);
        alert("Servidor indisponível no momento.");
    }
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const usuarioDigitado = document.getElementById('username').value;
    const senhaDigitada = document.getElementById('password').value;

    fazerLogin(usuarioDigitado, senhaDigitada);
});