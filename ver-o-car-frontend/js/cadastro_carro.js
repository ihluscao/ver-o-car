// cadastro_carro.js
async function cadastrarCarro(dadosDoCarro) {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch('http://localhost:8000/api/veiculos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosDoCarro)
        });

        if (response.ok) {
            alert("Carro cadastrado no estoque com sucesso!");
            listarCarros();
        } else {
            const erroData = await response.json();

            if (erroData.erro) {
                alert(`Falha na validação: ${erroData.erro}`);
            } else {
                alert(`Erro do Servidor: ${JSON.stringify(erroData)}`);
            }
        }
    } catch (error) {
        alert("O servidor backend parece estar offline.");
    }
}
