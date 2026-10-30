document.addEventListener('DOMContentLoaded', () => {
    // Selecionando os elementos do DOM
    const form = document.getElementById('form-chamado');
    const inputNome = document.getElementById('nome');
    const selectCategoria = document.getElementById('categoria');
    const textDescricao = document.getElementById('descricao');
    const inputEvidencia = document.getElementById('evidencia'); // Mantém o ID correto ('evidencia')
    const btnEnviar = document.getElementById('btn-enviar');
    const pMensagemDica = document.getElementById('mensagem-dica');

    // 1. Evento Mouse: Dica visual ao passar o cursor sobre o botão (mouseenter)
    btnEnviar.addEventListener('mouseenter', () => {
        pMensagemDica.textContent = 'Dica: Certifique-se de preencher todos os campos obrigatórios!';
        btnEnviar.style.transform = 'scale(1.02)';
    });

    btnEnviar.addEventListener('mouseleave', () => {
        pMensagemDica.textContent = '';
        btnEnviar.style.transform = 'scale(1)';
    });

    // 2. Evento Form: Validar, criar o objeto e salvar no localStorage ao enviar (submit)
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o recarregamento padrão da página

        // Captação e limpeza dos valores digitados
        const nome = inputNome.value.trim();
        const categoria = selectCategoria.value;
        const descricao = textDescricao.value.trim();
        const arquivoEvidencia = inputEvidencia ? inputEvidencia.files[0] : null;

        // Validação dos campos obrigatórios
        if (nome === '' || categoria === '' || descricao === '') {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return; // Paralisa a execução caso falte algum dado
        }

        // Se o usuário anexou um arquivo, lemos via FileReader para converter em Base64
        if (arquivoEvidencia) {
            const leitor = new FileReader();

            leitor.onload = function(eventoLeitura) {
                const base64Imagem = eventoLeitura.target.result;

                const chamadoObj = {
                    id: Date.now(),
                    nomeDoSolicitante: nome,
                    categoriaChamado: categoria,
                    descricaoProblema: descricao,
                    evidenciaAnexada: base64Imagem, // Imagem convertida em texto
                    nomeArquivo: arquivoEvidencia.name, // Nome original para o link
                    dataAbertura: new Date().toLocaleString('pt-BR'),
                    status: 'Aberto',
                    comentarios: []
                };

                salvarERedirecionar(chamadoObj);
            };

            leitor.readAsDataURL(arquivoEvidencia);
        } else {
            // Caso nenhum arquivo tenha sido anexado
            const chamadoObj = {
                id: Date.now(),
                nomeDoSolicitante: nome,
                categoriaChamado: categoria,
                descricaoProblema: descricao,
                evidenciaAnexada: null,
                nomeArquivo: null,
                dataAbertura: new Date().toLocaleString('pt-BR'),
                status: 'Aberto',
                comentarios: []
            };

            salvarERedirecionar(chamadoObj);
        }
    });
});

// ==========================================
// FUNÇÃO AUXILIAR GLOBAL
// ==========================================
function salvarERedirecionar(obj) {
    const chamadosSalvos = JSON.parse(localStorage.getItem('chamados')) || [];
    chamadosSalvos.push(obj);
    localStorage.setItem('chamados', JSON.stringify(chamadosSalvos));
    
    alert('Chamado aberto com sucesso!');
    window.location.href = 'index.html';
}