document.addEventListener('DOMContentLoaded', () => {
    const containerChamados = document.getElementById('lista-chamados');

    const chamados = JSON.parse(localStorage.getItem('chamados')) || [];

    if (chamados.length === 0) {
        containerChamados.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Nenhum chamado aberto no momento.</p>';
        return;
    }

    chamados.forEach(chamado => {
        const card = document.createElement('div');
        card.className = 'card-chamado';

        // Define a classe da cor do status com base no valor
        let classeStatus = 'status-aberto';
        if (chamado.status === 'Em Andamento') classeStatus = 'status-andamento';
        if (chamado.status === 'Resolvido') classeStatus = 'status-resolvido';

        // Monta a lista de comentários
        let htmlComentarios = '';
        if (chamado.comentarios && chamado.comentarios.length > 0) {
            chamado.comentarios.forEach(com => {
                htmlComentarios += `<div class="comentario-item">${com}</div>`;
            });
        } else {
            htmlComentarios = '<p class="comentario-vazio">Nenhum comentário ainda.</p>';
        }

        // Tratamento correto da evidência (declarado apenas uma vez!)
        let htmlEvidencia = '<span style="color: #888; font-style: italic; font-size: 0.8rem;">Nenhuma</span>';
        
        if (chamado.evidenciaAnexada) {
            const nomeArquivoExibicao = chamado.nomeArquivo || 'Ver Evidência';
            htmlEvidencia = `
                <a href="#" onclick="abrirModal('${chamado.evidenciaAnexada}')" class="link-evidencia" title="Clique para ampliar">
                    📎 ${nomeArquivoExibicao}
                </a>
            `;
        }

        // HTML limpo usando classes CSS
        card.innerHTML = `
            <div class="card-header">
                <strong>#${chamado.id} - ${chamado.nomeDoSolicitante}</strong>
                <span class="tag-status ${classeStatus}">${chamado.status}</span>
            </div>
            <p class="card-texto-secundario"><strong>Categoria:</strong> ${chamado.categoriaChamado}</p>
            <p class="card-texto-principal"><strong>Descrição:</strong> ${chamado.descricaoProblema}</p>
            
            <div class="card-footer">
                <span>Data: ${chamado.dataAbertura}</span>
                <span>Evidência: ${htmlEvidencia}</span>
            </div>

            <!-- Seção de Comentários -->
            <div class="secao-comentarios">
                <strong style="font-size: 0.85rem; color: #444;">Comentários:</strong>
                <div style="max-height: 100px; overflow-y: auto;">
                    ${htmlComentarios}
                </div>
                <div class="caixa-comentario-input">
                    <input type="text" id="input-comentario-${chamado.id}" placeholder="Escreva um comentário...">
                    <button class="btn-comentar" onclick="adicionarComentario(${chamado.id})">Comentar</button>
                </div>
            </div>

            <div class="card-botoes-status">
                <button class="btn-status-andamento" onclick="mudarStatus(${chamado.id}, 'Em Andamento')">Em Andamento</button>
                <button class="btn-status-resolver" onclick="mudarStatus(${chamado.id}, 'Resolvido')">Resolver</button>
                <button class="btn-excluir" onclick="excluirChamado(${chamado.id})">Excluir</button>
            </div>
        `;

        containerChamados.appendChild(card);
    });
});

// ==========================================
// FUNÇÕES GLOBAIS
// ==========================================

function mudarStatus(idChamado, novoStatus) {
    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];
    
    chamados = chamados.map(chamado => {
        if (chamado.id === idChamado) {
            chamado.status = novoStatus;
        }
        return chamado;
    });

    localStorage.setItem('chamados', JSON.stringify(chamados));
    location.reload();
}

function excluirChamado(idChamado) {
    if (!confirm('Tem certeza de que deseja excluir este chamado?')) {
        return;
    }

    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];
    chamados = chamados.filter(chamado => chamado.id !== idChamado);

    localStorage.setItem('chamados', JSON.stringify(chamados));
    location.reload();
}

function adicionarComentario(idChamado) {
    const inputTexto = document.getElementById(`input-comentario-${idChamado}`);
    const textoComentario = inputTexto.value.trim();

    if (!textoComentario) {
        alert('Digite um comentário antes de enviar!');
        return;
    }

    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];

    chamados = chamados.map(chamado => {
        if (chamado.id === idChamado) {
            if (!chamado.comentarios) chamado.comentarios = [];
            chamado.comentarios.push(textoComentario);
        }
        return chamado;
    });

    localStorage.setItem('chamados', JSON.stringify(chamados));
    location.reload();
}

// ==========================================
// FUNÇÕES DO MODAL DE IMAGEM
// ==========================================

// ==========================================
// FUNÇÕES DO MODAL DE IMAGEM (Com Fade)
// ==========================================

function abrirModal(base64Imagem) {
    const modal = document.getElementById('modal-imagem');
    const imgAmpliada = document.getElementById('img-ampliada');
    
    imgAmpliada.src = base64Imagem;
    modal.classList.add('ativo'); // Adiciona a classe que ativa o Fade In do CSS
}

function fecharModal() {
    const modal = document.getElementById('modal-imagem');
    modal.classList.remove('ativo'); // Remove a classe, fazendo o Fade Out
}

// Fecha o modal se o usuário clicar no fundo escuro fora da imagem
window.onclick = function(event) {
    const modal = document.getElementById('modal-imagem');
    if (event.target === modal) {
        fecharModal();
    }
}